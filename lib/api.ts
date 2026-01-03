const BASE_URL = "/api/proxy"

const USE_MOCK_MODE = false // Set to true for development without backend

export interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
}

// Helper function to get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as { error?: string }
      const errorMessage = typeof errorData.error === 'string' ? errorData.error : `API Error: ${response.statusText}`
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] API request failed:", error)
    throw error
  }
}

export const api = {
  // Auth endpoints
  auth: {
    login: (phone: string) =>
      apiRequest<{ token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone }),
      }),
  },

  // Profile endpoints
  profile: {
    get: () => apiRequest<any>("/profile"),
    update: (data: any) =>
      apiRequest<any>("/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // Store endpoints
  store: {
    getBySubdomain: (hostname: string) => apiRequest<any>(`/store/by-subdomain?hostname=${hostname}`),
  },

  // Department endpoints
  department: {
    list: (params: { storeId: string; page?: number; limit?: number }) => {
      const { storeId, page = 1, limit = 50 } = params
      return apiRequest<any>(`/department?storeId=${storeId}&page=${page}&limit=${limit}`)
    },
  },

  // Kitchen endpoints
  kitchen: {
    list: (params: { storeId: string; page?: number; limit?: number }) => {
      const { storeId, page = 1, limit = 50 } = params
      return apiRequest<any>(`/kitchen?storeId=${storeId}&page=${page}&limit=${limit}`)
    },
  },

  // Product endpoints
  product: {
    list: (params: {
      storeId: string
      page?: number
      limit?: number
      department?: string
      kitchen?: string
      order?: "asc" | "desc"
      search?: string
    }) => {
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
      return apiRequest<any>(`/product?${queryParams.toString()}`)
    },
    getById: (id: string) => apiRequest<any>(`/product/${id}`),
  },

  // Modifier endpoints
  modifier: {
    listGroups: (storeId: string, page = 1, limit = 10) =>
      apiRequest<any>(`/modifier-group?storeId=${storeId}&page=${page}&limit=${limit}`),
    listByGroup: (modifierGroupId: string, page = 1, limit = 10) =>
      apiRequest<any>(`/modifier?page=${page}&limit=${limit}&modifierGroupId=${modifierGroupId}`),
  },

  // Order endpoints
  order: {
    place: (orderData: any) =>
      apiRequest<any>("/order/place-order", {
        method: "POST",
        body: JSON.stringify(orderData),
      }),
    getMyOrders: (page = 1, limit = 50) => apiRequest<any>(`/order/my-orders?page=${page}&limit=${limit}`),
  },
}
