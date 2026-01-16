import { api } from "./api"

export interface Store {
  _id: string
  name: string
  subdomain: string
  address?: string
  phone?: string
  logo?: string
  description?: string
}

const MOCK_STORE: Store = {
  _id: "68c328b7a277614f117d8226",
  name: "Flavors Restaurant",
  subdomain: "flavors",
  address: "123 Main Street, City",
  phone: "+1234567890",
  description: "Delicious food delivered to your door",
}

export function getStoreSlug(): string {
  if (typeof window === "undefined") {
    return "savera"
  }

  const hostname = window.location.hostname
  if (!hostname || hostname === "localhost" || /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    return "savera"
  }

  const parts = hostname.split(".")
  const subdomain = parts[0]
  return subdomain || "savera"
}

export async function getStoreFromSubdomain(): Promise<Store | null> {
  try {
    if (typeof window !== "undefined") {
      const subdomain = getStoreSlug()

      try {
        const response = await api.store.getBySubdomain(subdomain)
        const storeData = response.data || response
        return storeData
      } catch (apiError) {
        console.warn("[v0] Using mock store due to API error")
        return MOCK_STORE
      }
    }

    return MOCK_STORE
  } catch (error) {
    console.error("[v0] Error in getStoreFromSubdomain:", error)
    return MOCK_STORE
  }
}
