"use client"

import type React from "react"

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  VStack,
  useToast,
  Select,
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { BACKEND } from "@/types/url"

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria: string
  image_url?: string
}

interface ProductoModalProps {
  isOpen: boolean
  onClose: () => void
  producto?: Producto | null
  onSuccess: () => void
}

export default function ProductoModal({ isOpen, onClose, producto, onSuccess }: ProductoModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoria: "",
    image_url: "",
  })
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const toast = useToast()

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        categoria: producto.categoria,
        image_url: producto.image_url || "",
      })
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        categoria: "",
        image_url: "",
      })
    }
  }, [producto])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = producto
        ? `${BACKEND}producto/${producto.id}/`
        : `${BACKEND}producto/`

      const method = producto ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: producto ? "Producto actualizado" : "Producto creado",
          description: `El producto se ${producto ? "actualizó" : "creó"} correctamente`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        onSuccess()
      } else {
        throw new Error("Error en la respuesta del servidor")
      }
    } catch (error) {
      console.error("Error al guardar producto:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el producto",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{producto ? "Editar Producto" : "Nuevo Producto"}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nombre</FormLabel>
                <Input
                  value={formData.nombre}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Nombre del producto"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Descripción</FormLabel>
                <Textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Descripción del producto"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Precio</FormLabel>
                <NumberInput
                  value={formData.precio}
                  onChange={(_, value) => setFormData((prev) => ({ ...prev, precio: value || 0 }))}
                  min={0}
                  precision={2}
                >
                  <NumberInputField placeholder="0.00" />
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Stock</FormLabel>
                <NumberInput
                  value={formData.stock}
                  onChange={(_, value) => setFormData((prev) => ({ ...prev, stock: value || 0 }))}
                  min={0}
                >
                  <NumberInputField placeholder="0" />
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Categoría</FormLabel>
                <Select
                  value={formData.categoria}
                  onChange={(e) => setFormData((prev) => ({ ...prev, categoria: e.target.value }))}
                  placeholder="Selecciona una categoría"
                >
                  <option value="Comida">Comida</option>
                  <option value="Hogar">Hogar</option>
                  <option value="Electronicos">Electrónicos</option>
                  <option value="Herramientas">Herramientas</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>URL de imagen</FormLabel>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" type="submit" isLoading={loading} loadingText="Guardando...">
              {producto ? "Actualizar" : "Crear"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
