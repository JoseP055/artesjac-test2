// src/utils/resolveImgUrl.js
export function resolveImgUrl(src) {
    if (!src) return "";
    if (/^https?:\/\//i.test(src)) return src; // ya es absoluta
    const ASSETS = process.env.REACT_APP_ASSETS_URL || "http://localhost:4000";
    return `${ASSETS}${src.startsWith("/") ? src : `/${src}`}`;
}
