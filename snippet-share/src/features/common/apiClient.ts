import type ApiResponse from "./apiResponse";
import AppStorage from "./storage";
import StorageKey from "./storageKey";

const logRequest = (endpoint: string, status: number) => {
  console.log(`[ApiClient] ${endpoint} - Status: ${status}`);
};
// TODO: add error handling, auth token management.
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AppStorage.get(StorageKey.AUTH_TOKEN) || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    logRequest(endpoint, response.status);
    return response.json();
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const isFormData = data instanceof FormData;
    console.log(data);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AppStorage.get(StorageKey.AUTH_TOKEN) || ""}`,
      },
      body: isFormData ? data : JSON.stringify(data),
    });

    // if (!response.ok) {
    //   throw new Error("Failed to post data");
    // }

    logRequest(endpoint, response.status);
    console.log("Raw response:", response);
    return response.json();
  }
}

const apiClient = new ApiClient("http://localhost:8080/api");

export default apiClient;
