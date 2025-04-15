import { apiRequest } from "./api";

export async function login(email, password) {
  const data = await apiRequest("/users/login", "POST", { email, password });
  localStorage.setItem("token", data.token);
  return data;
}
