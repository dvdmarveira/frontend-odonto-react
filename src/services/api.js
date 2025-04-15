const API_URL = "http://localhost:5000/api";

export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  token = null
) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Erro inesperado na requisição");
    }

    return data;
  } catch (error) {
    console.error("[API Request Error]:", error.message);
    throw error;
  }
}
