// Los archivos de public/ se sirven desde la raíz del sitio.
// banner.jpg en frontend/public/banner.jpg → "/banner.jpg"
const DEFAULT_IMAGE = "/banner.jpg";

export default function HeroBanner({ image = DEFAULT_IMAGE }: { image?: string }) {
  return (
    <section className="relative overflow-hidden bg-carvex-900">
      <img
        src={image}
        alt="Banner Carvex — productos Vonixx para detailing"
        className="block h-auto w-full"
        loading="eager"
      />
    </section>
  );
}
