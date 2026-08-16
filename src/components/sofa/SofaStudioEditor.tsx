"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as THREE from "three";
import { toast } from "sonner";
import { AppButton } from "@/components/app/AppButton";
import { AppDialog } from "@/components/app/AppDialog";
import { AppImage } from "@/components/app/AppImage";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { SiteIcon, SiteIconName } from "@/components/icons/SiteIcon";
import { useApi } from "@/hooks/use-api";
import { storefrontProducts, type StorefrontProduct } from "@/lib/storefront-pages";
import type { CustomerSavedDesign } from "@/types/customer";

type ModuleKind = "seat" | "chaise" | "corner" | "ottoman" | "chair" | "table" | "bed" | "storage";

type SofaModule = {
  id: string;
  kind: ModuleKind;
  label: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
};

type ProductPreset = {
  id: string;
  name: string;
  image: string;
  fabric: string;
  color: string;
  leg: string;
  category: StorefrontProduct["category"];
  subcategory: string;
  price: number;
  modules: SofaModule[];
};

type RoomPhoto = {
  id: string;
  name: string;
  url: string;
};

type PlacementPoint = {
  x: number;
  y: number;
};

type CustomerFlowOrder = {
  id: number;
  reference: string;
};

type SceneProps = {
  modules: SofaModule[];
  selectedId: string;
  color: string;
  fabric: string;
  leg: string;
  zoom: number;
  autoRotate: boolean;
  onSelect: (id: string) => void;
  onChange: (modules: SofaModule[]) => void;
  onZoomChange: (zoom: number) => void;
};

const fabrics = ["Performance Linen", "Soft Boucle", "Pet Friendly Weave", "Velvet Touch", "Chenille Weave"];
const colors = ["Ivory", "Warm Beige", "Forest", "Walnut", "Charcoal", "Clay"];
const legs = ["Hidden", "Oak", "Walnut", "Black Metal"];
const roomSizes = ["Apartment", "Family Room", "Open Plan", "Dining Room", "Bedroom", "Showroom"];
const styles = ["Warm Minimal", "Urban Luxury", "Natural Calm", "Statement Lounge"];
const productCategoryLabels: Record<StorefrontProduct["category"] | "all", string> = {
  all: "All",
  sofas: "Sofas",
  "living-room": "Living Room",
  dining: "Dining",
  bedroom: "Bedroom",
  "new-arrivals": "New Arrivals"
};

const colorTokens: Record<string, string> = {
  Ivory: "#f1eadf",
  "Warm Beige": "#d8c6ad",
  Forest: "#65745a",
  Walnut: "#6b4b35",
  Charcoal: "#2e2e2e",
  Clay: "#b87658"
};

const fabricTextures: Record<string, number> = {
  "Performance Linen": 0.72,
  "Soft Boucle": 0.95,
  "Pet Friendly Weave": 0.64,
  "Velvet Touch": 0.52,
  "Chenille Weave": 0.82
};

const createModule = (kind: ModuleKind, x: number, z: number, index: number): SofaModule => {
  const dimensions: Record<ModuleKind, Pick<SofaModule, "width" | "depth" | "height">> = {
    seat: { width: 1.15, depth: 1.05, height: 0.62 },
    chaise: { width: 1.15, depth: 1.82, height: 0.62 },
    corner: { width: 1.18, depth: 1.18, height: 0.68 },
    ottoman: { width: 1.08, depth: 0.95, height: 0.44 },
    chair: { width: 0.78, depth: 0.78, height: 0.64 },
    table: { width: 1.55, depth: 0.9, height: 0.52 },
    bed: { width: 1.75, depth: 2.25, height: 0.55 },
    storage: { width: 1.7, depth: 0.42, height: 0.9 }
  };

  return {
    id: `${kind}-${index}-${Math.round((x + z) * 100)}`,
    kind,
    label: kind === "seat" ? "Seat" : kind === "chaise" ? "Chaise" : kind === "corner" ? "Corner" : kind === "chair" ? "Chair" : kind === "table" ? "Table" : kind === "bed" ? "Bed" : kind === "storage" ? "Storage" : "Ottoman",
    x,
    z,
    ...dimensions[kind]
  };
};

function productKind(product: StorefrontProduct): ModuleKind {
  const text = `${product.name} ${product.subcategory}`.toLowerCase();

  if (text.includes("bed") || text.includes("mattress")) {
    return "bed";
  }

  if (text.includes("table") || text.includes("console")) {
    return "table";
  }

  if (text.includes("chair") || text.includes("stool")) {
    return "chair";
  }

  if (text.includes("sideboard") || text.includes("wardrobe") || text.includes("dresser") || text.includes("cabinet") || text.includes("chest")) {
    return "storage";
  }

  if (text.includes("ottoman") || text.includes("bench")) {
    return "ottoman";
  }

  return text.includes("l shape") || text.includes("modular") || text.includes("corner") ? "corner" : "seat";
}

function productModules(product: StorefrontProduct): SofaModule[] {
  const kind = productKind(product);

  if (kind === "corner") {
    return [createModule("corner", -1.05, 0, 1), createModule("seat", 0.15, 0, 2), createModule("chaise", -1.05, 1.12, 3)];
  }

  if (kind === "seat") {
    return [createModule("seat", -1.15, 0.12, 1), createModule("seat", 0, 0.12, 2), createModule("seat", 1.15, 0.12, 3)];
  }

  if (kind === "chair") {
    return [createModule("chair", -0.5, 0.15, 1), createModule("chair", 0.5, 0.15, 2)];
  }

  return [createModule(kind, 0, 0.2, 1)];
}

const presets: ProductPreset[] = storefrontProducts.map((product) => ({
  id: product.slug,
  name: product.name,
  image: product.image,
  fabric: product.category === "dining" ? "Performance Linen" : product.category === "bedroom" ? "Velvet Touch" : "Soft Boucle",
  color: product.colors?.[2] === "#0d5f43" ? "Forest" : product.category === "bedroom" ? "Warm Beige" : "Ivory",
  leg: product.category === "dining" ? "Oak" : product.category === "living-room" ? "Walnut" : "Hidden",
  category: product.category,
  subcategory: product.subcategory,
  price: product.price,
  modules: productModules(product)
}));

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ToolbarButton({ label, icon, active, onClick }: { label: string; icon: SiteIconName; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative grid size-10 place-items-center rounded-md border ${active ? "border-white bg-white text-neutral-950" : "border-white/15 text-white hover:bg-white/10"}`}
      aria-label={label}
    >
      <SiteIcon name={icon} className="size-4" />
      <span className="pointer-events-none absolute -bottom-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs font-bold text-neutral-950 opacity-0 shadow-lg transition group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

function SofaScene({ modules, selectedId, color, fabric, leg, zoom, autoRotate, onSelect, onChange, onZoomChange }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modulesRef = useRef(modules);
  const selectedRef = useRef(selectedId);
  const zoomRef = useRef(zoom);
  const autoRotateRef = useRef(autoRotate);
  const onSelectRef = useRef(onSelect);
  const onChangeRef = useRef(onChange);
  const onZoomChangeRef = useRef(onZoomChange);

  useEffect(() => {
    modulesRef.current = modules;
  }, [modules]);

  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    onSelectRef.current = onSelect;
    onChangeRef.current = onChange;
    onZoomChangeRef.current = onZoomChange;
  }, [onChange, onSelect, onZoomChange]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#111111");
    scene.fog = new THREE.Fog("#111111", 9, 18);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.dataset.testid = "sofa-3d-canvas";
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.HemisphereLight("#ffffff", "#8a7964", 1.45);
    const keyLight = new THREE.DirectionalLight("#fff2dd", 2.25);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    scene.add(ambientLight, keyLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.MeshStandardMaterial({ color: "#d8cfc2", roughness: 0.88, metalness: 0 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(14, 28, "#827866", "#b8ad9e");
    grid.position.y = 0.01;
    scene.add(grid);

    const room = new THREE.Group();
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(14, 4, 0.12), new THREE.MeshStandardMaterial({ color: "#24211d", roughness: 0.9 }));
    backWall.position.set(0, 2, -4.6);
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4, 9.2), new THREE.MeshStandardMaterial({ color: "#191816", roughness: 0.9 }));
    leftWall.position.set(-6.8, 2, 0);
    room.add(backWall, leftWall);
    scene.add(room);

    const sofaGroup = new THREE.Group();
    scene.add(sofaGroup);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const dragPoint = new THREE.Vector3();
    const groups = new Map<string, THREE.Group>();
    let sceneSignature = "";
    let draggedId = "";
    let pointerDown = false;
    let orbit = -0.62;

    const applyCamera = () => {
      const distance = 9 - zoomRef.current * 3.6;
      camera.position.set(Math.sin(orbit) * distance, 4.8 - zoomRef.current * 1.2, Math.cos(orbit) * distance);
      camera.lookAt(0, 0.55, 0.1);
    };

    const makeBox = (width: number, height: number, depth: number, material: THREE.Material, x: number, y: number, z: number, name: string) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
      mesh.position.set(x, y, z);
      mesh.name = name;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    const disposeObject = (object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
        object.geometry.dispose();

        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    };

    const rebuildSofa = () => {
      sofaGroup.traverse(disposeObject);
      sofaGroup.clear();
      groups.clear();

      const baseColor = colorTokens[color] ?? colorTokens.Ivory;
      const roughness = fabricTextures[fabric] ?? 0.75;
      const fabricMaterial = new THREE.MeshStandardMaterial({ color: baseColor, roughness, metalness: 0.03 });
      const trimMaterial = new THREE.MeshStandardMaterial({ color: "#f8f3ea", roughness: 0.75, metalness: 0.02 });
      const woodMaterial = new THREE.MeshStandardMaterial({ color: leg === "Black Metal" ? "#151515" : leg === "Walnut" ? "#5b3926" : "#c49b6c", roughness: 0.46, metalness: leg === "Black Metal" ? 0.45 : 0.05 });

      modulesRef.current.forEach((module) => {
        const group = new THREE.Group();
        group.position.set(module.x, 0, module.z);
        group.userData.moduleId = module.id;

        if (module.kind === "table") {
          group.add(makeBox(module.width, 0.12, module.depth, trimMaterial, 0, 0.68, 0, "table-top"));
          group.add(makeBox(0.16, 0.62, 0.16, woodMaterial, -module.width / 2 + 0.2, 0.34, -module.depth / 2 + 0.16, "table-leg"));
          group.add(makeBox(0.16, 0.62, 0.16, woodMaterial, module.width / 2 - 0.2, 0.34, -module.depth / 2 + 0.16, "table-leg"));
          group.add(makeBox(0.16, 0.62, 0.16, woodMaterial, -module.width / 2 + 0.2, 0.34, module.depth / 2 - 0.16, "table-leg"));
          group.add(makeBox(0.16, 0.62, 0.16, woodMaterial, module.width / 2 - 0.2, 0.34, module.depth / 2 - 0.16, "table-leg"));
        } else if (module.kind === "bed") {
          group.add(makeBox(module.width, 0.32, module.depth, fabricMaterial, 0, 0.38, 0.12, "mattress"));
          group.add(makeBox(module.width, 0.86, 0.18, fabricMaterial, 0, 0.72, -module.depth / 2 + 0.02, "headboard"));
          group.add(makeBox(module.width * 0.38, 0.16, 0.48, trimMaterial, -module.width * 0.22, 0.66, -module.depth / 2 + 0.34, "pillow"));
          group.add(makeBox(module.width * 0.38, 0.16, 0.48, trimMaterial, module.width * 0.22, 0.66, -module.depth / 2 + 0.34, "pillow"));
        } else if (module.kind === "storage") {
          group.add(makeBox(module.width, module.height, module.depth, woodMaterial, 0, module.height / 2, 0, "cabinet"));
          group.add(makeBox(module.width * 0.44, module.height * 0.82, 0.035, trimMaterial, -module.width * 0.24, module.height / 2, module.depth / 2 + 0.02, "door"));
          group.add(makeBox(module.width * 0.44, module.height * 0.82, 0.035, trimMaterial, module.width * 0.24, module.height / 2, module.depth / 2 + 0.02, "door"));
        } else {
          const cushion = makeBox(module.width, module.height * 0.46, module.depth, fabricMaterial, 0, 0.42, 0, "cushion");
          const back = makeBox(module.width, 0.62, 0.22, fabricMaterial, 0, 0.83, -module.depth / 2 + 0.08, "back");
          group.add(cushion, back);

          if (module.kind === "corner" || module.kind === "chaise" || module.kind === "chair") {
            group.add(makeBox(0.2, 0.52, module.depth, fabricMaterial, -module.width / 2 + 0.08, 0.69, 0, "left-arm"));
          }

          if (module.kind === "corner" || module.kind === "chair") {
            group.add(makeBox(module.width, 0.52, 0.2, fabricMaterial, 0, 0.69, module.depth / 2 - 0.08, "return-back"));
          }

          if (module.kind !== "ottoman") {
            const pillow = makeBox(module.width * 0.72, 0.28, 0.16, trimMaterial, 0, 0.78, -module.depth / 2 + 0.23, "pillow");
            pillow.rotation.x = -0.08;
            group.add(pillow);
          }
        }

        if (leg !== "Hidden") {
          const legPositions = [
            [-module.width / 2 + 0.16, -module.depth / 2 + 0.16],
            [module.width / 2 - 0.16, -module.depth / 2 + 0.16],
            [-module.width / 2 + 0.16, module.depth / 2 - 0.16],
            [module.width / 2 - 0.16, module.depth / 2 - 0.16]
          ];

          legPositions.forEach(([x, z]) => {
            group.add(makeBox(0.08, 0.32, 0.08, woodMaterial, x, 0.14, z, "leg"));
          });
        }

        if (module.id === selectedRef.current) {
          const outline = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.BoxGeometry(module.width + 0.05, module.height + 0.42, module.depth + 0.05)),
            new THREE.LineBasicMaterial({ color: "#ffffff" })
          );
          outline.position.y = 0.55;
          group.add(outline);
        }

        group.traverse((object) => {
          object.userData.moduleId = module.id;
        });

        groups.set(module.id, group);
        sofaGroup.add(group);
      });
    };

    const resize = () => {
      const width = Math.max(320, container.clientWidth);
      const height = Math.max(420, container.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const setPointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const pickModule = (event: PointerEvent) => {
      setPointer(event);
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(Array.from(groups.values()), true);
      return intersects[0]?.object.userData.moduleId as string | undefined;
    };

    const onPointerDown = (event: PointerEvent) => {
      const id = pickModule(event);

      if (!id) {
        return;
      }

      pointerDown = true;
      draggedId = id;
      renderer.domElement.setPointerCapture(event.pointerId);
      onSelectRef.current(id);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerDown || !draggedId) {
        return;
      }

      setPointer(event);
      raycaster.setFromCamera(pointer, camera);

      if (!raycaster.ray.intersectPlane(dragPlane, dragPoint)) {
        return;
      }

      const group = groups.get(draggedId);

      if (!group) {
        return;
      }

      group.position.x = clamp(dragPoint.x, -4.8, 4.8);
      group.position.z = clamp(dragPoint.z, -2.6, 3.8);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!pointerDown || !draggedId) {
        return;
      }

      pointerDown = false;
      renderer.domElement.releasePointerCapture(event.pointerId);
      const next = modulesRef.current.map((module) => {
        const group = groups.get(module.id);
        return group ? { ...module, x: Number(group.position.x.toFixed(2)), z: Number(group.position.z.toFixed(2)) } : module;
      });
      draggedId = "";
      onChangeRef.current(next);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      onZoomChangeRef.current(clamp(zoomRef.current + (event.deltaY > 0 ? -0.06 : 0.06), 0, 1));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        orbit -= 0.08;
      }

      if (event.key === "ArrowRight") {
        orbit += 0.08;
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    let animationId = 0;

    const render = () => {
      if (autoRotateRef.current && !pointerDown) {
        orbit += 0.0025;
      }

      const nextSignature = JSON.stringify({ modules: modulesRef.current, selectedId: selectedRef.current, color, fabric, leg });

      if (nextSignature !== sceneSignature) {
        sceneSignature = nextSignature;
        rebuildSofa();
      }

      applyCamera();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    };

    resize();
    render();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      sofaGroup.traverse(disposeObject);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [color, fabric, leg]);

  return <div ref={containerRef} className="min-h-[560px] w-full overflow-hidden bg-neutral-950 lg:min-h-[700px]" />;
}

export function SofaStudioEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { request } = useApi();
  const queryClient = useQueryClient();
  const designId = searchParams.get("design");
  const [activePresetId, setActivePresetId] = useState(presets[0].id);
  const [productCategory, setProductCategory] = useState<StorefrontProduct["category"] | "all">("all");
  const [modules, setModules] = useState<SofaModule[]>(presets[0].modules);
  const [selectedId, setSelectedId] = useState(presets[0].modules[0].id);
  const [fabric, setFabric] = useState(presets[0].fabric);
  const [color, setColor] = useState(presets[0].color);
  const [leg, setLeg] = useState(presets[0].leg);
  const [roomSize, setRoomSize] = useState(roomSizes[1]);
  const [style, setStyle] = useState(styles[0]);
  const [zoom, setZoom] = useState(0.52);
  const [autoRotate, setAutoRotate] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [loadedDesignId, setLoadedDesignId] = useState<string | null>(null);
  const [roomPhotos, setRoomPhotos] = useState<RoomPhoto[]>([]);
  const [roomInsights, setRoomInsights] = useState<string[]>(["Upload room photos to generate a layout direction."]);
  const [roomFlowStep, setRoomFlowStep] = useState<1 | 2 | 3>(1);
  const [placementPoint, setPlacementPoint] = useState<PlacementPoint | null>(null);
  const [createdOrderReference, setCreatedOrderReference] = useState<string | null>(null);
  const roomPhotosRef = useRef<RoomPhoto[]>([]);

  const activePreset = presets.find((preset) => preset.id === activePresetId) ?? presets[0];
  const visiblePresets = useMemo(() => productCategory === "all" ? presets : presets.filter((preset) => preset.category === productCategory), [productCategory]);
  const selectedModule = modules.find((module) => module.id === selectedId) ?? modules[0];
  const title = `${color} ${fabric} ${activePreset.name}`;
  const totalWidth = useMemo(() => {
    const left = Math.min(...modules.map((module) => module.x - module.width / 2));
    const right = Math.max(...modules.map((module) => module.x + module.width / 2));
    return Math.round((right - left) * 86);
  }, [modules]);
  const price = useMemo(() => activePreset.price + modules.length * 390 + (leg === "Black Metal" ? 420 : leg === "Hidden" ? 0 : 280) + Math.round(totalWidth * 3.5), [activePreset.price, leg, modules.length, totalWidth]);
  const configuration = useMemo(() => JSON.stringify({ product: activePreset.name, category: activePreset.category, modules, fabric, color, leg, roomSize, style, zoom, roomPhotos: roomPhotos.map((photo) => photo.name), roomInsights }), [activePreset.category, activePreset.name, color, fabric, leg, modules, roomInsights, roomPhotos, roomSize, style, zoom]);

  const savePayload = useMemo(() => ({
        title,
        status: "in_progress",
        configuration,
        fabric,
        color,
        size: `${totalWidth} cm`,
        extras: `Legs: ${leg}; Room: ${roomSize}; Style: ${style}`,
        image: activePreset.image,
        price,
        notes: "Saved from 3D sofa studio"
  }), [activePreset.image, color, configuration, fabric, leg, price, roomSize, style, title, totalWidth]);

  const saveMutation = useMutation({
    mutationFn: () => request(loadedDesignId ? `/customer/saved-designs/${loadedDesignId}` : "/customer/saved-designs", {
      method: loadedDesignId ? "PATCH" : "POST",
      body: savePayload
    }),
    onSuccess: () => {
      toast.success(loadedDesignId ? "Design updated in your account." : "Design saved to your account.");
      queryClient.invalidateQueries({ queryKey: ["customer", "saved-designs"] });
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const orderMutation = useMutation({
    mutationFn: () => request<CustomerFlowOrder>("/customer-flow/orders", {
      method: "POST",
      body: {
        source: "sofa_studio",
        customer_name: session?.user?.name ?? null,
        customer_email: session?.user?.email ?? null,
        currency: "ILS",
        notes: "Created from Shany Living room preview editor.",
        meta: {
          saved_design_id: loadedDesignId,
          room_photos: roomPhotos.map((photo) => photo.name),
          placement: placementPoint,
          ai_result_ready: roomFlowStep === 3,
          configuration: JSON.parse(configuration)
        },
        items: [
          {
            name: title,
            quantity: 1,
            unit_price: price,
            options: {
              model: activePreset.name,
              fabric,
              color,
              leg,
              size: `${totalWidth} cm`,
              room: roomSize,
              style,
              modules: modules.map((module) => ({ kind: module.kind, label: module.label, x: module.x, z: module.z }))
            }
          }
        ]
      }
    }),
    onSuccess: (order) => {
      setCreatedOrderReference(order.reference);
      toast.success(`Transaction created: ${order.reference}`);
      queryClient.invalidateQueries({ queryKey: ["customer", "orders"] });
    },
    onError: (error: Error) => toast.error(error.message)
  });

  useEffect(() => {
    if (!designId || !session?.user || loadedDesignId === designId) {
      return;
    }

    let mounted = true;

    const loadDesign = async () => {
      try {
        const designs = await request<CustomerSavedDesign[]>("/customer/saved-designs");
        const design = designs.find((item) => String(item.id) === designId);

        if (!mounted || !design) {
          return;
        }

        const parsed = design.configuration ? JSON.parse(design.configuration) as Partial<{
          product: string;
          modules: SofaModule[];
          fabric: string;
          color: string;
          leg: string;
          roomSize: string;
          style: string;
          zoom: number;
        }> : null;

        if (parsed?.product) {
          const preset = presets.find((item) => item.name === parsed.product);
          if (preset) {
            setActivePresetId(preset.id);
          }
        }

        if (Array.isArray(parsed?.modules) && parsed.modules.length > 0) {
          setModules(parsed.modules);
          setSelectedId(parsed.modules[0].id);
        }

        setFabric(parsed?.fabric ?? design.fabric ?? fabrics[0]);
        setColor(parsed?.color ?? colors[0]);
        setLeg(parsed?.leg ?? "Hidden");
        setRoomSize(parsed?.roomSize ?? roomSizes[1]);
        setStyle(parsed?.style ?? styles[0]);
        setZoom(typeof parsed?.zoom === "number" ? parsed.zoom : 0.52);
        setLoadedDesignId(designId);
        toast.success("Saved design loaded in the editor.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load saved design.");
      }
    };

    void loadDesign();

    return () => {
      mounted = false;
    };
  }, [designId, loadedDesignId, request, session?.user]);

  const applyPreset = (preset: ProductPreset) => {
    setActivePresetId(preset.id);
    setModules(preset.modules);
    setSelectedId(preset.modules[0].id);
    setFabric(preset.fabric);
    setColor(preset.color);
    setLeg(preset.leg);
    setZoom(0.52);
  };

  useEffect(() => {
    roomPhotosRef.current = roomPhotos;
  }, [roomPhotos]);

  useEffect(() => () => {
    roomPhotosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
  }, []);

  const addRoomPhotos = (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    const nextPhotos = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 8)
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${file.size}`,
        name: file.name,
        url: URL.createObjectURL(file)
      }));

    setRoomPhotos((current) => [...current, ...nextPhotos].slice(0, 8));
    setRoomInsights(["Photos ready. Run AI Configure to apply a room-aware layout."]);
    setRoomFlowStep(2);
  };

  const removeRoomPhoto = (id: string) => {
    setRoomPhotos((current) => {
      const removed = current.find((photo) => photo.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }

      return current.filter((photo) => photo.id !== id);
    });
  };

  const addModule = (kind: ModuleKind) => {
    const next = createModule(kind, modules.length * 0.18 - 0.4, 1.25 + modules.length * 0.08, modules.length + 1);
    setModules((current) => [...current, next]);
    setSelectedId(next.id);
  };

  const duplicateSelected = () => {
    if (!selectedModule) {
      return;
    }

    const next = { ...selectedModule, id: `${selectedModule.kind}-${Date.now()}`, x: selectedModule.x + 0.36, z: selectedModule.z + 0.36 };
    setModules((current) => [...current, next]);
    setSelectedId(next.id);
  };

  const removeSelected = () => {
    if (modules.length <= 1) {
      return;
    }

    setModules((current) => {
      const next = current.filter((module) => module.id !== selectedId);
      setSelectedId(next[0].id);
      return next;
    });
  };

  const aiConfigure = () => {
    const hasPhotos = roomPhotos.length > 0;
    const compact = roomSize === "Apartment" || roomPhotos.length >= 4;
    const dining = activePreset.category === "dining" || roomSize === "Dining Room";
    const bedroom = activePreset.category === "bedroom" || roomSize === "Bedroom";
    const lounge = roomSize === "Open Plan" || style === "Statement Lounge";
    const natural = style === "Natural Calm";
    const urban = style === "Urban Luxury";
    const nextModules = dining
      ? [createModule("table", 0, 0.2, 1), createModule("chair", -1.05, -0.58, 2), createModule("chair", 1.05, -0.58, 3), createModule("chair", -1.05, 1.02, 4), createModule("chair", 1.05, 1.02, 5)]
      : bedroom
        ? [createModule("bed", 0, 0.35, 1), createModule("storage", -1.85, -0.7, 2), createModule("table", 1.55, -0.55, 3)]
        : compact
      ? [createModule("seat", -0.58, 0.18, 1), createModule("seat", 0.58, 0.18, 2), createModule("ottoman", 0.1, 1.22, 3)]
      : lounge
        ? [createModule("corner", -1.2, -0.05, 1), createModule("seat", 0, -0.05, 2), createModule("seat", 1.2, -0.05, 3), createModule("chaise", -1.2, 1.15, 4)]
        : [createModule("chaise", -1.08, 0.45, 1), createModule("seat", 0.12, 0.18, 2), createModule("seat", 1.32, 0.18, 3)];

    setModules(nextModules);
    setSelectedId(nextModules[0].id);
    setFabric(natural ? "Performance Linen" : urban ? "Velvet Touch" : "Soft Boucle");
    setColor(natural ? "Forest" : urban ? "Charcoal" : compact || bedroom ? "Warm Beige" : "Ivory");
    setLeg(dining || urban ? "Black Metal" : natural ? "Oak" : "Hidden");
    setZoom(compact ? 0.64 : 0.48);
    setRoomInsights([
      hasPhotos ? `${roomPhotos.length} room photo${roomPhotos.length > 1 ? "s" : ""} used for the suggestion.` : "Suggestion based on room and style selections.",
      dining ? "Dining layout balances table clearance and paired chairs." : bedroom ? "Bedroom layout anchors the bed with side storage." : compact ? "Compact layout keeps walking space open with an ottoman." : "Lounge layout creates a deeper conversation area.",
      natural ? "Natural palette selected for softer room blending." : urban ? "High-contrast finish selected for a sharper room mood." : "Neutral palette selected for flexible styling."
    ]);
    if (hasPhotos) {
      setPlacementPoint((current) => current ?? { x: 56, y: 68 });
      setRoomFlowStep(3);
    }
    toast.success("Studio suggestion applied.");
  };

  const saveDesign = () => {
    if (!session?.user) {
      setAuthOpen(true);
      return;
    }

    saveMutation.mutate();
  };

  const createTransaction = () => {
    if (!session?.user) {
      setAuthOpen(true);
      return;
    }

    orderMutation.mutate();
  };

  const roomPhoto = roomPhotos[0] ?? null;

  const selectPlacement = (event: MouseEvent<HTMLButtonElement>) => {
    if (!roomPhoto) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setPlacementPoint({
      x: clamp(((event.clientX - rect.left) / rect.width) * 100, 8, 92),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100, 12, 88)
    });
    setRoomFlowStep(2);
    setRoomInsights(["Placement selected. Run AI Configure to blend the product into the room."]);
  };

  return (
    <main className="bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <section className="grid min-h-[calc(100vh-144px)] border-y border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-950 lg:grid-cols-[320px_minmax(0,1fr)_320px]">
        <aside className="border-b border-neutral-200 p-4 dark:border-white/10 lg:border-b-0 lg:border-r">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">3D Sofa Studio</p>
            <h1 className="mt-2 font-serif text-3xl font-bold">Customize Your Sofa</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">Build from Shany Living models, tune the finish, and save the exact studio layout.</p>
          </div>

          <div className="mt-5 space-y-3">
            <label className="text-sm font-bold">Product</label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(Object.keys(productCategoryLabels) as Array<StorefrontProduct["category"] | "all">).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setProductCategory(category)}
                  className={`h-9 min-w-max rounded-md border px-3 text-xs font-bold transition ${productCategory === category ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950" : "border-neutral-200 bg-white hover:border-neutral-950 dark:border-white/10 dark:bg-neutral-900 dark:hover:border-white"}`}
                >
                  {productCategoryLabels[category]}
                </button>
              ))}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {visiblePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`min-w-36 rounded-md border p-2 text-left text-sm font-bold transition ${activePresetId === preset.id ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950" : "border-neutral-200 bg-white hover:border-neutral-950 dark:border-white/10 dark:bg-neutral-900 dark:hover:border-white"}`}
                >
                  <span className="block">{preset.name}</span>
                  <span className="mt-1 block text-xs font-medium opacity-70">{productCategoryLabels[preset.category]} / {preset.subcategory}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-white/10 dark:bg-neutral-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold">Room Photos</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">Upload multiple photos for the studio suggestion.</p>
              </div>
              <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 text-xs font-bold hover:bg-neutral-100 dark:border-white/15 dark:bg-neutral-950 dark:hover:bg-white/10">
                <SiteIcon name="upload" className="size-4" />
                Upload
                <input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => { addRoomPhotos(event.target.files); event.currentTarget.value = ""; }} />
              </label>
            </div>
            {roomPhotos.length > 0 ? (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {roomPhotos.map((photo) => (
                  <button key={photo.id} type="button" onClick={() => removeRoomPhoto(photo.id)} title="Remove photo" className="group relative overflow-hidden rounded-md border border-neutral-200 dark:border-white/10">
                    <span className="block aspect-square w-full bg-cover bg-center" style={{ backgroundImage: `url(${photo.url})` }} />
                    <span className="sr-only">{photo.name}</span>
                    <span className="absolute inset-x-0 bottom-0 bg-black/65 px-1 py-1 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">Remove</span>
                  </button>
                ))}
              </div>
            ) : null}
            <div className="mt-3 space-y-1">
              {roomInsights.map((insight) => (
                <p key={insight} className="text-xs leading-5 text-neutral-600 dark:text-neutral-300">{insight}</p>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <label className="space-y-2 text-sm font-bold">
              Room
              <select value={roomSize} onChange={(event) => setRoomSize(event.target.value)} className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white">
                {roomSizes.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="space-y-2 text-sm font-bold">
              Style
              <select value={style} onChange={(event) => setStyle(event.target.value)} className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white">
                {styles.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>

          <AppButton className="mt-4 w-full gap-2" onClick={aiConfigure}>
            <SiteIcon name="sparkle" className="size-4" />
            AI Configure
          </AppButton>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {(["seat", "chaise", "corner", "ottoman"] as const).map((kind) => (
              <button key={kind} type="button" onClick={() => addModule(kind)} className="rounded-md border border-neutral-200 bg-white p-3 text-sm font-bold hover:border-neutral-950 dark:border-white/10 dark:bg-neutral-900 dark:hover:border-white">
                <SiteIcon name="sofa" className="mb-2 size-5" />
                {kind === "seat" ? "Seat" : kind === "chaise" ? "Chaise" : kind === "corner" ? "Corner" : "Ottoman"}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            <label className="block text-sm font-bold">Fabric</label>
            <select value={fabric} onChange={(event) => setFabric(event.target.value)} className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white">
              {fabrics.map((item) => <option key={item}>{item}</option>)}
            </select>
            <label className="block text-sm font-bold">Color</label>
            <div className="grid grid-cols-3 gap-2">
              {colors.map((item) => (
                <button key={item} type="button" onClick={() => setColor(item)} className={`rounded-md border p-2 text-left text-xs font-bold ${color === item ? "border-neutral-950 dark:border-white" : "border-neutral-200 dark:border-white/10"}`}>
                  <span className="mb-2 block h-8 rounded-sm border border-black/10" style={{ backgroundColor: colorTokens[item] }} />
                  {item}
                </button>
              ))}
            </div>
            <label className="block text-sm font-bold">Legs</label>
            <select value={leg} onChange={(event) => setLeg(event.target.value)} className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white">
              {legs.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </aside>

        <section className="min-w-0 bg-neutral-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-3">
            <div className="flex items-center gap-2 text-white">
              <SiteIcon name="move-3d" className="size-5" />
              <span className="text-sm font-bold">3D Layout</span>
            </div>
            <div className="flex items-center gap-2">
              <ToolbarButton label="Zoom out" icon="zoom-out" onClick={() => setZoom((value) => clamp(value - 0.08, 0, 1))} />
              <input type="range" min={0} max={1} step={0.01} value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="w-28 accent-white" aria-label="Zoom" />
              <ToolbarButton label="Zoom in" icon="zoom-in" onClick={() => setZoom((value) => clamp(value + 0.08, 0, 1))} />
              <ToolbarButton label="Auto rotate" icon="bot" active={autoRotate} onClick={() => setAutoRotate((value) => !value)} />
            </div>
          </div>
          <SofaScene modules={modules} selectedId={selectedId} color={color} fabric={fabric} leg={leg} zoom={zoom} autoRotate={autoRotate} onSelect={setSelectedId} onChange={setModules} onZoomChange={setZoom} />
          <div className="flex gap-3 overflow-x-auto border-t border-white/10 bg-neutral-950 p-3">
            {modules.map((module) => (
              <button key={module.id} type="button" onClick={() => setSelectedId(module.id)} className={`min-w-40 rounded-md border p-3 text-left text-sm font-bold ${selectedId === module.id ? "border-white bg-white text-neutral-950" : "border-white/15 bg-neutral-900 text-white"}`}>
                <span className="flex items-center gap-2"><SiteIcon name="grid" className="size-4" /> {module.label}</span>
                <span className="mt-1 block text-xs font-medium opacity-70">X {module.x.toFixed(1)} / Z {module.z.toFixed(1)}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-white/10 bg-neutral-950 p-3 sm:p-5">
            <div className="rounded-md border border-white/10 bg-neutral-900 p-3 text-white sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">See It In My Room</p>
                  <h2 className="mt-1 font-serif text-2xl font-bold">AI room preview</h2>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((step) => (
                    <span key={step} className={`grid size-8 place-items-center rounded-full border text-xs font-bold ${roomFlowStep === step ? "border-white bg-white text-neutral-950" : "border-white/20 text-white/70"}`}>
                      {step}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                <button
                  type="button"
                  onClick={selectPlacement}
                  className="relative min-h-[360px] overflow-hidden rounded-md border border-white/10 bg-neutral-800 text-left sm:min-h-[440px]"
                  aria-label="Choose product placement in room photo"
                >
                  {roomPhoto ? (
                    <span className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${roomPhoto.url})` }} />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#f6f1e9,#ddd2c2)] text-center text-neutral-950">
                      <span className="max-w-xs px-6">
                        <SiteIcon name="upload" className="mx-auto size-10" />
                        <span className="mt-3 block font-bold">Upload a room photo</span>
                        <span className="mt-1 block text-sm text-neutral-600">The preview keeps this image space ready on mobile and desktop.</span>
                      </span>
                    </span>
                  )}
                  {roomPhoto && placementPoint ? (
                    <span className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${placementPoint.x}%`, top: `${placementPoint.y}%` }}>
                      <span className="grid size-12 place-items-center rounded-full border-2 border-white bg-black text-white shadow-xl">
                        <SiteIcon name="map-pin" className="size-5" />
                      </span>
                    </span>
                  ) : null}
                  {roomPhoto && roomFlowStep === 3 ? (
                    <span className="absolute inset-x-6 bottom-6 rounded-md border border-white/20 bg-black/70 p-3 shadow-2xl backdrop-blur">
                      <span className="grid gap-3 sm:grid-cols-[120px_1fr] sm:items-center">
                        <AppImage src={activePreset.image} alt={activePreset.name} className="aspect-[1.45/1] rounded-md" sizes="120px" />
                        <span>
                          <span className="block text-sm font-bold">Looks ready in your room</span>
                          <span className="mt-1 block text-xs text-white/70">{activePreset.name} with {fabric}, {color}, {leg} legs.</span>
                        </span>
                      </span>
                    </span>
                  ) : null}
                </button>
                <div className="space-y-3">
                  <div className="rounded-md border border-white/10 p-3">
                    <p className="font-bold">1. Upload room</p>
                    <p className="mt-1 text-xs leading-5 text-white/65">Use a well-lit image and keep the open area visible.</p>
                  </div>
                  <div className="rounded-md border border-white/10 p-3">
                    <p className="font-bold">2. Tap placement</p>
                    <p className="mt-1 text-xs leading-5 text-white/65">Click the floor/wall area where the product should appear.</p>
                  </div>
                  <div className="rounded-md border border-white/10 p-3">
                    <p className="font-bold">3. AI configure</p>
                    <p className="mt-1 text-xs leading-5 text-white/65">The editor adjusts layout, palette, and product blend direction.</p>
                  </div>
                  <AppButton className="w-full gap-2" onClick={aiConfigure} disabled={!roomPhoto}>
                    <SiteIcon name="sparkle" className="size-4" />
                    Generate Room Preview
                  </AppButton>
                  <AppButton variant="outline" className="w-full border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => setRoomFlowStep(1)}>
                    Try Another Photo
                  </AppButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="border-t border-neutral-200 p-4 dark:border-white/10 lg:border-l lg:border-t-0">
          <h2 className="font-serif text-2xl font-bold">Design Summary</h2>
          <div className="mt-4 space-y-3">
            {[
              ["sofa", "Model", activePreset.name],
              ["ruler", "Width", `${totalWidth} cm`],
              ["palette", "Fabric", fabric],
              ["grid", "Color", color],
              ["sofa", "Legs", leg]
            ].map(([icon, label, value]) => (
              <div key={String(label)} className="flex items-center gap-3 rounded-md border border-neutral-200 bg-white p-3 dark:border-white/10 dark:bg-neutral-900">
                <SiteIcon name={icon as SiteIconName} className="size-5" />
                <div>
                  <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400">{String(label)}</p>
                  <p className="font-bold">{String(value)}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedModule ? (
            <div className="mt-5 rounded-md border border-neutral-200 bg-white p-3 dark:border-white/10 dark:bg-neutral-900">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Selected Module</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="font-bold">{selectedModule.label}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">{selectedModule.width.toFixed(1)}m x {selectedModule.depth.toFixed(1)}m</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" title="Move left" onClick={() => setModules((current) => current.map((module) => module.id === selectedId ? { ...module, x: module.x - 0.2 } : module))} className="grid size-9 place-items-center rounded-md border border-neutral-200 dark:border-white/10" aria-label="Move left">
                    <SiteIcon name="chevron-left" className="size-4" />
                  </button>
                  <button type="button" title="Move right" onClick={() => setModules((current) => current.map((module) => module.id === selectedId ? { ...module, x: module.x + 0.2 } : module))} className="grid size-9 place-items-center rounded-md border border-neutral-200 dark:border-white/10" aria-label="Move right">
                    <SiteIcon name="chevron-right" className="size-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setModules((current) => current.map((module) => module.id === selectedId ? { ...module, z: module.z - 0.2 } : module))} className="rounded-md border border-neutral-200 p-2 text-xs font-bold dark:border-white/10">
                  <SiteIcon name="minus" className="mx-auto mb-1 size-4" />
                  Depth
                </button>
                <button type="button" onClick={duplicateSelected} className="rounded-md border border-neutral-200 p-2 text-xs font-bold dark:border-white/10">
                  <SiteIcon name="copy" className="mx-auto mb-1 size-4" />
                  Copy
                </button>
                <button type="button" onClick={() => setModules((current) => current.map((module) => module.id === selectedId ? { ...module, z: module.z + 0.2 } : module))} className="rounded-md border border-neutral-200 p-2 text-xs font-bold dark:border-white/10">
                  <SiteIcon name="plus" className="mx-auto mb-1 size-4" />
                  Depth
                </button>
              </div>
              <AppButton variant="outline" className="mt-3 w-full gap-2" onClick={removeSelected} disabled={modules.length <= 1}>
                <SiteIcon name="trash" className="size-4" />
                Remove Module
              </AppButton>
            </div>
          ) : null}

          <p className="mt-5 font-serif text-3xl font-bold">NIS {price.toLocaleString()}</p>
          <AppButton className="mt-4 w-full gap-2" loading={saveMutation.isPending} onClick={saveDesign}>
            <SiteIcon name="save" className="size-4" />
            Save My Design
          </AppButton>
          <AppButton variant="secondary" className="mt-3 w-full gap-2" loading={orderMutation.isPending} onClick={createTransaction}>
            <SiteIcon name="check" className="size-4" />
            Create Transaction
          </AppButton>
          {createdOrderReference ? (
            <div className="mt-3 rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-900 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-100">
              <p className="font-bold">Transaction {createdOrderReference} created.</p>
              <button type="button" onClick={() => router.push("/customer/orders")} className="mt-1 text-xs font-bold underline">View in My Orders</button>
            </div>
          ) : null}
          <Link href="/showroom">
            <AppButton variant="outline" className="mt-3 w-full gap-2">
              <SiteIcon name="message" className="size-4" />
              Ask for Help
            </AppButton>
          </Link>
        </aside>
      </section>

      <AppDialog open={authOpen} onOpenChange={setAuthOpen} title="Save your sofa design" description="Create an account or sign in so this design appears in your Saved Designs panel.">
        <div className="space-y-4">
          <SocialAuthButtons callbackUrl="/customize-your-sofa" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/login?callbackUrl=/customize-your-sofa">
              <AppButton variant="outline" className="w-full gap-2">
                <SiteIcon name="user" className="size-4" />
                Sign In
              </AppButton>
            </Link>
            <Link href="/register">
              <AppButton className="w-full gap-2">
                <SiteIcon name="check" className="size-4" />
                Create Account
              </AppButton>
            </Link>
          </div>
        </div>
      </AppDialog>
    </main>
  );
}
