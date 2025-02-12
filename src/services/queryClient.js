import { QueryClient } from "@tanstack/react-query"

//exports the only queryClient used in the app
//it's important use the same queryClient in the entire app so we can invalidate queries from other components.
export const queryClient = new QueryClient()