"use client";
import { useEffect } from 'react';
import StyledComponentsRegistry from '../style/registry';
import { Providers } from './providers';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    localStorage.setItem('chakra-ui-color-mode', 'dark');
  }, []);//Gambiarra pra resolver o problema do dark mode no chakra ui https://github.com/chakra-ui/chakra-ui/discussions/5051

  return (
    <html lang="en">
      <body style={{
        fontFamily: "Inter, sans-serif",
      }}>
       <StyledComponentsRegistry>
          <Providers>
            {children}
          </Providers>
       </StyledComponentsRegistry>
      </body>
    </html>
  );
}
