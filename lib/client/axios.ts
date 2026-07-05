// Shared axios instance — sends the httpOnly auth cookie, redirects to /login on 401

import axios from "axios";

const axiosClient = axios.create({
  // No baseURL needed — all API routes are relative (/api/...)
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send the httpOnly "token" cookie on every request
});

// ─── Response interceptor ─────────────────────────────────────────────────────
// Runs after every response — handles 401 globally

axiosClient.interceptors.response.use(
  // Success: just return the response as-is
  (response) => response,

  // Error: check if it's a 401 and redirect to login
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      axiosClient.post("/api/auth/logout").catch(() => {}); // clear the httpOnly cookie
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
