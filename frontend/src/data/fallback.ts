import type { Product, Category } from "../types";

export const categoriesFallback: Category[] = [
  { id: 1, name: "Lavado y Descontaminación", slug: "lavado", _count: { products: 8 } },
  { id: 2, name: "Pulimentos", slug: "pulimentos", _count: { products: 6 } },
  { id: 3, name: "Ceras", slug: "ceras", _count: { products: 3 } },
  { id: 4, name: "Selladores y Protección", slug: "selladores", _count: { products: 3 } },
  { id: 5, name: "Acondicionadores e Interior", slug: "interior", _count: { products: 3 } },
  { id: 6, name: "Llantas y Exterior", slug: "exterior", _count: { products: 2 } },
];

const cat = (id: number, name: string, slug: string): Category => ({ id, name, slug });

const base: Array<Omit<Product, "category" | "brand" | "featured" | "related" | "originalPrice" | "imageUrl" | "variants"> & {
  category: Category;
  originalPrice?: number;
  featured?: boolean;
}> = [
  { id: 1, name: "Iron Remover", slug: "vonixx-iron-remover", price: 14500, size: "500ml", featured: true, category: cat(1, "Lavado y Descontaminación", "lavado"), description: "Removedor de partículas de hierro para carrocería y llantas. Disuelve contaminantes ferrosos incrustados que el lavado común no quita.", usage: "Pulverizar, esperar 3-5 min hasta color rojizo, frotar y enjuagar con abundante agua." },
  { id: 2, name: "Dissolve", slug: "vonixx-dissolve", price: 15900, size: "500ml", featured: true, category: cat(1, "Lavado y Descontaminación", "lavado"), description: "Descontaminante alcalino multiusos. Remueve insectos, savia y suciedad grasa en minutos sin dañar la pintura.", usage: "Rociar, esperar 2-3 min, frotar con microfibra húmeda y enjuagar." },
  { id: 3, name: "V-Flash", slug: "vonixx-v-flash", price: 12500, size: "500ml", category: cat(1, "Lavado y Descontaminación", "lavado"), description: "Lavado rápido con efecto hidrófugo. Limpia y deja brillo con repelencia al agua en una sola pasada.", usage: "Pulverizar sobre vehículo mojado, pasar microfibra de pelusa larga y secar." },
  { id: 4, name: "Blend", slug: "vonixx-blend", price: 9800, size: "500ml", category: cat(1, "Lavado y Descontaminación", "lavado"), description: "Shampoo de lavado con lubricación y brillo. Espuma densa que levanta la suciedad sin rayar.", usage: "Diluir 20-30ml en 10L de agua o usar en cañón de espuma. Lavado con guante y enjuagar." },
  { id: 5, name: "V-All", slug: "vonixx-v-all", price: 11200, size: "500ml", category: cat(1, "Lavado y Descontaminación", "lavado"), description: "Limpiador universal para interior, exterior, llantas y motor.", usage: "Aplicar con pulverizador, frotar con cepillo o microfibra y retirar con trapo limpio." },
  { id: 6, name: "Glaxy", slug: "vonixx-glaxy", price: 16900, size: "500ml", featured: true, category: cat(1, "Lavado y Descontaminación", "lavado"), description: "Lavado con cera híbrida incorporada. Limpia, abrillanta y protege en un paso.", usage: "Diluir 30-40ml en 10L de agua. Lavar con guante y enjuagar." },
  { id: 7, name: "Claybar Descontaminante", slug: "vonixx-claybar", price: 8900, size: "100g", category: cat(1, "Lavado y Descontaminación", "lavado"), description: "Barra de arcilla para descontaminar pintura: remueve savia, alquitrán y contaminantes pegados.", usage: "Lubricar la zona, deslizar la claybar con presión suave y secar. Amasar para renovar." },
  { id: 8, name: "Native Hybrid Wax", slug: "vonixx-native-hybrid-wax", price: 24500, size: "120g", featured: true, category: cat(3, "Ceras", "ceras"), description: "Cera híbrida de alta durabilidad con carnauba brasileña. Brillo profundo e hidrofobia intensa.", usage: "Aplicar capa fina, esperar 10-15 min y retirar con microfibra. Trabajar en paneles pequeños." },
  { id: 9, name: "Native Wax", slug: "vonixx-native-wax", price: 21500, size: "120g", category: cat(3, "Ceras", "ceras"), description: "Cera de carnauba pura vonixx para brillo clásico. Calidez de color y repelencia al agua.", usage: "Aplicar capa fina, esperar que nuble y buffear con microfibra de pelusa larga." },
  { id: 10, name: "Renova Wax", slug: "vonixx-renova-wax", price: 19500, size: "120g", category: cat(3, "Ceras", "ceras"), description: "Cera renovadora para plásticos y molduras externas. Restaura el negro profundo y protege contra UV.", usage: "Aplicar con aplicador de espuma sobre plástico seco, dejar 5 min y retirar excedentes." },
  { id: 11, name: "Ceratec", slug: "vonixx-ceratec", price: 32500, size: "250ml", featured: true, category: cat(4, "Selladores y Protección", "selladores"), description: "Sellador cerámico spray de fácil aplicación. Protección hidrófoba de hasta 12 meses.", usage: "Lavar y secar, pulverizar panel por panel y distribuir con microfibra. Curado 1 hora." },
  { id: 12, name: "Radix", slug: "vonixx-radix", price: 28900, size: "500ml", featured: true, category: cat(2, "Pulimentos", "pulimentos"), description: "Pasta de corte medio-alto para remover rayas y defectos. Equilibra corte y acabado.", usage: "3-4 gotas en pad de pulido, 1200-1500 RPM en pasadas lentas." },
  { id: 13, name: "American Polish", slug: "vonixx-american-polish", price: 27500, size: "500ml", category: cat(2, "Pulimentos", "pulimentos"), description: "Abrillantador de acabado con excelente lubricación. Refina la pintura hasta un espejo profundo.", usage: "Aplicar en pad de acabado, 1000-1200 RPM con presión leve." },
  { id: 14, name: "V-40", slug: "vonixx-v-40", price: 18500, size: "500ml", category: cat(2, "Pulimentos", "pulimentos"), description: "Compuesto de pulido suave para mantenimiento. Elimina micro-rayas y restaura el brillo.", usage: "Aplicar en pad suave, pasadas lentas a 1000 RPM." },
  { id: 15, name: "V-45", slug: "vonixx-v-45", price: 19800, size: "500ml", category: cat(2, "Pulimentos", "pulimentos"), description: "Compuesto de corte agresivo para defectos severos. Remueve oxidación y marcas de lavado.", usage: "Aplicar en pad de corte, 1400-1600 RPM. Refinar con American Polish después." },
  { id: 16, name: "Rosca Pasta", slug: "vonixx-rosca-pasta", price: 16500, size: "500ml", category: cat(2, "Pulimentos", "pulimentos"), description: "Pasta de pulido para remolques y superficies muy dañadas. Alta agresividad.", usage: "Aplicar en pad de lana o corte, trabajar por secciones pequeñas." },
  { id: 17, name: "Sintra Fast", slug: "vonixx-sintra-fast", price: 13500, size: "500ml", featured: true, category: cat(5, "Acondicionadores e Interior", "interior"), description: "Limpiador rápido para interiores: tapizados, plásticos y consola. Acabado natural sin brillo grasoso.", usage: "Pulverizar sobre microfibra, frotar y retirar con trapo seco." },
  { id: 18, name: "Sintra", slug: "vonixx-sintra", price: 14800, size: "500ml", category: cat(5, "Acondicionadores e Interior", "interior"), description: "Limpiador interior concentrado para cuero, tela y plástico. Remueve suciedad embebida.", usage: "Diluir 1:5 a 1:10, aplicar con cepillo suave, frotar y retirar con microfibra." },
  { id: 19, name: "Blend Interior", slug: "vonixx-blend-interior", price: 11800, size: "500ml", category: cat(5, "Acondicionadores e Interior", "interior"), description: "Acondicionador para plásticos y vinílicos interiores. Protección UV con acabado mate.", usage: "Aplicar con microfibra sobre plástico limpio y buffear excedentes." },
  { id: 20, name: "V-Light", slug: "vonixx-v-light", price: 14200, size: "500ml", category: cat(6, "Llantas y Exterior", "exterior"), description: "Limpiador alcalino para llantas y exterior. Remueve grasa de freno y suciedad pesada.", usage: "Pulverizar, esperar 2 min, frotar con cepillo y enjuagar. Usar guantes." },
  { id: 21, name: "Desengrasante Multipropósito", slug: "vonixx-desengrasante", price: 10900, size: "1L", category: cat(6, "Llantas y Exterior", "exterior"), description: "Desengrasante concentrado para motor, guardabarros y zonas grasosas.", usage: "Diluir 1:5 a 1:10, pulverizar, frotar con cepillo y enjuagar." },
  { id: 22, name: "V-Protect", slug: "vonixx-v-protect", price: 19900, size: "500ml", category: cat(4, "Selladores y Protección", "selladores"), description: "Protector hidrófugo para vidrios y carrocería de mantenimiento.", usage: "Pulverizar sobre superficie limpia y seca, repartir con microfibra." },
  { id: 23, name: "V-Compound", slug: "vonixx-v-compound", price: 17200, originalPrice: 20500, size: "500ml", category: cat(2, "Pulimentos", "pulimentos"), description: "Compuesto de pulido para terminación rápida. Corte eficiente con acabado listo para proteger.", usage: "Aplicar en pad de pulido, 1200 RPM, pasadas sobrepuestas." },
  { id: 24, name: "V-Nano Pro", slug: "vonixx-v-nano-pro", price: 35800, size: "250ml", featured: true, category: cat(4, "Selladores y Protección", "selladores"), description: "Recubrimiento nano cerámico profesional. La protección más duradera de la línea.", usage: "Aplicar con aplicador suede, capa fina, curado 24h sin agua." },
  { id: 25, name: "Kit Lavado Completo", slug: "vonixx-kit-lavado-completo", price: 49500, originalPrice: 62000, size: "Kit 4 piezas", featured: true, category: cat(1, "Lavado y Descontaminación", "lavado"), description: "Kit mantenimiento completo: Iron + Blend + V-Flash + Claybar. Todo para un lavado detailing paso a paso.", usage: "Secuencia: Iron, Claybar, Blend, V-Flash." },
];

export const productsFallback: Product[] = base.map((p) => ({
  ...p,
  brand: "Vonixx",
  originalPrice: p.originalPrice ?? null,
  featured: p.featured ?? false,
  imageUrl: "",
  variants: [
    {
      id: (p.size ?? "unico").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      size: p.size ?? "",
      price: p.price,
      originalPrice: p.originalPrice ?? null,
    },
  ],
}));
