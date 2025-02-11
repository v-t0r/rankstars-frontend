import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient()

// export const backendUrl = "http://localhost:3000"
export const backendUrl = import.meta.env.VITE_API_URL
export const imageBackendUrl = backendUrl

