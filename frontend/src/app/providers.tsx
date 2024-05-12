"use client"

import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from "styled-components";
import theme from "../style/theme";
import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return(
    <ChakraProvider>
        <ThemeProvider theme={theme}>
            <AuthProvider>
              {children}
            </AuthProvider>
        </ThemeProvider>
    </ChakraProvider>
  )
}