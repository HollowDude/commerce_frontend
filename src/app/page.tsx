"use client"

import {
  Box,
  Container,
  Grid,
  Card,
  CardBody,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  useToast,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import Header from "@/components/Header"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchIcon } from "@chakra-ui/icons"
import { BACKEND } from "@/types/url"

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  imageUrl: string
  categoria: string
  publicado_por: string
}

export default function HomePage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, token, isVendedor } = useAuth()
  const toast = useToast()
  const [busqueda, setBusqueda] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()


  useEffect(() => {
    fetchProductos()
  }, [])

  useEffect(() => {
    const search = searchParams.get("busqueda") || ""
    const categoria = searchParams.get("categoria") || ""
    setBusqueda(search)
    setCategoriaFiltro(categoria)
  }, [searchParams])

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${BACKEND}producto/`)
      if (response.ok) {
        const data = await response.json()
        setProductos(data)
      }
    } catch (error) {
      console.error("Error al cargar productos:", error)
    } finally {
      setLoading(false)
    }
  }

  const agregarAlCarrito = async (productoId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Debes iniciar sesión",
        description: "Inicia sesión para agregar productos al carrito",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      const response = await fetch(`${BACKEND}item_carrito/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product: productoId,
          cantidad: 1,
        }),
      })

      if (response.ok) {
        toast({
          title: "Producto agregado",
          description: "El producto se agregó al carrito",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleBusqueda = (nuevaBusqueda: string, nuevaCategoria: string) => {
    const params = new URLSearchParams()
    if (nuevaBusqueda) params.set("busqueda", nuevaBusqueda)
    if (nuevaCategoria) params.set("categoria", nuevaCategoria)

    const queryString = params.toString()
    router.push(queryString ? `/?${queryString}` : "/")
  }

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = !categoriaFiltro || producto.categoria === categoriaFiltro
    return coincideBusqueda && coincideCategoria
  })

  return (
    <Box>
      <Header />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Text fontSize="3xl" fontWeight="bold" mb={2}>
              Productos Disponibles
            </Text>
            <Text color="gray.600">Descubre los mejores productos de nuestros vendedores</Text>
          </Box>

        <HStack spacing={4} width="100%">
            <InputGroup flex={2}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value)
                  handleBusqueda(e.target.value, categoriaFiltro)
                }}
              />
            </InputGroup>
            <Select
              flex={1}
              placeholder="Todas las categorías"
              value={categoriaFiltro}
              onChange={(e) => {
                setCategoriaFiltro(e.target.value)
                handleBusqueda(busqueda, e.target.value)
              }}
            >
              <option value="Comida">Comida</option>
              <option value="Hogar">Hogar</option>
              <option value="Electronicos">Electrónicos</option>
              <option value="Herramientas">Herramientas</option>
            </Select>
          </HStack>

          {loading ? (
            <Text>Cargando productos...</Text>
          ) : (
            <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
              {productosFiltrados.map((producto) => (
                <Card key={producto.id} maxW="sm">
                  <CardBody>
                    <Image
                      src={producto.imageUrl || "/placeholder.svg?height=200&width=300"}
                      alt={producto.nombre}
                      borderRadius="lg"
                      height="200px"
                      width="100%"
                      objectFit="cover"
                    />
                    <VStack align="start" mt={4} spacing={3}>
                      <Badge colorScheme="blue">{producto.categoria}</Badge>
                      <Text fontSize="xl" fontWeight="semibold">
                        {producto.nombre}
                      </Text>
                      <Text color="gray.600" noOfLines={2}>
                        {producto.descripcion}
                      </Text>
                      <HStack justify="space-between" width="100%">
                        <Text fontSize="2xl" fontWeight="bold" color="green.500">
                          ${producto.precio}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Stock: {producto.stock}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        Vendido por: {producto.publicado_por}
                      </Text>
                      {!isVendedor && producto.stock > 0 && (
                        <Button colorScheme="blue" width="100%" onClick={() => agregarAlCarrito(producto.id)}>
                          Agregar al Carrito
                        </Button>
                      )}
                      {producto.stock === 0 && (
                        <Button width="100%" isDisabled>
                          Sin Stock
                        </Button>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </Grid>
          )}
        </VStack>
      </Container>
    </Box>
  )
}
