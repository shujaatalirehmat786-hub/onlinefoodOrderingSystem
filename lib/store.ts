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

export async function getStoreFromSubdomain(): Promise<Store | null> {
  try {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname

      // Extract subdomain - for v0 preview, just use "flavors" as default
      const subdomain = "flavors"

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
