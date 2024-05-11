"use client"

import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from "styled-components";
import theme from "../style/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return(
    <ChakraProvider>
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    </ChakraProvider>
  )
}