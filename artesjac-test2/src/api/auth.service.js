import { api } from "../api";

export const AuthAPI = {
    login: (email, password) =>
        api.post("/auth/login", { email, password }).then(r => r.data), // { ok, token, user }

    register: (payload) =>
        api.post("/auth/register", payload).then(r => r.data),

    me: () =>
        api.get("/auth/me").then(r => r.data),
};
