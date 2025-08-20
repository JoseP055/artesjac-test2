// src/utils/resolveImgUrl.js
export function resolveImgUrl(src) {
    if (!src) return "";
    // Si ya es absoluta (http/https), se devuelve tal cual
    if (/^https?:\/\//i.test(src)) return src;

    // Base (backend) para assets
    const BASE = process.env.REACT_APP_ASSETS_URL || "http://localhost:4000";
    // Acepta "uploads/..." o "/uploads/..."
    return `${BASE}${src.startsWith("/") ? src : `/${src}`}`;
}
