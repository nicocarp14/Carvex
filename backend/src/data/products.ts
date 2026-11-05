export type SeedCategory = { name: string; slug: string };
export type SeedProduct = {
  name: string;
  slug: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  size: string;
  featured?: boolean;
  description: string;
  usage: string;
};

export const categories: SeedCategory[] = [
  { name: "Lavado", slug: "lavado" },
  { name: "Protección", slug: "proteccion" },
  { name: "Pulido", slug: "pulido" },
  { name: "Interior", slug: "interior" },
  { name: "Exterior", slug: "exterior" },
];

/**
 * Catálogo inicial Vonixx (25 productos).
 * Precios de referencia ARS — actualizar antes de producción.
 * Imágenes: placeholder vía data URI en frontend hasta tener fotos reales.
 */
export const products: SeedProduct[] = [
  {
    name: "Iron Remover",
    slug: "vonixx-iron-remover",
    categorySlug: "lavado",
    price: 14500,
    size: "500ml",
    featured: true,
    description:
      "Removedor de partículas de hierro para carrocería y llantas. Disuelve contaminantes ferrosos incrustados que el lavado común no quita, dejando la superficie lista para el sellado.",
    usage:
      "Pulverizar sobre llantas o carrocería, esperar 3-5 minutos hasta que tome color rojizo, frotar suavemente con cepillo o guante y enjuagar con abundante agua. No aplicar bajo sol directo.",
  },
  {
    name: "Dissolve",
    slug: "vonixx-dissolve",
    categorySlug: "lavado",
    price: 15900,
    size: "500ml",
    featured: true,
    description:
      "Descontaminante alcalino multiusos para autos, motos y embarcaciones. Remueve insectos, savia y suciedad grasa en minutos sin dañar la pintura.",
    usage:
      "Rociar sobre la superficie, esperar 2-3 minutos, frotar con microfibra húmeda y enjuagar. Ideal como pre-lavado antes del shampoo.",
  },
  {
    name: "V-Flash",
    slug: "vonixx-v-flash",
    categorySlug: "lavado",
    price: 12500,
    size: "500ml",
    description:
      "Lavado rápido con efecto hidrófugo. Limpia y deja brillo con repelencia al agua en una sola pasada, ideal para mantenimiento entre lavados.",
    usage:
      "Pulverizar sobre el vehículo mojado, pasar microfibra de pelusa larga y secar. Puede usarse en pintura, vidrios, plásticos y cromados.",
  },
  {
    name: "Blend",
    slug: "vonixx-blend",
    categorySlug: "lavado",
    price: 9800,
    size: "500ml",
    description:
      "Shampoo de lavado con lubricación y brillo. Genera espuma densa que levanta la suciedad sin rayar, con acabado suave al tacto.",
    usage:
      "Diluir 20-30ml en balde con 10L de agua o usar en cañón de espuma. Lavado con guante con movimientos suaves y enjuagar.",
  },
  {
    name: "V-All",
    slug: "vonixx-v-all",
    categorySlug: "lavado",
    price: 11200,
    size: "500ml",
    description:
      "Limpiador universal para interior, exterior, llantas y motor. Versión multiusos de la línea V para limpieza rápida del detailing.",
    usage:
      "Aplicar con pulverizador sobre la superficie, frotar con cepillo o microfibra y retirar con trapo limpio. Ajustar dilución según suciedad.",
  },
  {
    name: "Glaxy",
    slug: "vonixx-glaxy",
    categorySlug: "lavado",
    price: 16900,
    size: "500ml",
    featured: true,
    description:
      "Lavado con cera híbrida incorporada. Limpia, abrillanta y protege en un paso con hidrofobia duradera, ideal para mantenimiento de sellados.",
    usage:
      "Diluir 30-40ml en 10L de agua. Lavar con guante y enjuagar. No requiere encerado adicional después.",
  },
  {
    name: "Claybar Descontaminante",
    slug: "vonixx-claybar",
    categorySlug: "lavado",
    price: 8900,
    size: "100g",
    description:
      "Barra de arcilla para descontaminar pintura: remueve savia, alquitrán y contaminantes pegados para dejarla lisa como vidrio.",
    usage:
      "Lubricar la zona con agua o lubricante, deslizar la claybar con presión suave en movimientos rectos y secar. Amasar para renovar la superficie.",
  },
  {
    name: "Native Hybrid Wax",
    slug: "vonixx-native-hybrid-wax",
    categorySlug: "proteccion",
    price: 24500,
    size: "120g",
    featured: true,
    description:
      "Cera híbrida de alta durabilidad con carnauba brasileña. Brillo profundo, hidrofobia intensa y protección de hasta 6 meses.",
    usage:
      "Aplicar capa fina con aplicador de espuma, esperar 10-15 minutos y retirar con microfibra. Trabajar en paneles pequeños.",
  },
  {
    name: "Native Wax",
    slug: "vonixx-native-wax",
    categorySlug: "proteccion",
    price: 21500,
    size: "120g",
    description:
      "Cera de carnauba pura vonixx para brillo clásico. Calidez de color y repelencia al agua con acabado de concesionaria.",
    usage:
      "Aplicar capa fina, esperar que nuble (10 minutos), buffear con microfibra de pelusa larga hasta lograr brillo.",
  },
  {
    name: "Renova Wax",
    slug: "vonixx-renova-wax",
    categorySlug: "proteccion",
    price: 19500,
    size: "120g",
    description:
      "Cera renovadora para plásticos y molduras externas. Restaura el negro profundo y protege contra UV sin efecto grasoso.",
    usage:
      "Aplicar con aplicador de espuma sobre plástico seco, dejar 5 minutos y retirar excedentes. No apta para neumáticos.",
  },
  {
    name: "Ceratec",
    slug: "vonixx-ceratec",
    categorySlug: "proteccion",
    price: 32500,
    size: "250ml",
    featured: true,
    description:
      "Sellador cerámico spray de fácil aplicación. Protección hidrófoba de hasta 12 meses sin necesidad de curado complejo.",
    usage:
      "Lavar y secar, pulverizar panel por panel y distribuir con microfibra. Curado inicial 1 hora. Mantener alejado de la lluvia 24h.",
  },
  {
    name: "Radix",
    slug: "vonixx-radix",
    categorySlug: "pulido",
    price: 28900,
    size: "500ml",
    featured: true,
    description:
      "Pasta de corte medio-alto para remover rayas y defectos. Equilibra corte y acabado para un pulido en menos pasos.",
    usage:
      "Aplicar 3-4 gotas en pad de pulido, trabajar a 1200-1500 RPM en pasadas lentas. Limpiar pad entre paneles.",
  },
  {
    name: "American Polish",
    slug: "vonixx-american-polish",
    categorySlug: "pulido",
    price: 27500,
    size: "500ml",
    description:
      "Abrillantador de acabado con excelente lubricación. Refina la pintura hasta un espejo profundo tras el corte.",
    usage:
      "Aplicar en pad de acabado, trabajar a 1000-1200 RPM con presión leve. Buffear con microfibra limpia.",
  },
  {
    name: "V-40",
    slug: "vonixx-v-40",
    categorySlug: "pulido",
    price: 18500,
    size: "500ml",
    description:
      "Compuesto de pulido suave para mantenimiento. Elimina micro-rayas y restaura el brillo sin agresión.",
    usage:
      "Aplicar en pad suave, pasadas lentas a 1000 RPM. Ideal para pinturas blancas y claras.",
  },
  {
    name: "V-45",
    slug: "vonixx-v-45",
    categorySlug: "pulido",
    price: 19800,
    size: "500ml",
    description:
      "Compuesto de corte agresivo para defectos severos. Remueve oxidación, marcas de lavado y rayas profundas.",
    usage:
      "Aplicar en pad de corte, 1400-1600 RPM, presión media. Siempre refinar con American Polish después.",
  },
  {
    name: "Rosca Pasta",
    slug: "vonixx-rosca-pasta",
    categorySlug: "pulido",
    price: 16500,
    size: "500ml",
    description:
      "Pasta de pulido para remolques y superficies muy dañadas. Alta agresividad para trabajo pesado.",
    usage:
      "Aplicar en pad de lana o corte, trabajar por secciones pequeñas. Refinar con compuesto más fino.",
  },
  {
    name: "Sintra Fast",
    slug: "vonixx-sintra-fast",
    categorySlug: "interior",
    price: 13500,
    size: "500ml",
    featured: true,
    description:
      "Limpiador rápido para interiores: tapizados, plásticos y consola. Limpia y deja acabado natural sin brillo grasoso.",
    usage:
      "Pulverizar sobre microfibra (no directo en telas sensibles), frotar y retirar con trapo seco. Repetir en manchas fuertes.",
  },
  {
    name: "Sintra",
    slug: "vonixx-sintra",
    categorySlug: "interior",
    price: 14800,
    size: "500ml",
    description:
      "Limpiador interior concentrado para cuero, tela y plástico. Remueve suciedad embebida y revive los materiales.",
    usage:
      "Diluir según indicación (1:5 a 1:10), aplicar con cepillo suave, frotar en círculos y retirar con aspiradora o microfibra.",
  },
  {
    name: "Blend Interior",
    slug: "vonixx-blend-interior",
    categorySlug: "interior",
    price: 11800,
    size: "500ml",
    description:
      "Acondicionador para plásticos y vinílicos interiores. Protección UV con acabado mate y aroma agradable.",
    usage:
      "Aplicar con microfibra sobre plástico limpio, distribuir uniformemente y buffear excedentes.",
  },
  {
    name: "V-Light",
    slug: "vonixx-v-light",
    categorySlug: "exterior",
    price: 14200,
    size: "500ml",
    description:
      "Limpiador alcalino para llantas y exterior. Remueve grasa de freno y suciedad pesada de rutas.",
    usage:
      "Pulverizar, esperar 2 minutos, frotar con cepillo para llantas y enjuagar. Usar guantes.",
  },
  {
    name: "Desengrasante Multipropósito",
    slug: "vonixx-desengrasante",
    categorySlug: "exterior",
    price: 10900,
    size: "1L",
    description:
      "Desengrasante concentrado para motor, guardabarros y zonas grasosas. Potencia industrial, dilución a medida.",
    usage:
      "Diluir 1:5 a 1:10 según suciedad, pulverizar, frotar con cepillo y enjuagar con abundante agua.",
  },
  {
    name: "V-Protect",
    slug: "vonixx-v-protect",
    categorySlug: "proteccion",
    price: 19900,
    size: "500ml",
    description:
      "Protector hidrófugo para vidrios y carrocería de mantenimiento. Brillo y repelencia al agua en minutos.",
    usage:
      "Pulverizar sobre superficie limpia y seca, repartir con microfibra y buffear hasta que no queden vetas.",
  },
  {
    name: "V-Compound",
    slug: "vonixx-v-compound",
    categorySlug: "pulido",
    price: 17200,
    size: "500ml",
    originalPrice: 20500,
    description:
      "Compuesto de pulido modernizado para terminación rápida. Corte eficiente con acabado listo para proteger.",
    usage:
      "Aplicar en pad de pulido, 1200 RPM, pasadas sobrepuestas. Puede completarse con American Polish si se busca espejo.",
  },
  {
    name: "V-Nano Pro",
    slug: "vonixx-v-nano-pro",
    categorySlug: "proteccion",
    price: 35800,
    size: "250ml",
    featured: true,
    description:
      "Recubrimiento nano cerámico profesional. La protección más duradera de la línea para кузов y llantas.",
    usage:
      "Aplicar con aplicador suede sobre pintura descontaminada, capa fina, curado 24h sin agua. Solo para usuarios avanzados.",
  },
  {
    name: "Kit Lavado Completo",
    slug: "vonixx-kit-lavado-completo",
    categorySlug: "lavado",
    price: 49500,
    originalPrice: 62000,
    size: "Kit 4 piezas",
    featured: true,
    description:
      "Kit mantenimiento completo: Iron + Blend + V-Flash + Claybar. Todo lo necesario para un lavado detailing paso a paso.",
    usage:
      "Secuencia: Iron (descontaminación), Claybar (lisado), Blend (lavado), V-Flash (protección rápida).",
  },
];
