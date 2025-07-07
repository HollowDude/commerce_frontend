"use client"

import {
  Box,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useDisclosure,
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import Header from "@/components/Header"
import { useAuth } from "@/contexts/AuthContext"
import ProductoModal from "@/components/ProductModal"
import { BACKEND } from "@/types/url"

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria: string
  created_at: string
}

interface Estadisticas {
  totalProductos: number
  totalVentas: number
  ingresosTotales: number
  productosAgotados: number
}

export default function VendedorPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    totalProductos: 0,
    totalVentas: 0,
    ingresosTotales: 0,
    productosAgotados: 0,
  })
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null)
  const { token, isVendedor } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (isVendedor) {
      fetchMisProductos()
      fetchEstadisticas()
    }
  }, [isVendedor, token])

  const fetchMisProductos = async () => {
    try {
      const response = await fetch(`${BACKEND}producto/?mis_productos=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProductos(data)
      }
    } catch (error) {
      console.error("Error al cargar productos:", error)
    }
  }

  const fetchEstadisticas = async () => {
    try {
      console.log(BACKEND)
      const response = await fetch(`${BACKEND}producto/stats/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setEstadisticas(data)
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error)
    }
  }

  const handleNuevoProducto = () => {
    setProductoEditando(null)
    onOpen()
  }

  const handleEditarProducto = (producto: Producto) => {
    setProductoEditando(producto)
    onOpen()
  }

  const handleEliminarProducto = async (id: number) => {
    try {
      const response = await fetch(`${BACKEND}producto/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        fetchMisProductos()
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error)
    }
  }

  if (!isVendedor) {
    return (
      <Box>
        <Header />
        <Container maxW="container.md" py={12}>
          <Text textAlign="center" fontSize="xl">
            No tienes permisos para acceder a esta página
          </Text>
        </Container>
      </Box>
    )
  }

  return (
    <Box>
      <Header />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading>Panel de Vendedor</Heading>

          <Tabs>
            <TabList>
              <Tab>Estadísticas</Tab>
              <Tab>Mis Productos</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Heading size="md">Resumen de tu tienda</Heading>
                  <HStack spacing={4}>
                    <Card flex={1}>
                      <CardBody>
                        <Stat>
                          <StatLabel>Total Productos</StatLabel>
                          <StatNumber>{estadisticas.totalProductos}</StatNumber>
                          <StatHelpText>Productos publicados</StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                    <Card flex={1}>
                      <CardBody>
                        <Stat>
                          <StatLabel>Total Ventas</StatLabel>
                          <StatNumber>{estadisticas.totalVentas}</StatNumber>
                          <StatHelpText>Órdenes completadas</StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                    <Card flex={1}>
                      <CardBody>
                        <Stat>
                          <StatLabel>Ingresos Totales</StatLabel>
                          <StatNumber>${estadisticas.ingresosTotales}</StatNumber>
                          <StatHelpText>Ganancias acumuladas</StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                    <Card flex={1}>
                      <CardBody>
                        <Stat>
                          <StatLabel>Sin Stock</StatLabel>
                          <StatNumber color="red.500">{estadisticas.productosAgotados}</StatNumber>
                          <StatHelpText>Productos agotados</StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                  </HStack>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="md">Mis Productos</Heading>
                    <Button colorScheme="blue" onClick={handleNuevoProducto}>
                      Nuevo Producto
                    </Button>
                  </HStack>

                  <Card>
                    <CardBody>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Nombre</Th>
                            <Th>Categoría</Th>
                            <Th>Precio</Th>
                            <Th>Stock</Th>
                            <Th>Estado</Th>
                            <Th>Acciones</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {productos.map((producto) => (
                            <Tr key={producto.id}>
                              <Td>{producto.nombre}</Td>
                              <Td>{producto.categoria}</Td>
                              <Td>${producto.precio}</Td>
                              <Td>{producto.stock}</Td>
                              <Td>
                                <Badge colorScheme={producto.stock > 0 ? "green" : "red"}>
                                  {producto.stock > 0 ? "Disponible" : "Agotado"}
                                </Badge>
                              </Td>
                              <Td>
                                <HStack spacing={2}>
                                  <Button size="sm" onClick={() => handleEditarProducto(producto)}>
                                    Editar
                                  </Button>
                                  <Button
                                    size="sm"
                                    colorScheme="red"
                                    onClick={() => handleEliminarProducto(producto.id)}
                                  >
                                    Eliminar
                                  </Button>
                                </HStack>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>

      <ProductoModal
        isOpen={isOpen}
        onClose={onClose}
        producto={productoEditando}
        onSuccess={() => {
          fetchMisProductos()
          onClose()
        }}
      />
    </Box>
  )
}
