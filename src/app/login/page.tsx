"use client"

import type React from "react"

import {
  Box,
  Container,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const success = await login(email, password)

    if (success) {
      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      router.push("/")
    } else {
      toast({
        title: "Error",
        description: "Credenciales incorrectas",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }

    setLoading(false)
  }

  return (
    <Box>
      <Header />
      <Container maxW="md" py={12}>
        <Card>
          <CardHeader>
            <Heading size="lg" textAlign="center">
              Iniciar Sesión
            </Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu username"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Contraseña</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  isLoading={loading}
                  loadingText="Iniciando sesión..."
                >
                  Iniciar Sesión
                </Button>

                <Text textAlign="center">
                  ¿No tienes cuenta?{" "}
                  <Link href="/register">
                    <Text as="span" color="blue.500" textDecoration="underline">
                      Regístrate aquí
                    </Text>
                  </Link>
                </Text>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </Container>
    </Box>
  )
}
