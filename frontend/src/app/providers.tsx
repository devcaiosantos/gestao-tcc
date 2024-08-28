"use client"

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ThemeProvider } from "styled-components";
import theme from "../style/theme";
import { AuthProvider } from '@/contexts/AuthContext';


const theme2 = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false
  }
})

export function Providers({ children }: { children: React.ReactNode }) {
  return(
    <ThemeProvider theme={theme}>
      <ChakraProvider
        theme={theme2}
      >
              <AuthProvider>
                {children}
              </AuthProvider>
      </ChakraProvider>
    </ThemeProvider>
  )
}