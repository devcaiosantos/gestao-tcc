"use client";

import StyledComponentsRegistry from '../style/registry'
import GlobalStyle from "@/style/global";
import { Providers } from './providers';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{
        fontFamily: "Inter, sans-serif",
      }}>
       <StyledComponentsRegistry>
        <GlobalStyle />
          <Providers>
            {children}
          </Providers>
       </StyledComponentsRegistry>
      </body>
    </html>
  );
}
