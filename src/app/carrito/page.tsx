"use client"

import {
  Box,
  Container,
  VStack,
  HStack,
  Card,
  CardBody,
  Text,
  Button,
  Image,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  useToast,
  Heading,
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import Header from "@/components/Header"
import { useAuth } from "@/contexts/AuthContext"
import { BACKEND } from "@/types/url"

interface ItemCarrito {
  id: number
  producto: {
    id: number
    nombre: string
    precio: number
    imageUrl: string
  }
  cantidad: number
}

export default function CarritoPage() {
  const [items, setItems] = useState<ItemCarrito[]>([])
  const [loading, setLoading] = useState(true)
  const { token, isAuthenticated } = useAuth()
  const toast = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      fetchCarrito()
    }
  }, [isAuthenticated, token])

  const fetchCarrito = async () => {
    try {
      const response = await fetch(`${BACKEND}carrito/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error("Error al cargar carrito:", error)
    } finally {
      setLoading(false)
    }
  }

  const actualizarCantidad = async (itemId: number, nuevaCantidad: number) => {
    try {
      const response = await fetch(`${BACKEND}item_carrito/${itemId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cantidad: nuevaCantidad }),
      })

      if (response.ok) {
        fetchCarrito()
      }
    } catch (error) {
      console.error("Error al actualizar cantidad:", error)
    }
  }

  const eliminarItem = async (itemId: number) => {
    try {
      const response = await fetch(`${BACKEND}item_carrito/${itemId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchCarrito()
        toast({
          title: "Producto eliminado",
          description: "El producto se eliminó del carrito",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error("Error al eliminar item:", error)
    }
  }

  const total = items.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0)

  const procesarOrden = async () => {
    try {
      const response = await fetch(`${BACKEND}orden/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ total }),
      })

      if (response.ok) {
        toast({
          title: "Orden procesada",
          description: "Tu orden ha sido procesada exitosamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        fetchCarrito() // Para hacer clean al carrito
      }
    } catch (error) {
      console.error("Error al procesar orden:", error)
      toast({
        title: "Error",
        description: "No se pudo procesar la orden",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  if (!isAuthenticated) {
    return (
      <Box>
        <Header />
        <Container maxW="container.md" py={12}>
          <Text textAlign="center" fontSize="xl">
            Debes iniciar sesión para ver tu carrito
          </Text>
        </Container>
      </Box>
    )
  }

  return (
    <Box>
      <Header />
      <Container maxW="container.lg" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading>Mi Carrito</Heading>

          {loading ? (
            <Text>Cargando carrito...</Text>
          ) : items.length === 0 ? (
            <Text textAlign="center" fontSize="lg" color="gray.500">
              Tu carrito está vacío
            </Text>
          ) : (
            <>
              <VStack spacing={4} align="stretch">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardBody>
                      <HStack spacing={4}>
                        <Image
                          src={item.producto.imageUrl || "/placeholder.svg?height=80&width=80"}
                          alt={item.producto.nombre}
                          boxSize="80px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        <VStack align="start" flex={1}>
                          <Text fontWeight="semibold">{item.producto.nombre}</Text>
                          <Text color="green.500" fontWeight="bold">
                            ${item.producto.precio}
                          </Text>
                        </VStack>
                        <HStack spacing={4}>
                          <NumberInput
                            value={item.cantidad}
                            onChange={(_, value) => actualizarCantidad(item.id, value || 1)}
                            min={1}
                            max={99}
                            width="100px"
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <Text fontWeight="bold">${(item.producto.precio * item.cantidad).toFixed(2)}</Text>
                          <Button colorScheme="red" size="sm" onClick={() => eliminarItem(item.id)}>
                            Eliminar
                          </Button>
                        </HStack>
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>

              <Divider />

              <Card>
                <CardBody>
                  <VStack spacing={4}>
                    <HStack justify="space-between" width="100%">
                      <Text fontSize="xl" fontWeight="bold">
                        Total:
                      </Text>
                      <Text fontSize="xl" fontWeight="bold" color="green.500">
                        ${total.toFixed(2)}
                      </Text>
                    </HStack>
                    <Button colorScheme="blue" size="lg" width="100%" onClick={procesarOrden}>
                      Procesar Orden
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  )
}
