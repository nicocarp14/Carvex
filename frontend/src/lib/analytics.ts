// Helpers tipados para GA4 / Meta Pixel sin npm extra.
// Si no hay ID configurado, es noop (no rompe nada).
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const GA_ID = (import.meta.env.VITE_GA_ID as string | undefined) ?? "";
const PIXEL_ID = (import.meta.env.VITE_PIXEL_ID as string | undefined) ?? "";

export function loadAnalytics() {
  if (typeof window === "undefined") return;
  // GA4
  if (GA_ID) {
    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s1);
    const s2 = document.createElement("script");
    s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`;
    document.head.appendChild(s2);
  }
  // Meta Pixel (sin noscript: es SPA)
  if (PIXEL_ID) {
    const s = document.createElement("script");
    s.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`;
    document.head.appendChild(s);
  }
}

export function trackAddToCart(opts: { productSlug: string; price: number; quantity: number }) {
  const { productSlug, price, quantity } = opts;
  window.gtag?.("event", "add_to_cart", {
    value: price * quantity,
    currency: "ARS",
    items: [{ item_id: productSlug, quantity }],
  });
  window.fbq?.("track", "AddToCart", { value: price * quantity, currency: "ARS" });
}

export function trackBeginCheckout(value: number, currency = "ARS") {
  window.gtag?.("event", "begin_checkout", { value, currency });
  window.fbq?.("track", "InitiateCheckout", { value, currency });
}

export function trackPurchase(value: number, orderId: number, currency = "ARS") {
  window.gtag?.("event", "purchase", { transaction_id: String(orderId), value, currency });
  window.fbq?.("track", "Purchase", { value, currency });
}
