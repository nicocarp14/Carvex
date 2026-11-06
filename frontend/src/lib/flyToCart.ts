// Vuela un dot desde el botón clickeado hasta el carrito (fly-to-cart)
// WAAPI sin librerías. Respeta prefers-reduced-motion.
export function flyToCart(fromEl: HTMLElement | null) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = document.querySelector<HTMLElement>("[data-cart-anchor]");
  if (!fromEl || !target) return;

  const from = fromEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const size = 14;

  const dot = document.createElement("div");
  dot.setAttribute("aria-hidden", "true");
  dot.style.cssText = [
    `position:fixed`,
    `left:${from.left + from.width / 2 - size / 2}px`,
    `top:${from.top + from.height / 2 - size / 2}px`,
    `width:${size}px`,
    `height:${size}px`,
    `border-radius:9999px`,
    `background:#0a1628`,
    `z-index:9999`,
    `pointer-events:none`,
    `box-shadow:0 2px 8px rgba(0,0,0,.35)`,
  ].join(";");
  document.body.appendChild(dot);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);

  const anim = dot.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: "1" },
      { transform: `translate(${dx}px, ${dy}px) scale(.5)`, opacity: ".9" },
    ],
    { duration: 550, easing: "cubic-bezier(.22,.61,.36,1)" }
  );
  anim.onfinish = () => dot.remove();
  anim.oncancel = () => dot.remove();
}
