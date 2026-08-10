"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as THREE from "three";
import { toast } from "sonner";
import { AppButton } from "@/components/app/AppButton";
import { AppDialog } from "@/components/app/AppDialog";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { SiteIcon, SiteIconName } from "@/components/icons/SiteIcon";
import { useApi } from "@/hooks/use-api";
import type { CustomerSavedDesign } from "@/types/customer";

type ModuleKind = "seat" | "chaise" | "corner" | "ottoman";

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
  modules: SofaModule[];
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
const roomSizes = ["Apartment", "Family Room", "Open Plan", "Showroom"];
const styles = ["Warm Minimal", "Urban Luxury", "Natural Calm", "Statement Lounge"];

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
    ottoman: { width: 1.08, depth: 0.95, height: 0.44 }
  };

  return {
    id: `${kind}-${index}-${Math.round((x + z) * 100)}`,
    kind,
    label: kind === "seat" ? "Seat" : kind === "chaise" ? "Chaise" : kind === "corner" ? "Corner" : "Ottoman",
    x,
    z,
    ...dimensions[kind]
  };
};

const presets: ProductPreset[] = [
  {
    id: "cloud",
    name: "Cloud Modular",
    image: "/images/sofa-cloud-modular.png",
    fabric: "Soft Boucle",
    color: "Ivory",
    leg: "Hidden",
    modules: [createModule("chaise", -1.25, 0.55, 1), createModule("seat", -0.05, 0.25, 2), createModule("seat", 1.15, 0.25, 3)]
  },
  {
    id: "luna",
    name: "Luna Lounge",
    image: "/images/sofa-luna.png",
    fabric: "Performance Linen",
    color: "Warm Beige",
    leg: "Oak",
    modules: [createModule("seat", -1.15, 0.2, 1), createModule("seat", 0, 0.2, 2), createModule("seat", 1.15, 0.2, 3)]
  },
  {
    id: "noa",
    name: "Noa Corner",
    image: "/images/sofa-noa.png",
    fabric: "Pet Friendly Weave",
    color: "Forest",
    leg: "Walnut",
    modules: [createModule("corner", -1.15, -0.15, 1), createModule("seat", 0.05, -0.15, 2), createModule("chaise", -1.15, 1.05, 3)]
  },
  {
    id: "ella",
    name: "Ella Softline",
    image: "/images/sofa-ella.png",
    fabric: "Velvet Touch",
    color: "Clay",
    leg: "Black Metal",
    modules: [createModule("seat", -0.65, 0.1, 1), createModule("seat", 0.65, 0.1, 2), createModule("ottoman", 0.65, 1.25, 3)]
  }
];

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

        const cushion = makeBox(module.width, module.height * 0.46, module.depth, fabricMaterial, 0, 0.42, 0, "cushion");
        const back = makeBox(module.width, 0.62, 0.22, fabricMaterial, 0, 0.83, -module.depth / 2 + 0.08, "back");
        group.add(cushion, back);

        if (module.kind === "corner" || module.kind === "chaise") {
          group.add(makeBox(0.2, 0.52, module.depth, fabricMaterial, -module.width / 2 + 0.08, 0.69, 0, "left-arm"));
        }

        if (module.kind === "corner") {
          group.add(makeBox(module.width, 0.52, 0.2, fabricMaterial, 0, 0.69, module.depth / 2 - 0.08, "return-back"));
        }

        if (module.kind !== "ottoman") {
          const pillow = makeBox(module.width * 0.72, 0.28, 0.16, trimMaterial, 0, 0.78, -module.depth / 2 + 0.23, "pillow");
          pillow.rotation.x = -0.08;
          group.add(pillow);
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

export default function CustomizeYourSofaPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { request } = useApi();
  const queryClient = useQueryClient();
  const designId = searchParams.get("design");
  const [activePresetId, setActivePresetId] = useState(presets[0].id);
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

  const activePreset = presets.find((preset) => preset.id === activePresetId) ?? presets[0];
  const selectedModule = modules.find((module) => module.id === selectedId) ?? modules[0];
  const title = `${color} ${fabric} ${activePreset.name}`;
  const totalWidth = useMemo(() => {
    const left = Math.min(...modules.map((module) => module.x - module.width / 2));
    const right = Math.max(...modules.map((module) => module.x + module.width / 2));
    return Math.round((right - left) * 86);
  }, [modules]);
  const price = useMemo(() => 4600 + modules.length * 610 + (leg === "Black Metal" ? 420 : leg === "Hidden" ? 0 : 280) + Math.round(totalWidth * 5.5), [leg, modules.length, totalWidth]);
  const configuration = useMemo(() => JSON.stringify({ product: activePreset.name, modules, fabric, color, leg, roomSize, style, zoom }), [activePreset.name, color, fabric, leg, modules, roomSize, style, zoom]);

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
    const compact = roomSize === "Apartment";
    const lounge = roomSize === "Open Plan" || style === "Statement Lounge";
    const natural = style === "Natural Calm";
    const urban = style === "Urban Luxury";
    const nextModules = compact
      ? [createModule("seat", -0.58, 0.18, 1), createModule("seat", 0.58, 0.18, 2), createModule("ottoman", 0.1, 1.22, 3)]
      : lounge
        ? [createModule("corner", -1.2, -0.05, 1), createModule("seat", 0, -0.05, 2), createModule("seat", 1.2, -0.05, 3), createModule("chaise", -1.2, 1.15, 4)]
        : [createModule("chaise", -1.08, 0.45, 1), createModule("seat", 0.12, 0.18, 2), createModule("seat", 1.32, 0.18, 3)];

    setModules(nextModules);
    setSelectedId(nextModules[0].id);
    setFabric(natural ? "Performance Linen" : urban ? "Velvet Touch" : "Soft Boucle");
    setColor(natural ? "Forest" : urban ? "Charcoal" : compact ? "Warm Beige" : "Ivory");
    setLeg(urban ? "Black Metal" : natural ? "Oak" : "Hidden");
    setZoom(compact ? 0.64 : 0.48);
    toast.success("Studio suggestion applied.");
  };

  const saveDesign = () => {
    if (!session?.user) {
      setAuthOpen(true);
      return;
    }

    saveMutation.mutate();
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
            <div className="flex gap-3 overflow-x-auto pb-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`min-w-36 rounded-md border p-2 text-left text-sm font-bold transition ${activePresetId === preset.id ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950" : "border-neutral-200 bg-white hover:border-neutral-950 dark:border-white/10 dark:bg-neutral-900 dark:hover:border-white"}`}
                >
                  <span className="block">{preset.name}</span>
                  <span className="mt-1 block text-xs font-medium opacity-70">{preset.fabric}</span>
                </button>
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
