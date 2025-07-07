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
  Select,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import { useAuth } from "@/contexts/AuthContext"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    metodos: "Transfermovil",
    rol: 1,
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()
  const toast = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rol" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setLoading(true)

    const success = await register(formData)

    if (success) {
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      router.push("/login")
    } else {
      toast({
        title: "Error",
        description: "No se pudo crear la cuenta",
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
              Crear Cuenta
            </Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nombre de usuario</FormLabel>
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Tu nombre de usuario"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Contraseña</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tu contraseña"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Confirmar contraseña</FormLabel>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirma tu contraseña"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Método de pago preferido</FormLabel>
                  <Select name="metodos" value={formData.metodos} onChange={handleChange}>
                    <option value="Transfermovil">Transfermóvil</option>
                    <option value="Enzona">Enzona</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Tipo de cuenta</FormLabel>
                  <Select name="rol" value={formData.rol} onChange={handleChange}>
                    <option value={1}>Cliente</option>
                    <option value={2}>Vendedor</option>
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  isLoading={loading}
                  loadingText="Creando cuenta..."
                >
                  Crear Cuenta
                </Button>

                <Text textAlign="center">
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/login">
                    <Text as="span" color="blue.500" textDecoration="underline">
                      Inicia sesión aquí
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
