export type StorefrontProduct = {
  name: string;
  name_i18n?: Partial<Record<"he" | "fr" | "it", string>>;
  slug: string;
  category: "sofas" | "living-room" | "dining" | "bedroom";
  subcategory: string;
  price: number;
  image: string;
  badge?: string;
  description?: string;
  description_i18n?: Partial<Record<"he" | "fr" | "it", string>>;
  seatRange?: string;
  dimensions?: string;
  variants?: string[];
  colors?: string[];
  colorNames?: string[];
  galleryImages?: string[];
  galleryMedia?: StorefrontGalleryImage[];
  fabricImages?: string[];
  optionGroups?: StorefrontOptionGroup[];
  variantMedia?: StorefrontVariantMedia[];
};

export type StorefrontVariantMedia = {
  options: Record<string, string>;
  image: string;
};
export type StorefrontGalleryImage = {
  image: string;
  color?: string | null;
};
export type StorefrontOptionGroup = {
  name: string;
  values: Array<{
    label: string;
    swatch?: string | null;
    image?: string | null;
  }>;
};

export type StorefrontPage = {
  title: string;
  eyebrow: string;
  description: string;
  heroImage: string;
  filters: string[];
  products: StorefrontProduct[];
  content?: string;
  isManaged?: boolean;
};

const colors = ["#eee9df", "#6a5845", "#0d5f43", "#d9d4ca"];

export const storefrontProducts: StorefrontProduct[] = [
  {
    name: "Lian Sofa",
    name_i18n: { he: "ספת ליאן", fr: "Canape Lian", it: "Divano Lian" },
    slug: "lian-sofa",
    category: "sofas",
    subcategory: "Three-Seat Sofas",
    price: 0,
    image: "/images/products/lazai/White.jpeg",
    description:
      "A relaxed three-seat sofa with rounded cushions, a clean showroom silhouette and made-to-order upholstery options.",
    description_i18n: {
      he: "ספה תלת-מושבית נינוחה עם כריות מעוגלות, קו עיצוב נקי בסגנון אולם התצוגה ואפשרויות ריפוד בהתאמה אישית.",
      fr: "Un canape trois places au style decontracte, avec des coussins arrondis, une silhouette epuree digne d'un showroom et des options de tapisserie sur mesure.",
      it: "Un divano a tre posti dallo stile rilassato, con cuscini arrotondati, una silhouette pulita da showroom e opzioni di rivestimento realizzate su misura."
    },
    seatRange: "Three-seat sofa",
    dimensions: "200 x 100 x 85 cm",
    variants: ["White", "Light Gray", "Blue"],
    colors: ["#ffffff", "#d9dde3", "#315f97"],
    colorNames: ["White", "Light Gray", "Blue"],
    galleryImages: [
      "/images/products/lazai/White.jpeg",
      "/images/products/lazai/White - left.jpeg",
      "/images/products/lazai/blue.jpeg",
      "/images/products/lazai/grey.jpeg",
      "/images/products/lazai/1.jpeg",
      "/images/products/lazai/2.jpeg",
    ],
    fabricImages: [
      "/images/products/lazai/3.jpeg",
      "/images/products/lazai/4.jpeg",
      "/images/products/lazai/White - left.jpeg",
    ],
    variantMedia: [
      {
        options: { Color: "White" },
        image: "/images/products/lazai/White.jpeg",
      },
      { options: { Color: "Blue" }, image: "/images/products/lazai/blue.jpeg" },
      { options: { Color: "Grey" }, image: "/images/products/lazai/grey.jpeg" },
    ],
  },
  {
    name: "Calista Marble Coffee Table",
    name_i18n: { he: "שולחן סלון קליסטה משיש", fr: "Table basse Calista en marbre", it: "Tavolino Calista in marmo" },
    slug: "calista-marble-coffee-table",
    category: "living-room",
    subcategory: "Coffee Tables",
    price: 2490,
    image: "/images/product-marble-coffee-table.png",
    colors,
  },
  {
    name: "Nova Sofa Side Table",
    name_i18n: { he: "שולחן צד נובה לספה", fr: "Table d'appoint Nova pour canape", it: "Tavolino laterale Nova per divano" },
    slug: "nova-sofa-side-table",
    category: "living-room",
    subcategory: "Side Tables",
    price: 690,
    image: "/images/product-ribbed-side-table.png",
    colors,
  },
  {
    name: "Nova Upholstered Chair",
    name_i18n: { he: "כיסא מרופד נובה", fr: "Chaise rembourree Nova", it: "Sedia imbottita Nova" },
    slug: "nova-upholstered-chair",
    category: "dining",
    subcategory: "Chairs",
    price: 2490,
    image: "/images/product-dining-chair.png",
    colors,
  },
  {
    name: "Milano Extendable Table",
    name_i18n: { he: "שולחן נשלף מילאנו", fr: "Table extensible Milano", it: "Tavolo allungabile Milano" },
    slug: "milano-extendable-table",
    category: "dining",
    subcategory: "Extendable Tables",
    price: 1290,
    image: "/images/product-luca-dining-table.png",
    colors,
  },
  {
    name: "Siena Modular Sofa",
    name_i18n: { he: "ספה מודולרית סיינה", fr: "Canape modulable Siena", it: "Divano modulare Siena" },
    slug: "siena-modular-sofa",
    category: "sofas",
    subcategory: "Modular Sofas",
    price: 1690,
    image: "/images/sofa-cloud-modular.png",
    colors,
  },
  {
    name: "CloudRest Luxe Platform Bed",
    name_i18n: { he: "מיטת פלטפורמה קלאודרסט לוקס", fr: "Lit plateforme CloudRest Luxe", it: "Letto a piattaforma CloudRest Luxe" },
    slug: "cloudrest-luxe-platform-bed",
    category: "bedroom",
    subcategory: "Upholstered Bed",
    price: 2390,
    image: "/images/products/cloudrest-luxe-platform-bed/1.jpeg",
    description:
      "Soft, pleasant-to-the-touch upholstery brings warmth and sophistication to any bedroom. The generously padded headboard provides exceptional comfort for relaxation, while the sturdy platform base ensures lasting stability. Available with customizable dimensions and finishes to perfectly suit your space.\n\nMaterials & Care: Solid Wood Frame, Plywood. Upholstery: Premium Velvet.",
    description_i18n: {
      he: "ריפוד רך ונעים למגע מעניק חמימות ותחכום לכל חדר שינה. משענת הראש המרופדת בנדיבות מספקת נוחות יוצאת דופן למנוחה, בעוד בסיס הפלטפורמה היציב מבטיח יציבות לאורך זמן. זמינה במידות וגימורים בהתאמה אישית כדי להתאים בדיוק לחלל שלכם.\n\nחומרים וטיפוח: מסגרת עץ מלא, פורניר. ריפוד: קטיפה איכותית.",
      fr: "Une tapisserie douce et agreable au toucher apporte chaleur et raffinement a toute chambre. La tete de lit genereusement rembourree offre un confort exceptionnel, tandis que la base plateforme robuste garantit une stabilite durable. Disponible avec des dimensions et finitions personnalisables pour s'adapter parfaitement a votre espace.\n\nMateriaux et entretien: Structure en bois massif, contreplaque. Tapisserie: Velours premium.",
      it: "Un rivestimento morbido e piacevole al tatto porta calore e raffinatezza in ogni camera da letto. La testiera generosamente imbottita offre un comfort eccezionale per il relax, mentre la solida base a piattaforma garantisce stabilita duratura. Disponibile con dimensioni e finiture personalizzabili per adattarsi perfettamente al vostro spazio.\n\nMateriali e cura: Struttura in legno massello, compensato. Rivestimento: Velluto premium."
    },
    dimensions: "W175 × L218 × H125 cm",
    seatRange: "140×190, 160×190, 160×200, 180×200",
    colorNames: ["Beige", "Grey", "Charcoal", "Cream"],
    colors: ["#e8ddc9", "#9a9a9a", "#3a3a3a", "#f2ead9"],
    galleryImages: ["/images/products/cloudrest-luxe-platform-bed/1.jpeg"],
  },
  {
    name: "UrbanNest Minimal Platform Bed",
    name_i18n: { he: "מיטת פלטפורמה מינימליסטית אורבןנסט", fr: "Lit plateforme minimaliste UrbanNest", it: "Letto a piattaforma minimalista UrbanNest" },
    slug: "urbannest-minimal-platform-bed",
    category: "bedroom",
    subcategory: "Platform Bed",
    price: 1890,
    image: "/images/products/urbannest-minimal-platform-bed/1.jpeg",
    description:
      "Clean lines and refined upholstery create a minimalist design that fits modern interiors. The cushioned headboard offers comfortable support, while its durable construction ensures everyday reliability. Dimensions and fabric selections can be personalized to your preference.\n\nMaterials & Care: Solid Wood Frame, MDF. Upholstery: Linen Fabric.",
    description_i18n: {
      he: "קווים נקיים וריפוד מעודן יוצרים עיצוב מינימליסטי המתאים לחללים מודרניים. משענת הראש המרופדת מציעה תמיכה נוחה, בעוד המבנה העמיד מבטיח אמינות יומיומית. ניתן להתאים אישית את המידות ואת בחירת הבד לפי העדפתכם.\n\nחומרים וטיפוח: מסגרת עץ מלא, MDF. ריפוד: בד פשתן.",
      fr: "Des lignes epurees et une tapisserie raffinee creent un design minimaliste qui s'integre aux interieurs modernes. La tete de lit capitonnee offre un soutien confortable, tandis que sa fabrication durable garantit une fiabilite au quotidien. Les dimensions et le choix du tissu peuvent etre personnalises selon vos preferences.\n\nMateriaux et entretien: Structure en bois massif, MDF. Tapisserie: Tissu lin.",
      it: "Linee pulite e un rivestimento raffinato creano un design minimalista adatto agli interni moderni. La testiera imbottita offre un sostegno confortevole, mentre la struttura resistente garantisce affidabilita quotidiana. Dimensioni e scelta del tessuto possono essere personalizzate secondo le vostre preferenze.\n\nMateriali e cura: Struttura in legno massello, MDF. Rivestimento: Tessuto in lino."
    },
    dimensions: "Single: 90 × 200 cm",
    seatRange: "140×190, 160×190, 160×200",
    colorNames: ["Light Grey", "Sand", "Brown", "Navy"],
    colors: ["#d3d3d0", "#d9c9a8", "#6a4a34", "#1f2a44"],
    galleryImages: ["/images/products/urbannest-minimal-platform-bed/1.jpeg"],
  },
  {
    name: "Grand Haven Premium Bed Frame",
    name_i18n: { he: "מסגרת מיטה פרימיום גרנד הייבן", fr: "Cadre de lit premium Grand Haven", it: "Struttura letto premium Grand Haven" },
    slug: "grand-haven-premium-bed-frame",
    category: "bedroom",
    subcategory: "Modern Bed",
    price: 2590,
    image: "/images/products/grand-haven-premium-bed-frame/1.jpeg",
    description:
      "Elegant upholstery with refined stitching delivers both style and comfort. The spacious headboard enhances relaxation, while the durable frame provides dependable support for years. Customize the size, height, and fabric to complement your bedroom.\n\nMaterials & Care: Hardwood Frame. Upholstery: Woven Fabric.",
    description_i18n: {
      he: "ריפוד אלגנטי עם תפירה מעודנת מעניק גם סגנון וגם נוחות. משענת הראש המרווחת משדרגת את חוויית המנוחה, בעוד המסגרת העמידה מספקת תמיכה אמינה לאורך שנים. ניתן להתאים אישית את הגודל, הגובה והבד כך שישתלבו בחדר השינה שלכם.\n\nחומרים וטיפוח: מסגרת עץ קשה. ריפוד: בד ארוג.",
      fr: "Une tapisserie elegante aux coutures raffinees allie style et confort. La tete de lit spacieuse favorise la detente, tandis que le cadre robuste assure un soutien fiable pendant des annees. Personnalisez la taille, la hauteur et le tissu pour completer votre chambre.\n\nMateriaux et entretien: Structure en bois dur. Tapisserie: Tissu tisse.",
      it: "Un rivestimento elegante con cuciture raffinate unisce stile e comfort. La testiera spaziosa favorisce il relax, mentre la struttura resistente garantisce un supporto affidabile per anni. Personalizzate misura, altezza e tessuto per completare la vostra camera da letto.\n\nMateriali e cura: Struttura in legno duro. Rivestimento: Tessuto tramato."
    },
    dimensions: "Queen: W175 × L220 × H130 cm",
    seatRange: "140×190, 160×200, 180×200",
    colorNames: ["Ivory", "Taupe", "Grey", "Olive"],
    colors: ["#f4efe4", "#8b7d6b", "#9a9a9a", "#6b6f45"],
    galleryImages: ["/images/products/grand-haven-premium-bed-frame/1.jpeg"],
  },
  {
    name: "Silver Crest Tufted Bed",
    name_i18n: { he: "מיטה מרופדת בכפתורים סילבר קרסט", fr: "Lit capitonne Silver Crest", it: "Letto capitonne Silver Crest" },
    slug: "silver-crest-tufted-bed",
    category: "bedroom",
    subcategory: "Upholstered Bed",
    price: 2490,
    image: "/images/products/silver-crest-tufted-bed/1.jpeg",
    description:
      "A beautifully tufted headboard combines timeless elegance with exceptional comfort. The soft-touch fabric and robust construction make it ideal for everyday luxury, with customizable sizing and upholstery options available.\n\nMaterials & Care: Solid Wood Frame. Upholstery: Velvet Fabric.",
    description_i18n: {
      he: "משענת ראש מכופתרת ומעוצבת בקפידה משלבת אלגנטיות קלאסית עם נוחות יוצאת דופן. הבד הרך למגע והמבנה החזק הופכים אותה לבחירה מפנקת ליומיום, עם אפשרויות מידה וריפוד בהתאמה אישית.\n\nחומרים וטיפוח: מסגרת עץ מלא. ריפוד: בד קטיפה.",
      fr: "Une tete de lit capitonnee avec elegance allie raffinement intemporel et confort exceptionnel. Le tissu doux au toucher et la construction robuste en font un choix de luxe au quotidien, avec des options de taille et de tapisserie personnalisables.\n\nMateriaux et entretien: Structure en bois massif. Tapisserie: Tissu velours.",
      it: "Una testiera capitonne magnificamente lavorata unisce eleganza senza tempo a un comfort eccezionale. Il tessuto morbido al tatto e la struttura robusta la rendono ideale per un lusso quotidiano, con misure e rivestimenti personalizzabili.\n\nMateriali e cura: Struttura in legno massello. Rivestimento: Tessuto in velluto."
    },
    dimensions: "Queen: W178 × L220 × H128 cm",
    seatRange: "160×190, 160×200, 180×200",
    colorNames: ["Dark Grey", "Silver", "Cream", "Blue"],
    colors: ["#4d4d4d", "#c7c7c7", "#f2ead9", "#315f97"],
    galleryImages: ["/images/products/silver-crest-tufted-bed/1.jpeg"],
  },
  {
    name: "Aurora Glow Luxury Bed",
    name_i18n: { he: "מיטת יוקרה אורורה גלואו", fr: "Lit de luxe Aurora Glow", it: "Letto di lusso Aurora Glow" },
    slug: "aurora-glow-luxury-bed",
    category: "bedroom",
    subcategory: "Luxury Bed",
    price: 2990,
    image: "/images/products/aurora-glow-luxury-bed/1.jpeg",
    description:
      "Luxurious upholstery and a generously padded structure create a cozy retreat for restful nights. Designed with attention to detail, this bed offers premium comfort and can be tailored with various fabrics, dimensions, and finishes.\n\nMaterials & Care: Kiln-Dried Hardwood. Upholstery: Velvet Fabric.",
    description_i18n: {
      he: "ריפוד יוקרתי ומבנה מרופד בנדיבות יוצרים מפלט מפנק לילות של מנוחה אמיתית. המיטה עוצבה תוך תשומת לב לפרטים ומציעה נוחות פרימיום, וניתן להתאים אותה עם מגוון בדים, מידות וגימורים.\n\nחומרים וטיפוח: עץ קשה מיובש בתנור. ריפוד: בד קטיפה.",
      fr: "Une tapisserie luxueuse et une structure genereusement rembourree creent un refuge douillet pour des nuits reposantes. Concu avec le souci du detail, ce lit offre un confort haut de gamme et peut etre personnalise avec differents tissus, dimensions et finitions.\n\nMateriaux et entretien: Bois dur seche au four. Tapisserie: Tissu velours.",
      it: "Un rivestimento lussuoso e una struttura generosamente imbottita creano un rifugio accogliente per notti di vero riposo. Progettato con attenzione ai dettagli, questo letto offre un comfort premium e puo essere personalizzato con diversi tessuti, misure e finiture.\n\nMateriali e cura: Legno duro essiccato in forno. Rivestimento: Tessuto in velluto."
    },
    dimensions: "Queen: W180 × L225 × H135 cm",
    seatRange: "160×200, 180×200, 200×200",
    colorNames: ["Champagne", "Beige", "Mocha", "Emerald"],
    colors: ["#e8dcc0", "#e8ddc9", "#7b5e4c", "#10513f"],
    galleryImages: ["/images/products/aurora-glow-luxury-bed/1.jpeg"],
  },
  {
    name: "Harmony Plush Panel Bed",
    name_i18n: { he: "מיטת פאנל מרופדת הרמוני", fr: "Lit a panneau moelleux Harmony", it: "Letto a pannello imbottito Harmony" },
    slug: "harmony-plush-panel-bed",
    category: "bedroom",
    subcategory: "Panel Bed",
    price: 2290,
    image: "/images/products/harmony-plush-panel-bed/1.jpeg",
    description:
      "Featuring plush upholstery and a bold panel headboard, this design delivers exceptional support and modern elegance. Its durable construction and customizable options make it suitable for a wide variety of interiors.\n\nMaterials & Care: Solid Wood Frame. Upholstery: Chenille Fabric.",
    description_i18n: {
      he: "עם ריפוד רך ומענג ומשענת ראש מסוגננת בפאנל בולט, העיצוב הזה מספק תמיכה יוצאת דופן ואלגנטיות מודרנית. המבנה העמיד והאפשרויות להתאמה אישית הופכים אותה למתאימה למגוון רחב של חללים.\n\nחומרים וטיפוח: מסגרת עץ מלא. ריפוד: בד שנילי.",
      fr: "Avec sa tapisserie moelleuse et sa tete de lit a panneau affirme, ce design offre un soutien exceptionnel et une elegance moderne. Sa construction durable et ses options personnalisables le rendent adapte a une grande variete d'interieurs.\n\nMateriaux et entretien: Structure en bois massif. Tapisserie: Tissu chenille.",
      it: "Con un rivestimento morbido e una testiera a pannello dal carattere deciso, questo design offre un sostegno eccezionale e un'eleganza moderna. La struttura resistente e le opzioni personalizzabili lo rendono adatto a una grande varieta di interni.\n\nMateriali e cura: Struttura in legno massello. Rivestimento: Tessuto ciniglia."
    },
    dimensions: "Double: W155 × L215 × H120 cm",
    seatRange: "140×190, 160×190, 160×200",
    colorNames: ["Stone", "Cream", "Brown", "Charcoal"],
    colors: ["#b3ab9c", "#f2ead9", "#6a4a34", "#3a3a3a"],
    galleryImages: ["/images/products/harmony-plush-panel-bed/1.jpeg"],
  },
  {
    name: "Scandinavian Breeze Bed",
    name_i18n: { he: "מיטה סקנדינבית בריז", fr: "Lit scandinave Breeze", it: "Letto scandinavo Breeze" },
    slug: "scandinavian-breeze-bed",
    category: "bedroom",
    subcategory: "Scandinavian Bed",
    price: 2090,
    image: "/images/products/scandinavian-breeze-bed/1.jpeg",
    description:
      "Soft fabric upholstery and clean Scandinavian styling create a bright, welcoming atmosphere. The padded headboard provides excellent comfort while the minimalist frame ensures lasting durability. Available in custom dimensions and fabric choices.\n\nMaterials & Care: Ash Wood Frame. Upholstery: Linen Blend.",
    description_i18n: {
      he: "ריפוד בד רך ועיצוב סקנדינבי נקי יוצרים אווירה בהירה ומזמינה. משענת הראש המרופדת מספקת נוחות מצוינת, בעוד המסגרת המינימליסטית מבטיחה עמידות לאורך זמן. זמינה במידות ובבחירת בדים בהתאמה אישית.\n\nחומרים וטיפוח: מסגרת עץ אלון. ריפוד: תערובת פשתן.",
      fr: "Une tapisserie en tissu doux et un style scandinave epure creent une atmosphere lumineuse et accueillante. La tete de lit rembourree offre un excellent confort, tandis que le cadre minimaliste garantit une durabilite a long terme. Disponible avec des dimensions et des choix de tissus personnalises.\n\nMateriaux et entretien: Structure en bois de frene. Tapisserie: Melange de lin.",
      it: "Un rivestimento in tessuto morbido e uno stile scandinavo essenziale creano un'atmosfera luminosa e accogliente. La testiera imbottita offre un ottimo comfort, mentre la struttura minimalista garantisce durata nel tempo. Disponibile con misure e scelte di tessuto personalizzate.\n\nMateriali e cura: Struttura in legno di frassino. Rivestimento: Misto lino."
    },
    dimensions: "Single: W105 × L210 × H110 cm",
    seatRange: "90×200, 140×190, 160×200",
    colorNames: ["White", "Light Grey", "Beige", "Sage"],
    colors: ["#ffffff", "#d3d3d0", "#e8ddc9", "#a3ab8f"],
    galleryImages: ["/images/products/scandinavian-breeze-bed/1.jpeg"],
  },
  {
    name: "Metro View Contemporary Bed",
    name_i18n: { he: "מיטה עכשווית מטרו וויו", fr: "Lit contemporain Metro View", it: "Letto contemporaneo Metro View" },
    slug: "metro-view-contemporary-bed",
    category: "bedroom",
    subcategory: "Contemporary Bed",
    price: 2390,
    image: "/images/products/metro-view-contemporary-bed/1.jpeg",
    description:
      "Contemporary design meets everyday functionality with premium upholstery and a supportive headboard. Crafted for durability and comfort, it can be personalized with different sizes, colors, and upholstery finishes.\n\nMaterials & Care: Engineered Wood & Solid Wood. Upholstery: Woven Polyester.",
    description_i18n: {
      he: "עיצוב עכשווי פוגש פונקציונליות יומיומית עם ריפוד איכותי ומשענת ראש תומכת. עוצבה לעמידות ונוחות, וניתן להתאים אותה אישית במידות, צבעים וגימורי ריפוד שונים.\n\nחומרים וטיפוח: עץ מהונדס ועץ מלא. ריפוד: פוליאסטר ארוג.",
      fr: "Un design contemporain rencontre la fonctionnalite au quotidien grace a une tapisserie haut de gamme et une tete de lit soutenante. Concu pour la durabilite et le confort, il peut etre personnalise avec differentes tailles, couleurs et finitions de tapisserie.\n\nMateriaux et entretien: Bois d'ingenierie et bois massif. Tapisserie: Polyester tisse.",
      it: "Un design contemporaneo incontra la funzionalita quotidiana con un rivestimento premium e una testiera di sostegno. Realizzato per durata e comfort, puo essere personalizzato con diverse misure, colori e finiture del rivestimento.\n\nMateriali e cura: Legno ingegnerizzato e legno massello. Rivestimento: Poliestere tessuto."
    },
    dimensions: "Queen: W176 × L220 × H118 cm",
    seatRange: "160×190, 160×200, 180×200",
    colorNames: ["Grey", "Walnut", "Cream", "Black"],
    colors: ["#9a9a9a", "#5a4632", "#f2ead9", "#1a1a1a"],
    galleryImages: ["/images/products/metro-view-contemporary-bed/1.jpeg"],
  },
  {
    name: "Serenity Wingback Bed",
    name_i18n: { he: "מיטת כנפיים סרניטי", fr: "Lit a oreilles Serenity", it: "Letto con schienale a orecchie Serenity" },
    slug: "serenity-wingback-bed",
    category: "bedroom",
    subcategory: "Wingback Bed",
    price: 2790,
    image: "/images/products/serenity-wingback-bed/1.jpeg",
    description:
      "A luxurious wingback silhouette wrapped in soft upholstery creates an inviting centerpiece for your bedroom. The tall cushioned headboard offers superior support, while the durable frame ensures long-lasting performance. Customize dimensions, fabrics, and finishes to suit your personal style.\n\nMaterials & Care: Solid Hardwood Frame. Upholstery: Premium Linen.",
    description_i18n: {
      he: "צללית כנפיים מפוארת עטופה בריפוד רך יוצרת מוקד מזמין לחדר השינה שלכם. משענת הראש הגבוהה והמרופדת מציעה תמיכה מעולה, בעוד המסגרת העמידה מבטיחה ביצועים לאורך שנים. התאימו אישית מידות, בדים וגימורים לפי הסגנון שלכם.\n\nחומרים וטיפוח: מסגרת עץ קשה מלא. ריפוד: פשתן פרימיום.",
      fr: "Une silhouette a oreilles luxueuse, enveloppee d'une tapisserie douce, cree une piece maitresse accueillante pour votre chambre. La haute tete de lit capitonnee offre un soutien superieur, tandis que le cadre robuste garantit une performance durable. Personnalisez les dimensions, tissus et finitions selon votre style.\n\nMateriaux et entretien: Structure en bois dur massif. Tapisserie: Lin premium.",
      it: "Una lussuosa silhouette con schienale a orecchie, avvolta in un morbido rivestimento, crea un punto focale accogliente per la vostra camera da letto. L'alta testiera imbottita offre un sostegno superiore, mentre la struttura resistente garantisce prestazioni durature. Personalizzate misure, tessuti e finiture secondo il vostro stile.\n\nMateriali e cura: Struttura in legno duro massello. Rivestimento: Lino premium."
    },
    dimensions: "Queen: W182 × L223 × H140 cm",
    seatRange: "160×200, 180×200, 200×200",
    colorNames: ["Ivory", "Dove Grey", "Beige", "Navy"],
    colors: ["#f4efe4", "#b8b5ae", "#e8ddc9", "#1f2a44"],
    galleryImages: ["/images/products/serenity-wingback-bed/1.jpeg"],
  },
  {
    name: "Imperial Luxe Channel Bed",
    name_i18n: { he: "מיטת ערוצים אימפריאל לוקס", fr: "Lit a cannelures Imperial Luxe", it: "Letto a canaline Imperial Luxe" },
    slug: "imperial-luxe-channel-bed",
    category: "bedroom",
    subcategory: "Channel Tufed Bed",
    price: 3090,
    image: "/images/products/imperial-luxe-channel-bed/1.png",
    description:
      "Modern vertical channel detailing paired with rich upholstery delivers refined elegance and exceptional comfort. The generously padded headboard offers excellent back support, while customizable sizing and upholstery make it a versatile choice for sophisticated interiors.\n\nMaterials & Care: Solid Wood Frame. Upholstery: Velvet or Bouclé.",
    description_i18n: {
      he: "פסי ערוצים אנכיים מודרניים לצד ריפוד עשיר מעניקים אלגנטיות מעודנת ונוחות יוצאת דופן. משענת הראש המרופדת בנדיבות מציעה תמיכה מצוינת לגב, בעוד אפשרויות המידה והריפוד להתאמה אישית הופכות אותה לבחירה רב-תכליתית לחללים מתוחכמים.\n\nחומרים וטיפוח: מסגרת עץ מלא. ריפוד: קטיפה או בד בוקלה.",
      fr: "Des cannelures verticales modernes associees a une tapisserie riche offrent une elegance raffinee et un confort exceptionnel. La tete de lit genereusement rembourree assure un excellent soutien du dos, tandis que la taille et la tapisserie personnalisables en font un choix polyvalent pour des interieurs sophistiques.\n\nMateriaux et entretien: Structure en bois massif. Tapisserie: Velours ou bouclette.",
      it: "Canaline verticali dal design moderno abbinate a un rivestimento ricco regalano un'eleganza raffinata e un comfort eccezionale. La testiera generosamente imbottita offre un ottimo sostegno alla schiena, mentre misure e rivestimento personalizzabili la rendono una scelta versatile per interni sofisticati.\n\nMateriali e cura: Struttura in legno massello. Rivestimento: Velluto o bouclé."
    },
    dimensions: "Queen: W180 × L222 × H135 cm",
    seatRange: "160×200, 180×200, 200×200",
    colorNames: ["Cream", "Charcoal", "Forest Green", "Taupe"],
    colors: ["#f2ead9", "#3a3a3a", "#1f3d2b", "#8b7d6b"],
    galleryImages: ["/images/products/imperial-luxe-channel-bed/1.png"],
  },
  {
    name: "Verona Comfort Dining Chair",
    name_i18n: { he: "כיסא פינת אוכל ורונה קומפורט", fr: "Chaise de salle a manger Verona Comfort", it: "Sedia da pranzo Verona Comfort" },
    slug: "verona-comfort-dining-chair",
    category: "dining",
    subcategory: "Upholstered Dining Chair",
    price: 890,
    image: "/images/products/verona-comfort-dining-chair/1.png",
    description:
      "A refined dining chair featuring soft upholstery and a supportive curved backrest that offers exceptional comfort for everyday dining. Crafted with clean lines and durable construction, making it a timeless addition to modern interiors. Suitable for dining rooms, cafés, and restaurants.\n\nMaterials & Care: Solid Ash Wood. Upholstery: Premium Bouclé.",
    description_i18n: {
      he: "כיסא פינת אוכל מעודן עם ריפוד רך ומשענת גב מעוגלת ותומכת המציעה נוחות יוצאת דופן לארוחות היומיום. עוצב עם קווים נקיים ומבנה עמיד, ומהווה תוספת נצחית לחללים מודרניים. מתאים לפינות אוכל, בתי קפה ומסעדות.\n\nחומרים וטיפוח: עץ אלון מלא. ריפוד: בד בוקלה איכותי.",
      fr: "Une chaise de salle a manger raffinee avec une tapisserie douce et un dossier courbe soutenant qui offre un confort exceptionnel au quotidien. Concue avec des lignes epurees et une construction durable, elle constitue un ajout intemporel aux interieurs modernes. Convient aux salles a manger, cafes et restaurants.\n\nMateriaux et entretien: Bois de frene massif. Tapisserie: Bouclette premium.",
      it: "Una sedia da pranzo raffinata con un rivestimento morbido e uno schienale curvo di sostegno che offre un comfort eccezionale per i pasti quotidiani. Realizzata con linee pulite e una struttura resistente, e un'aggiunta senza tempo agli interni moderni. Adatta a sale da pranzo, caffe e ristoranti.\n\nMateriali e cura: Legno di frassino massello. Rivestimento: Bouclé premium."
    },
    dimensions: "W52 × D58 × H82 cm",
    seatRange: "Standard Dining Height",
    colorNames: ["Ivory", "Beige", "Light Grey", "Taupe"],
    colors: ["#f4efe4", "#e8ddc9", "#d3d3d0", "#8b7d6b"],
    galleryImages: ["/images/products/verona-comfort-dining-chair/1.png"],
  },
  {
    name: "Siena Wrap Dining Chair",
    name_i18n: { he: "כיסא פינת אוכל עוטף סיינה", fr: "Chaise de salle a manger enveloppante Siena", it: "Sedia da pranzo avvolgente Siena" },
    slug: "siena-wrap-dining-chair",
    category: "dining",
    subcategory: "Arm Dining Chair",
    price: 1090,
    image: "/images/products/siena-wrap-dining-chair/1.png",
    description:
      "Designed with gently curved armrests and plush upholstery, this chair provides excellent seating comfort while adding elegance to contemporary dining spaces. Premium curved-back design.\n\nMaterials & Care: Solid Oak Wood. Upholstery: Linen Blend.",
    description_i18n: {
      he: "עוצב עם משענות ידיים מעוגלות בעדינות וריפוד רך, הכיסא הזה מספק נוחות ישיבה מצוינת ומוסיף אלגנטיות לחללי אוכל עכשוויים. עיצוב משענת גב מעוגלת פרימיום.\n\nחומרים וטיפוח: עץ אלון מלא. ריפוד: תערובת פשתן.",
      fr: "Concue avec des accoudoirs doucement courbes et une tapisserie moelleuse, cette chaise offre un excellent confort d'assise tout en ajoutant de l'elegance aux espaces de repas contemporains. Design a dossier courbe premium.\n\nMateriaux et entretien: Bois de chene massif. Tapisserie: Melange de lin.",
      it: "Realizzata con braccioli dolcemente curvi e un rivestimento morbido, questa sedia offre un comfort di seduta eccellente aggiungendo eleganza agli spazi pranzo contemporanei. Design premium a schienale curvo.\n\nMateriali e cura: Legno di quercia massello. Rivestimento: Misto lino."
    },
    dimensions: "W58 × D60 × H80 cm",
    seatRange: "Standard Dining Height",
    colorNames: ["Cream", "Stone", "Sand", "Olive"],
    colors: ["#f2ead9", "#b3ab9c", "#d9c9a8", "#6b6f45"],
    galleryImages: ["/images/products/siena-wrap-dining-chair/1.png", "/images/products/siena-wrap-dining-chair/2.png"],
  },
  {
    name: "Milan Classic Dining Chair",
    name_i18n: { he: "כיסא פינת אוכל קלאסי מילאנו", fr: "Chaise de salle a manger classique Milan", it: "Sedia da pranzo classica Milano" },
    slug: "milan-classic-dining-chair",
    category: "dining",
    subcategory: "Side Dining Chair",
    price: 790,
    image: "/images/products/milan-classic-dining-chair/1.png",
    description:
      "Combining a minimalist silhouette with soft padded seating, this chair offers ergonomic comfort and lasting durability. Perfect for both residential and commercial settings. Easy-to-clean upholstery.\n\nMaterials & Care: Solid Beech Wood. Upholstery: Performance Fabric.",
    description_i18n: {
      he: "בשילוב צללית מינימליסטית וישיבה מרופדת ורכה, הכיסא הזה מציע נוחות ארגונומית ועמידות לאורך זמן. מושלם הן למרחבי מגורים והן למסחר. ריפוד קל לניקוי.\n\nחומרים וטיפוח: עץ בוק מלא. ריפוד: בד ביצועים.",
      fr: "Alliant une silhouette minimaliste a une assise moelleuse et rembourree, cette chaise offre un confort ergonomique et une durabilite a long terme. Parfaite pour les environnements residentiels et commerciaux. Tapisserie facile a nettoyer.\n\nMateriaux et entretien: Bois de hetre massif. Tapisserie: Tissu performance.",
      it: "Unendo una silhouette minimalista a una seduta morbida e imbottita, questa sedia offre un comfort ergonomico e una durata nel tempo. Perfetta sia per ambienti residenziali che commerciali. Rivestimento facile da pulire.\n\nMateriali e cura: Legno di faggio massello. Rivestimento: Tessuto performance."
    },
    dimensions: "W48 × D56 × H83 cm",
    seatRange: "Standard Dining Height",
    colorNames: ["Beige", "Grey", "Black", "Camel"],
    colors: ["#e8ddc9", "#9a9a9a", "#1a1a1a", "#c19a6b"],
    galleryImages: ["/images/products/milan-classic-dining-chair/1.png"],
  },
  {
    name: "Florence Luxe Dining Chair",
    name_i18n: { he: "כיסא פינת אוכל פירנצה לוקס", fr: "Chaise de salle a manger Florence Luxe", it: "Sedia da pranzo Florence Luxe" },
    slug: "florence-luxe-dining-chair",
    category: "dining",
    subcategory: "Upholstered Dining Chair",
    price: 990,
    image: "/images/products/florence-luxe-dining-chair/1.png",
    description:
      "Elegant curves and luxurious upholstery create a sophisticated dining experience. The supportive seat and sturdy wooden legs ensure lasting everyday comfort. Contemporary luxury design.\n\nMaterials & Care: Solid Walnut Wood. Upholstery: Bouclé Fabric.",
    description_i18n: {
      he: "עקומות אלגנטיות וריפוד יוקרתי יוצרים חוויית אוכל מתוחכמת. המושב התומך ורגלי העץ היציבות מבטיחים נוחות יומיומית לאורך זמן. עיצוב יוקרה עכשווי.\n\nחומרים וטיפוח: עץ אגוז מלא. ריפוד: בד בוקלה.",
      fr: "Des courbes elegantes et une tapisserie luxueuse creent une experience de repas sophistiquee. L'assise soutenante et les pieds en bois robustes garantissent un confort durable au quotidien. Design de luxe contemporain.\n\nMateriaux et entretien: Bois de noyer massif. Tapisserie: Tissu bouclette.",
      it: "Curve eleganti e un rivestimento lussuoso creano un'esperienza a tavola sofisticata. La seduta di sostegno e le solide gambe in legno garantiscono un comfort duraturo ogni giorno. Design di lusso contemporaneo.\n\nMateriali e cura: Legno di noce massello. Rivestimento: Tessuto bouclé."
    },
    dimensions: "W54 × D59 × H81 cm",
    seatRange: "Standard Dining Height",
    colorNames: ["Ivory", "Cream", "Taupe"],
    colors: ["#f4efe4", "#f2ead9", "#8b7d6b"],
    galleryImages: ["/images/products/florence-luxe-dining-chair/1.png"],
  },
  {
    name: "Oslo Heritage Chair",
    name_i18n: { he: "כיסא מורשת אוסלו", fr: "Chaise Heritage Oslo", it: "Sedia Heritage Oslo" },
    slug: "oslo-heritage-chair",
    category: "dining",
    subcategory: "Wooden Dining Chair",
    price: 690,
    image: "/images/products/oslo-heritage-chair/1.png",
    description:
      "A beautiful combination of solid wood craftsmanship and a soft upholstered seat delivers classic elegance with modern comfort for everyday dining. Scandinavian-inspired styling.\n\nMaterials & Care: Solid Rubberwood. Upholstery: Linen Fabric Seat.",
    description_i18n: {
      he: "שילוב יפהפה של נגרות עץ מלא ומושב מרופד ורך מעניק אלגנטיות קלאסית עם נוחות מודרנית לארוחות היומיום. עיצוב בהשראה סקנדינבית.\n\nחומרים וטיפוח: עץ קאוצ'וק מלא. ריפוד: מושב בד פשתן.",
      fr: "Une belle combinaison d'artisanat en bois massif et d'une assise moelleuse rembourree offre une elegance classique alliee a un confort moderne pour les repas quotidiens. Style d'inspiration scandinave.\n\nMateriaux et entretien: Bois d'hevea massif. Tapisserie: Assise en tissu lin.",
      it: "Una splendida combinazione di artigianato in legno massello e una seduta morbida imbottita regala un'eleganza classica con comfort moderno per i pasti quotidiani. Stile di ispirazione scandinava.\n\nMateriali e cura: Legno di gomma massello. Rivestimento: Seduta in tessuto di lino."
    },
    dimensions: "W46 × D55 × H84 cm",
    seatRange: "Standard Dining Height",
    colorNames: ["Walnut", "Natural Oak", "Espresso"],
    colors: ["#5a4632", "#c7a878", "#3d271c"],
    galleryImages: ["/images/products/oslo-heritage-chair/1.png"],
  },
  {
    name: "Copenhagen Curve Chair",
    name_i18n: { he: "כיסא קופנהגן קרב", fr: "Chaise Copenhagen Curve", it: "Sedia Copenhagen Curve" },
    slug: "copenhagen-curve-chair",
    category: "dining",
    subcategory: "Designer Dining Chair",
    price: 1190,
    image: "/images/products/copenhagen-curve-chair/1.png",
    description:
      "Featuring sculptural wooden arms and a generously padded seat, this chair blends Nordic simplicity with premium craftsmanship for stylish dining spaces. Signature designer chair.\n\nMaterials & Care: Solid Ash Wood. Upholstery: Premium Fabric.",
    description_i18n: {
      he: "עם ידיות עץ פיסוליות ומושב מרופד בנדיבות, הכיסא הזה משלב פשטות נורדית עם נגרות איכותית לחללי אוכל מסוגננים. כיסא מעצבים בחתימה ייחודית.\n\nחומרים וטיפוח: עץ אלון מלא. ריפוד: בד פרימיום.",
      fr: "Avec ses accoudoirs en bois sculptural et son assise genereusement rembourree, cette chaise allie la simplicite nordique a un artisanat haut de gamme pour des espaces repas elegants. Chaise design signature.\n\nMateriaux et entretien: Bois de frene massif. Tapisserie: Tissu premium.",
      it: "Con braccioli in legno dal design scultoreo e una seduta generosamente imbottita, questa sedia unisce la semplicita nordica a un artigianato di pregio per spazi pranzo eleganti. Sedia d'autore dal design distintivo.\n\nMateriali e cura: Legno di frassino massello. Rivestimento: Tessuto premium."
    },
    dimensions: "W56 × D58 × H78 cm",
    seatRange: "Standard Dining Height",
    colorNames: ["Beige", "White", "Grey"],
    colors: ["#e8ddc9", "#ffffff", "#9a9a9a"],
    galleryImages: ["/images/products/copenhagen-curve-chair/1.png"],
  },
  {
    name: "Nordic Bistro Chair",
    name_i18n: { he: "כיסא ביסטרו נורדי", fr: "Chaise bistrot nordique", it: "Sedia bistrot nordica" },
    slug: "nordic-bistro-chair",
    category: "dining",
    subcategory: "Wooden Dining Chair",
    price: 590,
    image: "/images/products/nordic-bistro-chair/1.png",
    description:
      "Inspired by Scandinavian furniture, this chair offers a gently curved backrest with a cushioned seat for exceptional comfort and everyday durability. Ideal for cafés and dining rooms.\n\nMaterials & Care: Solid Oak. Upholstery: Fabric Cushion.",
    description_i18n: {
      he: "בהשראת רהיטים סקנדינביים, הכיסא הזה מציע משענת גב מעוגלת בעדינות עם מושב מרופד לנוחות יוצאת דופן ועמידות יומיומית. אידיאלי לבתי קפה ופינות אוכל.\n\nחומרים וטיפוח: עץ אלון מלא. ריפוד: כרית בד.",
      fr: "Inspiree du mobilier scandinave, cette chaise offre un dossier doucement courbe avec une assise capitonnee pour un confort exceptionnel et une durabilite au quotidien. Ideale pour les cafes et les salles a manger.\n\nMateriaux et entretien: Chene massif. Tapisserie: Coussin en tissu.",
      it: "Ispirata all'arredamento scandinavo, questa sedia offre uno schienale dolcemente curvo con una seduta imbottita per un comfort eccezionale e una durata quotidiana. Ideale per caffe e sale da pranzo.\n\nMateriali e cura: Quercia massello. Rivestimento: Cuscino in tessuto."
    },
    dimensions: "W45 × D52 × H79 cm",
    seatRange: "Standard Dining Height",
    colorNames: ["Walnut", "Natural", "Black"],
    colors: ["#5a4632", "#d9c9ac", "#1a1a1a"],
    galleryImages: ["/images/products/nordic-bistro-chair/1.png", "/images/products/nordic-bistro-chair/2.jpeg"],
  },
  {
    name: "Nordic Counter Stool",
    name_i18n: { he: "כיסא בר לדלפק נורדי", fr: "Tabouret de comptoir nordique", it: "Sgabello da bancone nordico" },
    slug: "nordic-counter-stool",
    category: "dining",
    subcategory: "Counter Stool",
    price: 790,
    image: "/images/products/nordic-counter-stool/1.png",
    description:
      "A stylish upholstered counter stool featuring a supportive backrest and solid wooden frame, designed to complement modern kitchen islands and breakfast counters. Suitable for 90–95 cm kitchen counters.\n\nMaterials & Care: Solid Oak. Upholstery: Performance Fabric.",
    description_i18n: {
      he: "שרפרף מרופד ומסוגנן עם משענת גב תומכת ומסגרת עץ מלא, שעוצב כדי להשלים איי מטבח מודרניים ודלפקי ארוחת בוקר. מתאים לדלפקי מטבח בגובה 90-95 ס\"מ.\n\nחומרים וטיפוח: עץ אלון מלא. ריפוד: בד ביצועים.",
      fr: "Un tabouret de comptoir tapisse et elegant avec un dossier soutenant et une structure en bois massif, concu pour completer les ilots de cuisine modernes et les comptoirs petit-dejeuner. Convient aux comptoirs de cuisine de 90 a 95 cm.\n\nMateriaux et entretien: Chene massif. Tapisserie: Tissu performance.",
      it: "Uno sgabello da bancone elegante e imbottito con schienale di sostegno e struttura in legno massello, pensato per completare isole cucina moderne e bancone della colazione. Adatto a banconi cucina di 90-95 cm.\n\nMateriali e cura: Quercia massello. Rivestimento: Tessuto performance."
    },
    dimensions: "W47 × D49 × H95 cm",
    seatRange: "Counter Height (65 cm)",
    colorNames: ["Walnut", "Natural Oak", "Black", "White"],
    colors: ["#5a4632", "#c7a878", "#1a1a1a", "#ffffff"],
    galleryImages: ["/images/products/nordic-counter-stool/1.png", "/images/products/nordic-counter-stool/2.jpeg"],
  },
  {
    name: "Nordic Elevate Bar Chair",
    name_i18n: { he: "כיסא בר נורדי אלווייט", fr: "Chaise de bar nordique Elevate", it: "Sedia da bar nordica Elevate" },
    slug: "nordic-elevate-bar-chair",
    category: "dining",
    subcategory: "Bar Chair",
    price: 0,
    image: "/images/products/nordic-elevate-bar-chair/1.jpeg",
    description:
      "A contemporary bar chair with a gently curved backrest and integrated arm support, offering exceptional comfort for kitchen islands and home bars. Its minimalist silhouette blends seamlessly with modern interiors while ensuring long-lasting durability. Ideal for 100–110 cm bar counters.\n\nMaterials & Care: Solid Ash Wood. Upholstery: Premium Performance Fabric.",
    description_i18n: {
      he: "כיסא בר עכשווי עם משענת גב מעוגלת בעדינות ותמיכת ידיים משולבת, המציע נוחות יוצאת דופן לאיי מטבח ובר ביתי. הצללית המינימליסטית משתלבת בצורה חלקה בחללים מודרניים תוך הבטחת עמידות לאורך זמן. אידיאלי לדלפקי בר בגובה 100-110 ס\"מ.\n\nחומרים וטיפוח: עץ אלון מלא. ריפוד: בד ביצועים פרימיום.",
      fr: "Une chaise de bar contemporaine avec un dossier doucement courbe et un soutien pour les bras integre, offrant un confort exceptionnel pour les ilots de cuisine et les bars a domicile. Sa silhouette minimaliste s'integre parfaitement aux interieurs modernes tout en garantissant une durabilite a long terme. Ideale pour les comptoirs de bar de 100 a 110 cm.\n\nMateriaux et entretien: Bois de frene massif. Tapisserie: Tissu performance premium.",
      it: "Una sedia da bar contemporanea con schienale dolcemente curvo e supporto per le braccia integrato, che offre un comfort eccezionale per isole cucina e bar domestici. La silhouette minimalista si integra perfettamente negli interni moderni garantendo al contempo una durata nel tempo. Ideale per banconi bar di 100-110 cm.\n\nMateriali e cura: Legno di frassino massello. Rivestimento: Tessuto performance premium."
    },
    dimensions: "W56 × D55 × H98 cm",
    seatRange: "Bar Height (75 cm)",
    colorNames: ["Ivory", "Sand", "Taupe", "Charcoal"],
    colors: ["#f4efe4", "#d9c9a8", "#8b7d6b", "#3a3a3a"],
    galleryImages: ["/images/products/nordic-elevate-bar-chair/1.jpeg", "/images/products/nordic-elevate-bar-chair/2.jpeg"],
  },
  {
    name: "Haven Lounge Arm Chair",
    name_i18n: { he: "כורסת טרקלין הייבן", fr: "Fauteuil lounge Haven", it: "Poltrona lounge Haven" },
    slug: "haven-lounge-arm-chair",
    category: "living-room",
    subcategory: "Upholstered Arm Chair",
    price: 1090,
    image: "/images/products/haven-lounge-arm-chair/1.jpeg",
    description:
      "Designed with soft contours and a generously padded seat, this chair provides excellent support for relaxed dining or lounge spaces. The solid wood frame enhances both durability and timeless appeal. Suitable for dining, meeting rooms, or lounges.\n\nMaterials & Care: Solid Oak Wood. Upholstery: Bouclé Fabric.",
    description_i18n: {
      he: "עוצבה עם קווים רכים ומושב מרופד בנדיבות, הכורסה הזו מספקת תמיכה מצוינת לחללי אוכל נינוחים או טרקלין. מסגרת העץ המלא מוסיפה גם עמידות וגם קסם נצחי. מתאימה לפינות אוכל, חדרי ישיבות או טרקלינים.\n\nחומרים וטיפוח: עץ אלון מלא. ריפוד: בד בוקלה.",
      fr: "Concu avec des contours doux et une assise genereusement rembourree, ce fauteuil offre un excellent soutien pour les espaces repas decontractes ou les salons. La structure en bois massif renforce a la fois la durabilite et le charme intemporel. Convient aux salles a manger, salles de reunion ou salons.\n\nMateriaux et entretien: Bois de chene massif. Tapisserie: Tissu bouclette.",
      it: "Realizzata con contorni morbidi e una seduta generosamente imbottita, questa poltrona offre un ottimo sostegno per spazi pranzo informali o zone living. La struttura in legno massello ne accresce sia la durata sia il fascino senza tempo. Adatta a sale da pranzo, sale riunioni o aree lounge.\n\nMateriali e cura: Legno di quercia massello. Rivestimento: Tessuto bouclé."
    },
    dimensions: "W60 × D58 × H80 cm",
    seatRange: "Standard Dining Height",
    colorNames: ["Cream", "Beige", "Stone", "Olive"],
    colors: ["#f2ead9", "#e8ddc9", "#b3ab9c", "#6b6f45"],
    galleryImages: ["/images/products/haven-lounge-arm-chair/1.jpeg", "/images/products/haven-lounge-arm-chair/2.jpeg"],
  },
  {
    name: "Oslo Counter Stool",
    name_i18n: { he: "כיסא בר לדלפק אוסלו", fr: "Tabouret de comptoir Oslo", it: "Sgabello da bancone Oslo" },
    slug: "oslo-counter-stool",
    category: "dining",
    subcategory: "Counter Stool",
    price: 890,
    image: "/images/products/oslo-counter-stool/1.jpeg",
    description:
      "Featuring a comfortable upholstered seat with a supportive curved backrest, this counter stool combines Scandinavian simplicity with everyday functionality. Perfect for kitchen islands and breakfast counters. Recommended for 90–95 cm kitchen counters.\n\nMaterials & Care: Solid Beech Wood & Steel Footrest. Upholstery: Linen Blend.",
    description_i18n: {
      he: "עם מושב מרופד ונוח ומשענת גב מעוגלת ותומכת, שרפרף הדלפק הזה משלב פשטות סקנדינבית עם פונקציונליות יומיומית. מושלם לאיי מטבח ודלפקי ארוחת בוקר. מומלץ לדלפקי מטבח בגובה 90-95 ס\"מ.\n\nחומרים וטיפוח: עץ בוק מלא ומשענת רגליים מפלדה. ריפוד: תערובת פשתן.",
      fr: "Avec une assise confortable et rembourree et un dossier courbe soutenant, ce tabouret de comptoir allie la simplicite scandinave a une fonctionnalite quotidienne. Parfait pour les ilots de cuisine et les comptoirs petit-dejeuner. Recommande pour les comptoirs de cuisine de 90 a 95 cm.\n\nMateriaux et entretien: Hetre massif et repose-pieds en acier. Tapisserie: Melange de lin.",
      it: "Con una seduta confortevole e imbottita e uno schienale curvo di sostegno, questo sgabello da bancone unisce la semplicita scandinava alla funzionalita quotidiana. Perfetto per isole cucina e banconi della colazione. Consigliato per banconi cucina di 90-95 cm.\n\nMateriali e cura: Faggio massello e poggiapiedi in acciaio. Rivestimento: Misto lino."
    },
    dimensions: "W48 × D50 × H92 cm",
    seatRange: "Counter Height (65 cm)",
    colorNames: ["Beige", "Grey", "Walnut", "Black"],
    colors: ["#e8ddc9", "#9a9a9a", "#5a4632", "#1a1a1a"],
    galleryImages: ["/images/products/oslo-counter-stool/1.jpeg", "/images/products/oslo-counter-stool/2.jpeg"],
  },
  {
    name: "Bergen Bar Stool",
    name_i18n: { he: "כיסא בר ברגן", fr: "Tabouret de bar Bergen", it: "Sgabello da bar Bergen" },
    slug: "bergen-bar-stool",
    category: "dining",
    subcategory: "Bar Stool",
    price: 990,
    image: "/images/products/bergen-bar-stool/1.jpeg",
    description:
      "Clean lines, a supportive backrest, and a durable solid wood frame make this stool an elegant addition to contemporary kitchens, cafés, and commercial spaces. Commercial-grade construction.\n\nMaterials & Care: Solid Ash Wood & Steel Footrest. Upholstery: Premium Fabric.",
    description_i18n: {
      he: "קווים נקיים, משענת גב תומכת ומסגרת עץ מלא ועמידה הופכים את השרפרף הזה לתוספת אלגנטית למטבחים עכשוויים, בתי קפה וחללים מסחריים. מבנה ברמה מסחרית.\n\nחומרים וטיפוח: עץ אלון מלא ומשענת רגליים מפלדה. ריפוד: בד פרימיום.",
      fr: "Des lignes epurees, un dossier soutenant et une structure durable en bois massif font de ce tabouret un ajout elegant aux cuisines contemporaines, cafes et espaces commerciaux. Construction de qualite commerciale.\n\nMateriaux et entretien: Bois de frene massif et repose-pieds en acier. Tapisserie: Tissu premium.",
      it: "Linee pulite, uno schienale di sostegno e una robusta struttura in legno massello rendono questo sgabello un'elegante aggiunta a cucine contemporanee, caffe e spazi commerciali. Costruzione di livello professionale.\n\nMateriali e cura: Legno di frassino massello e poggiapiedi in acciaio. Rivestimento: Tessuto premium."
    },
    dimensions: "W48 × D52 × H102 cm",
    seatRange: "Bar Height (75 cm)",
    colorNames: ["Beige", "Taupe", "Walnut", "Black"],
    colors: ["#e8ddc9", "#8b7d6b", "#5a4632", "#1a1a1a"],
    galleryImages: ["/images/products/bergen-bar-stool/1.jpeg", "/images/products/bergen-bar-stool/2.jpeg"],
  },
  {
    name: "Copenhagen Signature Chair",
    name_i18n: { he: "כיסא קופנהגן סיגנצ'ר", fr: "Chaise Copenhagen Signature", it: "Sedia Copenhagen Signature" },
    slug: "copenhagen-signature-chair",
    category: "dining",
    subcategory: "Designer Dining Chair",
    price: 990,
    image: "/images/products/copenhagen-signature-chair/1.jpeg",
    description:
      "A refined Scandinavian chair with sculpted curves, soft upholstery, and a minimalist profile. Designed for exceptional comfort while complementing both modern and classic interiors. Designer-inspired statement piece.\n\nMaterials & Care: Solid Oak Wood. Upholstery: Performance Fabric.",
    description_i18n: {
      he: "כיסא סקנדינבי מעודן עם עקומות פיסוליות, ריפוד רך ופרופיל מינימליסטי. עוצב לנוחות יוצאת דופן תוך השלמת חללים מודרניים וקלאסיים כאחד. פריט מצהיר בהשראת מעצבים.\n\nחומרים וטיפוח: עץ אלון מלא. ריפוד: בד ביצועים.",
      fr: "Une chaise scandinave raffinee aux courbes sculptees, a la tapisserie douce et au profil minimaliste. Concue pour un confort exceptionnel tout en s'accordant avec des interieurs modernes comme classiques. Piece signature d'inspiration design.\n\nMateriaux et entretien: Bois de chene massif. Tapisserie: Tissu performance.",
      it: "Una raffinata sedia scandinava dalle curve scolpite, dal rivestimento morbido e dal profilo minimalista. Progettata per un comfort eccezionale, si abbina sia a interni moderni sia classici. Un pezzo distintivo di ispirazione firmata.\n\nMateriali e cura: Legno di quercia massello. Rivestimento: Tessuto performance."
    },
    dimensions: "W50 × D55 × H80 cm",
    seatRange: "Standard Dining Height",
    colorNames: ["Ivory", "Camel", "Walnut", "Black"],
    colors: ["#f4efe4", "#c19a6b", "#5a4632", "#1a1a1a"],
    galleryImages: ["/images/products/copenhagen-signature-chair/1.jpeg"],
  },
  {
    name: "Loft Industrial Bar Stool",
    name_i18n: { he: "כיסא בר תעשייתי לופט", fr: "Tabouret de bar industriel Loft", it: "Sgabello da bar industriale Loft" },
    slug: "loft-industrial-bar-stool",
    category: "dining",
    subcategory: "Industrial Bar Stool",
    price: 790,
    image: "/images/products/loft-industrial-bar-stool/1.png",
    description:
      "Combining a solid wooden seat, curved backrest, and durable powder-coated steel frame, this stool delivers industrial character with everyday comfort. Ideal for bars, cafés, restaurants, and modern kitchen islands. Suitable for residential and commercial use.\n\nMaterials & Care: Solid Oak Seat & Powder-Coated Steel Frame. Upholstery: Optional Upholstered Seat.",
    description_i18n: {
      he: "בשילוב מושב עץ מלא, משענת גב מעוגלת ומסגרת פלדה עמידה בציפוי אבקה, השרפרף הזה מעניק אופי תעשייתי עם נוחות יומיומית. אידיאלי לברים, בתי קפה, מסעדות ואיי מטבח מודרניים. מתאים לשימוש ביתי ומסחרי.\n\nחומרים וטיפוח: מושב עץ אלון מלא ומסגרת פלדה בציפוי אבקה. ריפוד: מושב מרופד אופציונלי.",
      fr: "Combinant une assise en bois massif, un dossier courbe et une structure durable en acier thermolaque, ce tabouret degage un caractere industriel allie a un confort quotidien. Ideal pour les bars, cafes, restaurants et ilots de cuisine modernes. Convient a un usage residentiel et commercial.\n\nMateriaux et entretien: Assise en chene massif et structure en acier thermolaque. Tapisserie: Assise rembourree en option.",
      it: "Unendo una seduta in legno massello, uno schienale curvo e una robusta struttura in acciaio verniciato a polvere, questo sgabello regala un carattere industriale con comfort quotidiano. Ideale per bar, caffe, ristoranti e isole cucina moderne. Adatto a uso residenziale e commerciale.\n\nMateriali e cura: Seduta in quercia massello e struttura in acciaio verniciato a polvere. Rivestimento: Seduta imbottita opzionale."
    },
    dimensions: "W46 × D48 × H101 cm",
    seatRange: "Bar Height (75 cm)",
    colorNames: ["Natural Oak", "Walnut", "Black Oak"],
    colors: ["#c7a878", "#5a4632", "#2b2320"],
    galleryImages: ["/images/products/loft-industrial-bar-stool/1.png", "/images/products/loft-industrial-bar-stool/2.png"],
  },
  {
    name: "Verona Prism Glass Dining Table",
    name_i18n: { he: "שולחן אוכל זכוכית ורונה פריזם", fr: "Table a manger en verre Verona Prism", it: "Tavolo da pranzo in vetro Verona Prism" },
    slug: "verona-prism-glass-dining-table",
    category: "dining",
    subcategory: "Glass Dining Table",
    price: 3990,
    image: "/images/products/verona-prism-glass-dining-table/1.png",
    description:
      "A sophisticated dining table featuring a sculptural geometric wooden base paired with a tempered glass top. Designed to create an airy, elegant atmosphere while offering exceptional stability and everyday durability. The premium craftsmanship makes it an ideal centerpiece for contemporary dining spaces. Premium sculptural base with tempered safety glass.\n\nMaterials & Care: Solid Ash Wood Base. Upholstery: 12 mm Tempered Clear Glass.",
    description_i18n: {
      he: "שולחן אוכל מתוחכם עם בסיס עץ פיסולי וגיאומטרי בשילוב פלטת זכוכית מחוסמת. עוצב ליצירת אווירה מרוונחת ואלגנטית תוך הצעת יציבות יוצאת דופן ועמידות יומיומית. הנגרות האיכותית הופכת אותו למוקד אידיאלי לחללי אוכל עכשוויים. בסיס פיסולי פרימיום עם זכוכית בטיחות מחוסמת.\n\nחומרים וטיפוח: בסיס עץ אלון מלא. ריפוד: זכוכית שקופה מחוסמת בעובי 12 מ\"מ.",
      fr: "Une table a manger sophistiquee avec une base en bois sculpturale et geometrique associee a un plateau en verre trempe. Concue pour creer une atmosphere aerienne et elegante tout en offrant une stabilite exceptionnelle et une durabilite au quotidien. Son artisanat haut de gamme en fait une piece maitresse ideale pour les espaces repas contemporains. Base sculpturale premium avec verre de securite trempe.\n\nMateriaux et entretien: Base en bois de frene massif. Tapisserie: Verre trempe transparent de 12 mm.",
      it: "Un tavolo da pranzo sofisticato con una base scultorea e geometrica in legno abbinata a un piano in vetro temperato. Progettato per creare un'atmosfera ariosa ed elegante offrendo al contempo una stabilita eccezionale e una durata quotidiana. L'artigianato di pregio lo rende un punto focale ideale per spazi pranzo contemporanei. Base scultorea premium con vetro di sicurezza temperato.\n\nMateriali e cura: Base in legno di frassino massello. Rivestimento: Vetro trasparente temperato da 12 mm."
    },
    dimensions: "160 cm: W160 × D90 × H75 cm",
    seatRange: "160 × 90 cm, 180 × 100 cm, 200 × 100 cm",
    colorNames: ["Natural Oak", "Walnut", "Black Oak"],
    colors: ["#c7a878", "#5a4632", "#2b2320"],
    galleryImages: ["/images/products/verona-prism-glass-dining-table/1.png", "/images/products/verona-prism-glass-dining-table/2.png"],
  },
  {
    name: "Oslo Facet Round Dining Table",
    name_i18n: { he: "שולחן אוכל עגול אוסלו פאסט", fr: "Table a manger ronde a facettes Oslo", it: "Tavolo da pranzo rotondo sfaccettato Oslo" },
    slug: "oslo-facet-round-dining-table",
    category: "dining",
    subcategory: "Round Dining Table",
    price: 4490,
    image: "/images/products/oslo-facet-round-dining-table/1.png",
    description:
      "Featuring a beautifully faceted pedestal base and a solid wood tabletop, this round dining table combines sculptural beauty with practical functionality. Perfect for modern homes seeking warmth and timeless elegance. Ideal for contemporary and Scandinavian interiors.\n\nMaterials & Care: Solid Oak Wood. Upholstery: Solid Oak Veneer.",
    description_i18n: {
      he: "עם בסיס עמוד מחוטב בפאזות יפהפיות ופלטת עץ מלא, שולחן האוכל העגול הזה משלב יופי פיסולי עם פונקציונליות מעשית. מושלם לבתים מודרניים המחפשים חמימות ואלגנטיות נצחית. אידיאלי לחללים עכשוויים וסקנדינביים.\n\nחומרים וטיפוח: עץ אלון מלא. ריפוד: פורניר אלון מלא.",
      fr: "Avec une base pied central magnifiquement facettee et un plateau en bois massif, cette table a manger ronde allie beaute sculpturale et fonctionnalite pratique. Parfaite pour les maisons modernes en quete de chaleur et d'elegance intemporelle. Ideale pour les interieurs contemporains et scandinaves.\n\nMateriaux et entretien: Bois de chene massif. Tapisserie: Placage de chene massif.",
      it: "Con una base a piedistallo dalle splendide sfaccettature e un piano in legno massello, questo tavolo da pranzo rotondo unisce bellezza scultorea a funzionalita pratica. Perfetto per case moderne in cerca di calore ed eleganza senza tempo. Ideale per interni contemporanei e scandinavi.\n\nMateriali e cura: Legno di quercia massello. Rivestimento: Impiallacciatura in quercia massello."
    },
    dimensions: "Ø120: H75 cm",
    seatRange: "Ø120 cm, Ø140 cm, Ø160 cm",
    colorNames: ["Natural Oak", "Walnut", "Smoke Oak"],
    colors: ["#c7a878", "#5a4632", "#5c4c3d"],
    galleryImages: ["/images/products/oslo-facet-round-dining-table/1.png", "/images/products/oslo-facet-round-dining-table/2.jpeg"],
  },
  {
    name: "Copenhagen Extend Dining Table",
    name_i18n: { he: "שולחן אוכל נשלף קופנהגן", fr: "Table a manger extensible Copenhagen", it: "Tavolo da pranzo allungabile Copenhagen" },
    slug: "copenhagen-extend-dining-table",
    category: "dining",
    subcategory: "Extendable Dining Table",
    price: 5290,
    image: "/images/products/copenhagen-extend-dining-table/1.png",
    description:
      "A versatile extendable dining table designed for both everyday family meals and entertaining guests. The hidden extension mechanism expands smoothly while preserving its elegant sculptural appearance. Built with premium materials for lasting performance and timeless style. Hidden extension leaf included.\n\nMaterials & Care: Solid Ash Wood & Engineered Wood. Upholstery: Natural Wood Veneer.",
    description_i18n: {
      he: "שולחן אוכל נשלף ורב-תכליתי, עוצב הן לארוחות משפחתיות יומיומיות והן לאירוח אורחים. מנגנון ההרחבה הנסתר נפתח בצורה חלקה תוך שמירה על המראה הפיסולי האלגנטי. נבנה מחומרים איכותיים לביצועים לאורך זמן וסגנון נצחי. כולל לוח הרחבה נסתר.\n\nחומרים וטיפוח: עץ אלון מלא ועץ מהונדס. ריפוד: פורניר עץ טבעי.",
      fr: "Une table a manger extensible et polyvalente, concue pour les repas de famille au quotidien comme pour recevoir des invites. Le mecanisme d'extension dissimule se deploie en douceur tout en preservant son elegante allure sculpturale. Fabriquee avec des materiaux haut de gamme pour une performance durable et un style intemporel. Rallonge dissimulee incluse.\n\nMateriaux et entretien: Bois de frene massif et bois d'ingenierie. Tapisserie: Placage de bois naturel.",
      it: "Un tavolo da pranzo allungabile e versatile, pensato sia per i pasti quotidiani in famiglia sia per intrattenere gli ospiti. Il meccanismo di allungamento nascosto si apre in modo fluido preservando il suo elegante aspetto scultoreo. Realizzato con materiali di pregio per prestazioni durature e uno stile senza tempo. Prolunga nascosta inclusa.\n\nMateriali e cura: Legno di frassino massello e legno ingegnerizzato. Rivestimento: Impiallacciatura in legno naturale."
    },
    dimensions: "Closed: W160 × D90 × H75 cm",
    seatRange: "160–220 cm, 180–260 cm",
    colorNames: ["Natural Oak", "Walnut", "Black Oak"],
    colors: ["#c7a878", "#5a4632", "#2b2320"],
    galleryImages: ["/images/products/copenhagen-extend-dining-table/1.png", "/images/products/copenhagen-extend-dining-table/2.jpeg"],
  },
  {
    name: "Verona Prism Dining Set",
    name_i18n: { he: "מערכת פינת אוכל ורונה פריזם", fr: "Ensemble salle a manger Verona Prism", it: "Set da pranzo Verona Prism" },
    slug: "verona-prism-dining-set",
    category: "dining",
    subcategory: "Glass Dining Set",
    price: 8990,
    image: "/images/products/verona-prism-dining-set/1.png",
    description:
      "A luxurious dining set featuring a sculptural solid ash wood base paired with a premium tempered glass tabletop. The upholstered chairs provide exceptional comfort while the elegant geometric base creates a sophisticated centerpiece for modern dining rooms. Dining table with six matching upholstered chairs.\n\nMaterials & Care: Solid Ash Wood, Tempered Glass. Upholstery: Premium Bouclé Fabric (Chairs).",
    description_i18n: {
      he: "מערכת פינת אוכל יוקרתית עם בסיס פיסולי מעץ אלון מלא בשילוב פלטת זכוכית מחוסמת פרימיום. הכיסאות המרופדים מספקים נוחות יוצאת דופן, בעוד הבסיס הגיאומטרי האלגנטי יוצר מוקד מתוחכם לפינות אוכל מודרניות. שולחן אוכל עם שישה כיסאות מרופדים תואמים.\n\nחומרים וטיפוח: עץ אלון מלא, זכוכית מחוסמת. ריפוד: בד בוקלה פרימיום (כיסאות).",
      fr: "Un ensemble de salle a manger luxueux avec une base sculpturale en frene massif associee a un plateau en verre trempe haut de gamme. Les chaises rembourrees offrent un confort exceptionnel, tandis que la base geometrique elegante cree une piece maitresse sophistiquee pour les salles a manger modernes. Table a manger avec six chaises rembourrees assorties.\n\nMateriaux et entretien: Frene massif, verre trempe. Tapisserie: Tissu bouclette premium (chaises).",
      it: "Un lussuoso set da pranzo con una base scultorea in frassino massello abbinata a un piano in vetro temperato di pregio. Le sedie imbottite offrono un comfort eccezionale, mentre l'elegante base geometrica crea un punto focale sofisticato per sale da pranzo moderne. Tavolo da pranzo con sei sedie imbottite coordinate.\n\nMateriali e cura: Frassino massello, vetro temperato. Rivestimento: Tessuto bouclé premium (sedie)."
    },
    dimensions: "Table: H75 cm",
    seatRange: "160 × 90 cm (6 Seater), 180 × 100 cm (6–8 Seater), 200 × 100 cm (8 Seater)",
    colorNames: ["Natural Oak", "Walnut", "Ivory", "Beige", "Stone"],
    colors: ["#c7a878", "#5a4632", "#f4efe4", "#e8ddc9", "#b3ab9c"],
    galleryImages: ["/images/products/verona-prism-dining-set/1.png"],
  },
  {
    name: "Oslo Pedestal Dining Set",
    name_i18n: { he: "מערכת פינת אוכל אוסלו פדסטל", fr: "Ensemble salle a manger sur pied Oslo", it: "Set da pranzo con piedistallo Oslo" },
    slug: "oslo-pedestal-dining-set",
    category: "dining",
    subcategory: "Round Dining Set",
    price: 9490,
    image: "/images/products/oslo-pedestal-dining-set/1.jpeg",
    description:
      "Crafted with a beautifully faceted pedestal base and a solid oak tabletop, this dining set combines Scandinavian elegance with everyday practicality. Comfortable upholstered chairs complete the refined contemporary look. Available with 4, 6 or 8 matching chairs.\n\nMaterials & Care: Solid Oak & Oak Veneer. Upholstery: Performance Fabric (Chairs).",
    description_i18n: {
      he: "נבנתה עם בסיס עמוד מחוטב בפאזות יפהפיות ופלטת אלון מלא, מערכת פינת האוכל הזו משלבת אלגנטיות סקנדינבית עם פרקטיות יומיומית. כיסאות מרופדים ונוחים משלימים את המראה העכשווי המעודן. זמינה עם 4, 6 או 8 כיסאות תואמים.\n\nחומרים וטיפוח: אלון מלא ופורניר אלון. ריפוד: בד ביצועים (כיסאות).",
      fr: "Fabrique avec une base pied central magnifiquement facettee et un plateau en chene massif, cet ensemble de salle a manger allie l'elegance scandinave a une praticite quotidienne. Des chaises rembourrees confortables completent son allure contemporaine raffinee. Disponible avec 4, 6 ou 8 chaises assorties.\n\nMateriaux et entretien: Chene massif et placage de chene. Tapisserie: Tissu performance (chaises).",
      it: "Realizzato con una base a piedistallo dalle splendide sfaccettature e un piano in quercia massello, questo set da pranzo unisce l'eleganza scandinava alla praticita quotidiana. Comode sedie imbottite completano il look contemporaneo raffinato. Disponibile con 4, 6 o 8 sedie coordinate.\n\nMateriali e cura: Quercia massello e impiallacciatura in quercia. Rivestimento: Tessuto performance (sedie)."
    },
    dimensions: "Table: H75 cm",
    seatRange: "Ø120 cm (4 Seater), Ø140 cm (6 Seater), Ø160 cm (6–8 Seater)",
    colorNames: ["Natural Oak", "Walnut", "Cream", "Grey"],
    colors: ["#c7a878", "#5a4632", "#f2ead9", "#9a9a9a"],
    galleryImages: ["/images/products/oslo-pedestal-dining-set/1.jpeg"],
  },
  {
    name: "Heritage Oak Dining Set",
    name_i18n: { he: "מערכת פינת אוכל הריטג' אלון", fr: "Ensemble salle a manger Heritage Oak", it: "Set da pranzo Heritage Oak" },
    slug: "heritage-oak-dining-set",
    category: "dining",
    subcategory: "Wooden Dining Set",
    price: 7990,
    image: "/images/products/heritage-oak-dining-set/1.jpeg",
    description:
      "A timeless dining set crafted from premium solid wood with upholstered seating for lasting comfort. Its warm natural finish and clean lines make it an ideal choice for both contemporary and classic interiors. Traditional solid wood construction with upholstered dining chairs.\n\nMaterials & Care: Solid Rubberwood & Oak Veneer. Upholstery: Linen Blend Fabric.",
    description_i18n: {
      he: "מערכת פינת אוכל נצחית שנבנתה מעץ מלא איכותי עם ישיבה מרופדת לנוחות לאורך זמן. הגימור הטבעי והחם והקווים הנקיים הופכים אותה לבחירה אידיאלית הן לחללים עכשוויים והן לקלאסיים. מבנה עץ מלא מסורתי עם כיסאות אוכל מרופדים.\n\nחומרים וטיפוח: עץ קאוצ'וק מלא ופורניר אלון. ריפוד: תערובת פשתן.",
      fr: "Un ensemble de salle a manger intemporel fabrique en bois massif de qualite avec une assise rembourree pour un confort durable. Sa finition naturelle chaleureuse et ses lignes epurees en font un choix ideal pour les interieurs contemporains comme classiques. Construction traditionnelle en bois massif avec chaises de salle a manger rembourrees.\n\nMateriaux et entretien: Bois d'hevea massif et placage de chene. Tapisserie: Melange de lin.",
      it: "Un set da pranzo senza tempo realizzato in legno massello di pregio con seduta imbottita per un comfort duraturo. La finitura naturale e calda e le linee pulite lo rendono una scelta ideale sia per interni contemporanei sia classici. Struttura tradizionale in legno massello con sedie da pranzo imbottite.\n\nMateriali e cura: Legno di gomma massello e impiallacciatura in quercia. Rivestimento: Misto lino."
    },
    dimensions: "Table: H75 cm",
    seatRange: "180 × 90 cm (6 Seater), 220 × 100 cm (8 Seater)",
    colorNames: ["Natural Oak", "Walnut", "Espresso"],
    colors: ["#c7a878", "#5a4632", "#3d271c"],
    galleryImages: ["/images/products/heritage-oak-dining-set/1.jpeg"],
  },
  {
    name: "Copenhagen Extend Dining Set",
    name_i18n: { he: "מערכת פינת אוכל נשלפת קופנהגן", fr: "Ensemble salle a manger extensible Copenhagen", it: "Set da pranzo allungabile Copenhagen" },
    slug: "copenhagen-extend-dining-set",
    category: "dining",
    subcategory: "Extendable Dining Set",
    price: 10490,
    image: "/images/products/copenhagen-extend-dining-set/1.jpeg",
    description:
      "Designed for modern living, this extendable dining set features a sculptural wooden pedestal base and a smooth butterfly extension system. Comfortable upholstered chairs and premium craftsmanship make it ideal for both everyday meals and entertaining guests. Hidden butterfly extension mechanism included.\n\nMaterials & Care: Solid Ash Wood & Engineered Wood. Upholstery: Premium Woven Fabric (Chairs).",
    description_i18n: {
      he: "עוצבה למגורים מודרניים, מערכת פינת האוכל הנשלפת הזו כוללת בסיס עמוד עץ פיסולי ומנגנון הרחבת פרפר חלק. כיסאות מרופדים ונוחים ונגרות איכותית הופכים אותה לאידיאלית הן לארוחות יומיומיות והן לאירוח אורחים. כולל מנגנון הרחבת פרפר נסתר.\n\nחומרים וטיפוח: עץ אלון מלא ועץ מהונדס. ריפוד: בד ארוג פרימיום (כיסאות).",
      fr: "Concu pour la vie moderne, cet ensemble de salle a manger extensible presente une base pied central sculpturale en bois et un systeme d'extension papillon fluide. Des chaises rembourrees confortables et un artisanat haut de gamme en font un choix ideal pour les repas quotidiens comme pour recevoir des invites. Mecanisme d'extension papillon dissimule inclus.\n\nMateriaux et entretien: Frene massif et bois d'ingenierie. Tapisserie: Tissu tisse premium (chaises).",
      it: "Pensato per la vita moderna, questo set da pranzo allungabile presenta una base a piedistallo scultorea in legno e un fluido sistema di allungamento a farfalla. Comode sedie imbottite e un artigianato di pregio lo rendono ideale sia per i pasti quotidiani sia per intrattenere gli ospiti. Meccanismo di allungamento a farfalla nascosto incluso.\n\nMateriali e cura: Frassino massello e legno ingegnerizzato. Rivestimento: Tessuto tramato premium (sedie)."
    },
    dimensions: "Closed: 160 × 90 × 75 cm",
    seatRange: "160–220 cm (6–8 Seater), 180–260 cm (8–10 Seater)",
    colorNames: ["Natural Oak", "Walnut", "Black Oak"],
    colors: ["#c7a878", "#5a4632", "#2b2320"],
    galleryImages: ["/images/products/copenhagen-extend-dining-set/1.jpeg"],
  },
  {
    name: "Aurora Haven Lounge Set",
    name_i18n: { he: "מערכת טרקלין אורורה הייבן", fr: "Ensemble salon Aurora Haven", it: "Set salotto Aurora Haven" },
    slug: "aurora-haven-lounge-set",
    category: "living-room",
    subcategory: "Modern Living Room Set",
    price: 11490,
    image: "/images/products/aurora-haven-lounge-set/1.png",
    description:
      "A contemporary living room ensemble featuring deep, supportive seating with clean architectural lines and a sculptural oak coffee table. Designed for modern homes, it delivers exceptional comfort while maintaining an elegant minimalist appearance suitable for both everyday living and entertaining. Includes matching coffee table and accent chair.\n\nMaterials & Care: Solid Ash Wood Frame, Engineered Wood. Upholstery: Premium Bouclé Fabric.",
    description_i18n: {
      he: "מערכת סלון עכשווית עם ישיבה עמוקה ותומכת, קווים אדריכליים נקיים ושולחן סלון פיסולי מעץ אלון. עוצבה לבתים מודרניים, ומעניקה נוחות יוצאת דופן תוך שמירה על מראה מינימליסטי ואלגנטי המתאים גם לחיי היומיום וגם לאירוח. כוללת שולחן סלון וכורסה תואמים.\n\nחומרים וטיפוח: מסגרת עץ אלון מלא, עץ מהונדס. ריפוד: בד בוקלה פרימיום.",
      fr: "Un ensemble de salon contemporain avec une assise profonde et soutenante, des lignes architecturales epurees et une table basse sculpturale en chene. Concu pour les maisons modernes, il offre un confort exceptionnel tout en conservant une allure minimaliste et elegante, adaptee a la vie quotidienne comme a la reception d'invites. Comprend une table basse et un fauteuil d'appoint assortis.\n\nMateriaux et entretien: Structure en frene massif, bois d'ingenierie. Tapisserie: Tissu bouclette premium.",
      it: "Un ensemble da salotto contemporaneo con una seduta profonda e di sostegno, linee architettoniche pulite e un tavolino scultoreo in quercia. Pensato per case moderne, offre un comfort eccezionale mantenendo un aspetto minimalista ed elegante, adatto sia alla vita quotidiana sia all'intrattenimento. Include tavolino e poltrona coordinati.\n\nMateriali e cura: Struttura in frassino massello, legno ingegnerizzato. Rivestimento: Tessuto bouclé premium."
    },
    dimensions: "Sofa: W230 × D98 × H82 cm",
    seatRange: "3-Seater + Lounge Chair, Complete Living Room Set",
    colorNames: ["Ivory", "Beige", "Stone", "Light Grey"],
    colors: ["#f4efe4", "#e8ddc9", "#b3ab9c", "#d3d3d0"],
    galleryImages: ["/images/products/aurora-haven-lounge-set/1.png"],
  },
  {
    name: "Lunaro Comfort Sofa Set",
    name_i18n: { he: "מערכת ספות לונרו קומפורט", fr: "Ensemble canape Lunaro Comfort", it: "Set divano Lunaro Comfort" },
    slug: "lunaro-comfort-sofa-set",
    category: "living-room",
    subcategory: "Scandinavian Sofa Set",
    price: 10990,
    image: "/images/products/lunaro-comfort-sofa-set/1.jpeg",
    description:
      "Featuring softly rounded silhouettes and plush cushioning, this elegant sofa set creates a warm and inviting atmosphere. Upholstered in premium performance fabric, it combines timeless Scandinavian aesthetics with exceptional durability for everyday family living. Modular design with premium soft-touch upholstery.\n\nMaterials & Care: Solid Hardwood Frame. Upholstery: Easy-Clean Performance Fabric.",
    description_i18n: {
      he: "עם צלליות מעוגלות בעדינות וכריות רכות ופנקניות, מערכת הספות האלגנטית הזו יוצרת אווירה חמה ומזמינה. מרופדת בבד ביצועים איכותי, היא משלבת אסתטיקה סקנדינבית נצחית עם עמידות יוצאת דופן לחיי המשפחה היומיומיים. עיצוב מודולרי עם ריפוד רך ונעים למגע.\n\nחומרים וטיפוח: מסגרת עץ קשה מלא. ריפוד: בד ביצועים קל לניקוי.",
      fr: "Avec des silhouettes doucement arrondies et un rembourrage moelleux, cet elegant ensemble canape cree une atmosphere chaleureuse et accueillante. Tapisse d'un tissu performance haut de gamme, il allie une esthetique scandinave intemporelle a une durabilite exceptionnelle pour la vie de famille au quotidien. Design modulable avec tapisserie douce au toucher.\n\nMateriaux et entretien: Structure en bois dur massif. Tapisserie: Tissu performance facile a nettoyer.",
      it: "Con silhouette dolcemente arrotondate e cuscini morbidi e avvolgenti, questo elegante set divano crea un'atmosfera calda e accogliente. Rivestito in tessuto performance di pregio, unisce un'estetica scandinava senza tempo a una durata eccezionale per la vita familiare quotidiana. Design modulare con rivestimento morbido al tatto.\n\nMateriali e cura: Struttura in legno duro massello. Rivestimento: Tessuto performance facile da pulire."
    },
    dimensions: "Sofa: W280 × D105 × H72 cm",
    seatRange: "3-Seater, 3+1 Lounge Set, Modular Configuration",
    colorNames: ["Cream", "Sand", "Ivory", "Stone", "Taupe"],
    colors: ["#f2ead9", "#d9c9a8", "#f4efe4", "#b3ab9c", "#8b7d6b"],
    galleryImages: ["/images/products/lunaro-comfort-sofa-set/1.jpeg"],
  },
  {
    name: "Nordica Curve Living Set",
    name_i18n: { he: "מערכת סלון נורדיקה קרב", fr: "Ensemble salon courbe Nordica", it: "Set soggiorno curvo Nordica" },
    slug: "nordica-curve-living-set",
    category: "living-room",
    subcategory: "Curved Living Room Set",
    price: 9990,
    image: "/images/products/nordica-curve-living-set/1.jpeg",
    description:
      "Inspired by contemporary European interiors, this curved lounge collection blends soft organic forms with luxurious comfort. The rounded coffee table and elegant proportions create a refined centerpiece ideal for sophisticated living spaces. Rounded silhouette designed for premium contemporary homes.\n\nMaterials & Care: Solid Ash Wood & Plywood. Upholstery: Linen Blend Performance Fabric.",
    description_i18n: {
      he: "בהשראת חללים אירופיים עכשוויים, קולקציית הטרקלין המעוגלת הזו משלבת צורות אורגניות רכות עם נוחות יוקרתית. שולחן הסלון המעוגל והפרופורציות האלגנטיות יוצרים מוקד מעודן ואידיאלי לחללי מגורים מתוחכמים. צללית מעוגלת שעוצבה לבתים עכשוויים ויוקרתיים.\n\nחומרים וטיפוח: עץ אלון מלא ולבידים. ריפוד: תערובת פשתן וביצועים.",
      fr: "Inspiree des interieurs europeens contemporains, cette collection lounge courbe allie des formes organiques douces a un confort luxueux. La table basse arrondie et les proportions elegantes creent une piece maitresse raffinee, ideale pour des espaces de vie sophistiques. Silhouette arrondie concue pour les maisons contemporaines haut de gamme.\n\nMateriaux et entretien: Frene massif et contreplaque. Tapisserie: Tissu performance melange de lin.",
      it: "Ispirata agli interni europei contemporanei, questa collezione lounge dalle forme curve unisce morbide linee organiche a un comfort lussuoso. Il tavolino arrotondato e le proporzioni eleganti creano un punto focale raffinato, ideale per spazi living sofisticati. Silhouette arrotondata pensata per case contemporanee di pregio.\n\nMateriali e cura: Frassino massello e compensato. Rivestimento: Tessuto performance misto lino."
    },
    dimensions: "Sofa: W250 × D102 × H80 cm",
    seatRange: "3-Seater, Accent Chair Set",
    colorNames: ["Ivory", "Beige", "Greige", "Walnut"],
    colors: ["#f4efe4", "#e8ddc9", "#beb3a3", "#5a4632"],
    galleryImages: ["/images/products/nordica-curve-living-set/1.jpeg"],
  },
  {
    name: "Solstice Organic Lounge Set",
    name_i18n: { he: "מערכת טרקלין אורגנית סולסטיס", fr: "Ensemble lounge organique Solstice", it: "Set lounge organico Solstice" },
    slug: "solstice-organic-lounge-set",
    category: "living-room",
    subcategory: "Luxury Lounge Set",
    price: 12490,
    image: "/images/products/solstice-organic-lounge-set/1.jpeg",
    description:
      "Crafted with flowing organic curves and premium upholstery, this lounge collection offers an inviting seating experience while elevating the aesthetic of any modern interior. Its sculptural coffee table enhances the luxurious contemporary design. Scandinavian-inspired design with natural oak detailing.\n\nMaterials & Care: Solid Oak Frame, Engineered Wood. Upholstery: Premium Woven Fabric.",
    description_i18n: {
      he: "נבנתה עם עקומות אורגניות זורמות וריפוד יוקרתי, קולקציית הטרקלין הזו מציעה חוויית ישיבה מזמינה תוך שדרוג האסתטיקה של כל חלל מודרני. שולחן הסלון הפיסולי שלה מעצים את העיצוב העכשווי היוקרתי. עיצוב בהשראה סקנדינבית עם פרטי אלון טבעי.\n\nחומרים וטיפוח: מסגרת אלון מלא, עץ מהונדס. ריפוד: בד ארוג פרימיום.",
      fr: "Fabriquee avec des courbes organiques fluides et une tapisserie haut de gamme, cette collection lounge offre une experience d'assise accueillante tout en sublimant l'esthetique de tout interieur moderne. Sa table basse sculpturale rehausse le design contemporain luxueux. Design d'inspiration scandinave avec des details en chene naturel.\n\nMateriaux et entretien: Structure en chene massif, bois d'ingenierie. Tapisserie: Tissu tisse premium.",
      it: "Realizzato con curve organiche fluide e un rivestimento di pregio, questa collezione lounge offre un'esperienza di seduta accogliente elevando al contempo l'estetica di ogni interno moderno. Il tavolino scultoreo esalta il design contemporaneo lussuoso. Design di ispirazione scandinava con dettagli in quercia naturale.\n\nMateriali e cura: Struttura in quercia massello, legno ingegnerizzato. Rivestimento: Tessuto tramato premium."
    },
    dimensions: "Sofa: W225 × D95 × H80 cm",
    seatRange: "3-Seater + Lounge Chair, Complete Living Room Set",
    colorNames: ["Natural Oak", "Beige", "Cream", "Stone"],
    colors: ["#c7a878", "#e8ddc9", "#f2ead9", "#b3ab9c"],
    galleryImages: ["/images/products/solstice-organic-lounge-set/1.jpeg"],
  },
  {
    name: "Elysian Cloud Living Set",
    name_i18n: { he: "מערכת סלון אליזיאן קלאוד", fr: "Ensemble salon Elysian Cloud", it: "Set soggiorno Elysian Cloud" },
    slug: "elysian-cloud-living-set",
    category: "living-room",
    subcategory: "Premium Living Room Set",
    price: 12990,
    image: "/images/products/elysian-cloud-living-set/1.jpeg",
    description:
      "A luxurious living room collection designed with oversized proportions, cloud-like cushions, and contemporary styling. The elegant neutral palette and premium materials create an atmosphere of comfort, sophistication, and effortless modern luxury. Premium living room collection including matching round coffee table.\n\nMaterials & Care: Solid Ash Wood Frame, Engineered Wood. Upholstery: Premium Bouclé Fabric.",
    description_i18n: {
      he: "קולקציית סלון יוקרתית שעוצבה עם פרופורציות גדולות, כריות רכות כענן וסטיילינג עכשווי. הפלטה הניטרלית האלגנטית והחומרים האיכותיים יוצרים אווירה של נוחות, תחכום ויוקרה מודרנית ללא מאמץ. קולקציית סלון פרימיום הכוללת שולחן סלון עגול תואם.\n\nחומרים וטיפוח: מסגרת עץ אלון מלא, עץ מהונדס. ריפוד: בד בוקלה פרימיום.",
      fr: "Une collection de salon luxueuse concue avec des proportions genereuses, des coussins nuageux et un style contemporain. La palette neutre elegante et les materiaux haut de gamme creent une atmosphere de confort, de raffinement et de luxe moderne sans effort. Collection salon premium incluant une table basse ronde assortie.\n\nMateriaux et entretien: Structure en frene massif, bois d'ingenierie. Tapisserie: Tissu bouclette premium.",
      it: "Una lussuosa collezione da salotto progettata con proporzioni generose, cuscini soffici come nuvole e uno stile contemporaneo. La raffinata palette neutra e i materiali di pregio creano un'atmosfera di comfort, eleganza e lusso moderno senza sforzo. Collezione da salotto premium che include un tavolino rotondo coordinato.\n\nMateriali e cura: Struttura in frassino massello, legno ingegnerizzato. Rivestimento: Tessuto bouclé premium."
    },
    dimensions: "3-Seater Sofa: W230 × D98 × H82 cm",
    seatRange: "3-Seater + Accent Chair, 3+2 Seater Set, Complete Living Room Set",
    colorNames: ["Ivory", "Beige", "Sand", "Stone", "Light Grey"],
    colors: ["#f4efe4", "#e8ddc9", "#d9c9a8", "#b3ab9c", "#d3d3d0"],
    galleryImages: ["/images/products/elysian-cloud-living-set/1.jpeg"],
  },
  {
    name: "Sorrento Comfort Sofa",
    name_i18n: { he: "ספת סורנטו קומפורט", fr: "Canape Sorrento Comfort", it: "Divano Sorrento Comfort" },
    slug: "sorrento-comfort-sofa",
    category: "sofas",
    subcategory: "Modern 3-Seater Sofa",
    price: 6490,
    image: "/images/products/sorrento-comfort-sofa/1.png",
    description:
      "Designed for contemporary homes, the Sorrento Comfort Sofa blends refined Scandinavian styling with exceptional everyday comfort. Featuring slim metal legs, generously padded cushions, and clean architectural lines, it offers an elegant centerpiece suitable for both minimalist and luxury interiors. Available with matching lounge chair and ottoman.\n\nMaterials & Care: Solid Pine Wood Frame, Engineered Wood. Upholstery: Premium Easy-Clean Bouclé Fabric.",
    description_i18n: {
      he: "עוצבה לבתים עכשוויים, ספת סורנטו קומפורט משלבת סטיילינג סקנדינבי מעודן עם נוחות יומיומית יוצאת דופן. עם רגלי מתכת דקות, כריות מרופדות בנדיבות וקווים אדריכליים נקיים, היא מציעה מוקד אלגנטי המתאים הן לחללים מינימליסטיים והן ליוקרתיים. זמינה עם כורסה והדום תואמים.\n\nחומרים וטיפוח: מסגרת עץ אורן מלא, עץ מהונדס. ריפוד: בד בוקלה פרימיום קל לניקוי.",
      fr: "Concu pour les maisons contemporaines, le canape Sorrento Comfort allie un style scandinave raffine a un confort quotidien exceptionnel. Avec ses pieds fins en metal, ses coussins genereusement rembourres et ses lignes architecturales epurees, il offre une piece maitresse elegante adaptee aux interieurs minimalistes comme luxueux. Disponible avec fauteuil et pouf assortis.\n\nMateriaux et entretien: Structure en pin massif, bois d'ingenierie. Tapisserie: Tissu bouclette premium facile a nettoyer.",
      it: "Pensato per case contemporanee, il divano Sorrento Comfort unisce uno stile scandinavo raffinato a un comfort quotidiano eccezionale. Con sottili gambe in metallo, cuscini generosamente imbottiti e linee architettoniche pulite, offre un punto focale elegante adatto sia a interni minimalisti sia lussuosi. Disponibile con poltrona e pouf coordinati.\n\nMateriali e cura: Struttura in pino massello, legno ingegnerizzato. Rivestimento: Tessuto bouclé premium facile da pulire."
    },
    dimensions: "W225 × D95 × H82 cm",
    seatRange: "2-Seater (180 cm), 3-Seater (225 cm), 3.5-Seater (250 cm)",
    colorNames: ["Ivory", "Sand", "Stone", "Beige", "Light Grey"],
    colors: ["#f4efe4", "#d9c9a8", "#b3ab9c", "#e8ddc9", "#d3d3d0"],
    galleryImages: ["/images/products/sorrento-comfort-sofa/1.png", "/images/products/sorrento-comfort-sofa/2.png"],
  },
  {
    name: "Milano Cloud Modular Sofa",
    name_i18n: { he: "ספה מודולרית מילאנו קלאוד", fr: "Canape modulable Milano Cloud", it: "Divano modulare Milano Cloud" },
    slug: "milano-cloud-modular-sofa",
    category: "sofas",
    subcategory: "Modular Sofa",
    price: 8990,
    image: "/images/products/milano-cloud-modular-sofa/1.png",
    description:
      "A luxurious modular sofa designed with oversized cushions and deep seating for superior relaxation. Its soft silhouette and flexible modular layout make it ideal for spacious modern living rooms while maintaining an elegant contemporary appearance. Modular sections can be rearranged to fit different room layouts.\n\nMaterials & Care: Solid Hardwood Frame. Upholstery: Premium Performance Fabric.",
    description_i18n: {
      he: "ספה מודולרית יוקרתית שעוצבה עם כריות גדולות וישיבה עמוקה למנוחה עילאית. הצללית הרכה והפריסה המודולרית הגמישה הופכות אותה לאידיאלית לסלונים מודרניים ומרווחים תוך שמירה על מראה עכשווי ואלגנטי. ניתן לסדר מחדש את המקטעים המודולריים כדי להתאים לפריסות חדר שונות.\n\nחומרים וטיפוח: מסגרת עץ קשה מלא. ריפוד: בד ביצועים פרימיום.",
      fr: "Un canape modulable luxueux concu avec des coussins surdimensionnes et une assise profonde pour une relaxation superieure. Sa silhouette douce et sa disposition modulable flexible en font un choix ideal pour les grands salons modernes tout en conservant une allure contemporaine elegante. Les elements modulables peuvent etre reorganises pour s'adapter a differentes configurations de piece.\n\nMateriaux et entretien: Structure en bois dur massif. Tapisserie: Tissu performance premium.",
      it: "Un lussuoso divano modulare progettato con cuscini extra large e una seduta profonda per un relax superiore. La sua silhouette morbida e la disposizione modulare flessibile lo rendono ideale per ampi soggiorni moderni, mantenendo al contempo un aspetto contemporaneo ed elegante. Le sezioni modulari possono essere riorganizzate per adattarsi a diverse configurazioni della stanza.\n\nMateriali e cura: Struttura in legno duro massello. Rivestimento: Tessuto performance premium."
    },
    dimensions: "W300 × D110 × H70 cm",
    seatRange: "280 cm, 300 cm, Modular L-Shape Configuration",
    colorNames: ["Cream", "Ivory", "Sand", "Taupe", "Stone"],
    colors: ["#f2ead9", "#f4efe4", "#d9c9a8", "#8b7d6b", "#b3ab9c"],
    galleryImages: ["/images/products/milano-cloud-modular-sofa/1.png", "/images/products/milano-cloud-modular-sofa/2.jpeg"],
  },
  {
    name: "Torino Heritage Sofa",
    name_i18n: { he: "ספת טורינו הריטג'", fr: "Canape Torino Heritage", it: "Divano Torino Heritage" },
    slug: "torino-heritage-sofa",
    category: "sofas",
    subcategory: "Contemporary Sofa",
    price: 7490,
    image: "/images/products/torino-heritage-sofa/1.png",
    description:
      "Combining timeless craftsmanship with modern comfort, the Torino Heritage Sofa features plush back cushions, supportive seating, and a durable hardwood frame. Its versatile design complements both contemporary and transitional interiors with understated elegance. Classic silhouette with removable back cushions for easy maintenance.\n\nMaterials & Care: Solid Ash Wood Frame. Upholstery: Premium Linen Blend Fabric.",
    description_i18n: {
      he: "בשילוב נגרות נצחית עם נוחות מודרנית, ספת טורינו הריטג' כוללת כריות גב רכות ופנקניות, ישיבה תומכת ומסגרת עץ קשה עמידה. עיצובה הרב-תכליתי משתלב הן בחללים עכשוויים והן במעברים סגנוניים באלגנטיות מאופקת. צללית קלאסית עם כריות גב נשלפות לתחזוקה קלה.\n\nחומרים וטיפוח: מסגרת עץ אשור מלא. ריפוד: תערובת פשתן פרימיום.",
      fr: "Alliant un artisanat intemporel a un confort moderne, le canape Torino Heritage presente des coussins de dossier moelleux, une assise soutenante et une structure durable en bois dur. Son design polyvalent complete aussi bien les interieurs contemporains que de transition avec une elegance discrete. Silhouette classique avec coussins de dossier amovibles pour un entretien facile.\n\nMateriaux et entretien: Structure en frene massif. Tapisserie: Tissu melange de lin premium.",
      it: "Unendo un artigianato senza tempo a un comfort moderno, il divano Torino Heritage presenta cuscini schienale morbidi e avvolgenti, una seduta di sostegno e una robusta struttura in legno duro. Il suo design versatile si abbina sia a interni contemporanei sia di transizione con un'eleganza sobria. Silhouette classica con cuscini schienale sfoderabili per una manutenzione facile.\n\nMateriali e cura: Struttura in frassino massello. Rivestimento: Tessuto misto lino premium."
    },
    dimensions: "W230 × D98 × H84 cm",
    seatRange: "2.5-Seater (200 cm), 3-Seater (230 cm), 3.5-Seater (250 cm)",
    colorNames: ["Natural Linen", "Beige", "Stone", "Olive Grey"],
    colors: ["#e6dcc6", "#e8ddc9", "#b3ab9c", "#82806a"],
    galleryImages: ["/images/products/torino-heritage-sofa/1.png", "/images/products/torino-heritage-sofa/2.jpeg"],
  },
];

export const storefrontPages: Record<string, StorefrontPage> = {
  sofas: {
    title: "Sofas",
    eyebrow: "Custom collection",
    description:
      "Choose a made-to-order sofa, then personalize size, structure, fabric, color and leg style.",
    heroImage: "/images/hero-living-room.png",
    filters: ["Sort by", "Sofa Type", "Size", "Seats", "Price"],
    products: storefrontProducts.filter(
      (product) => product.category === "sofas",
    ),
  },
  "living-room": {
    title: "Living Room",
    eyebrow: "Complete the room",
    description:
      "Coffee tables, side tables, consoles, rugs and lounge pieces for a calm modern living space.",
    heroImage: "/images/category-living-room.png",
    filters: [
      "Coffee Tables",
      "Side Tables",
      "TV Units",
      "Consoles",
      "Armchairs",
      "Rugs",
      "Storage",
      "Lighting",
      "Decorative Accessories",
    ],
    products: storefrontProducts.filter(
      (product) => product.category === "living-room",
    ),
  },
  dining: {
    title: "Dining",
    eyebrow: "Gathering spaces",
    description:
      "Tables, chairs, benches and storage pieces designed for everyday meals and hosting.",
    heroImage: "/images/category-dining-room.png",
    filters: [
      "Tables",
      "Chairs",
      "Extendable Tables",
      "Benches",
      "Sideboards",
      "Display Cabinets",
      "Bar Stools",
      "Lighting",
      "Decorative Accessories",
    ],
    products: storefrontProducts.filter(
      (product) => product.category === "dining",
    ),
  },
  bedroom: {
    title: "Bedroom",
    eyebrow: "Quiet comfort",
    description:
      "Beds, nightstands, dressers and accessories that make the bedroom feel finished.",
    heroImage: "/images/category-bedroom.png",
    filters: [
      "Beds",
      "Nightstands",
      "Dressers",
      "Wardrobes",
      "Benches",
      "Mattresses",
      "Lighting",
      "Vanity Tables",
      "Chest of Drawers",
      "Decorative Accessories",
    ],
    products: storefrontProducts.filter(
      (product) => product.category === "bedroom",
    ),
  },
};

export function getStorefrontProduct(slug: string) {
  return storefrontProducts.find(
    (product) =>
      product.slug === slug || product.slug.replace("-sofa", "") === slug,
  );
}

export function localizedProductName(product: StorefrontProduct, locale: string): string {
  return product.name_i18n?.[locale as "he" | "fr" | "it"] ?? product.name;
}

export function localizedProductDescription(product: StorefrontProduct, locale: string): string | undefined {
  return product.description_i18n?.[locale as "he" | "fr" | "it"] ?? product.description;
}
