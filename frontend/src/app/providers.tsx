"use client"

import { chakra, ChakraProvider, extendTheme } from '@chakra-ui/react'
import { AuthProvider } from '@/contexts/AuthContext';


const chakraTheme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  }
})

export function Providers({ children }: { children: React.ReactNode }) {
  return(
      <ChakraProvider
        theme={chakraTheme}
      >
              <AuthProvider>
                {children}
              </AuthProvider>
      </ChakraProvider>
  )
}