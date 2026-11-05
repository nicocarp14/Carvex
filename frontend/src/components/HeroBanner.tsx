// Banner genérico estático (placeholder hasta que subas tu foto propia).
// Cuando subas tu banner a frontend/public/banner.jpg, cambiá el src acá:
// const DEFAULT_IMAGE = "/banner.jpg";
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop";

export default function HeroBanner({ image = DEFAULT_IMAGE }: { image?: string }) {
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-carvex-900">
      <img
        src={image}
        alt="Auto con acabado detailing profesional"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
    </section>
  );
}
