// src/utils/resolveImgUrl.js
export function resolveImgUrl(src) {
    if (!src) return "";

    // 1) URLs absolutas
    if (/^https?:\/\//i.test(src)) {
        const UPG = process.env.REACT_APP_UPGRADE_HTTP_IMAGES === "1";
        // Si es http y activaste "upgrade", intenta https
        if (UPG && /^http:\/\//i.test(src)) {
            src = src.replace(/^http:\/\//i, "https://");
        }

        // 2) ¿Querés proxy para todo lo externo?
        const USE_PROXY = process.env.REACT_APP_PROXY_IMAGES === "1";
        const API = process.env.REACT_APP_API_URL || "http://localhost:4000";
        return USE_PROXY ? `${API}/api/img-proxy?url=${encodeURIComponent(src)}` : src;
    }

    // 3) Rutas relativas (tuyas)
    const BASE = process.env.REACT_APP_ASSETS_URL || "http://localhost:4000";
    return `${BASE}${src.startsWith("/") ? src : `/${src}`}`;
}
