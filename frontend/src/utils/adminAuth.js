// src/utils/adminAuth.js
export function getAdminToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("adminToken");
}

export function setAdminToken(token) {
    if (typeof window === "undefined") return;
    localStorage.setItem("adminToken", token);
}

export function clearAdminToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("adminToken");
}
