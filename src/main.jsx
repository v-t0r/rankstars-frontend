import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Provider as ContextProvider } from "react-redux"
import store from './store/index.js'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './services/queryClient.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <App/>
      </QueryClientProvider>
    </ContextProvider>
  </StrictMode>,
)
