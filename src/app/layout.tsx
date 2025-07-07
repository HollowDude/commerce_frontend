"use client"

import type React from "react"

import { ChakraProvider } from "@chakra-ui/react"
import { AuthProvider } from "@/contexts/AuthContext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <ChakraProvider>
          <AuthProvider>{children}</AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  )
}
