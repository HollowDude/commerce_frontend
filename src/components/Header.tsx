"use client"

import {
  Box,
  Flex,
  HStack,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react"
import { ChevronDownIcon } from "@chakra-ui/icons"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"

export default function Header() {
  const { user, isAuthenticated, logout, isVendedor } = useAuth()
  const bg = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  useEffect(()=>{
    console.log(isAuthenticated)
  })

  return (
    <Box bg={bg} borderBottom="1px" borderColor={borderColor} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Link href="/">
          <Text fontSize="xl" fontWeight="bold" color="blue.500">
            Mi Tienda
          </Text>
        </Link>

        <HStack spacing={4}>
          <Link href="/">
            <Button variant="ghost">Inicio</Button>
          </Link>

          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button colorScheme="blue">Registrarse</Button>
              </Link>
            </>
          ) : (
            <>
              {!isVendedor && (
                <Link href="/carrito">
                  <Button variant="ghost" position="relative">
                    Carrito
                    <Badge colorScheme="red" borderRadius="full" position="absolute" top="-1" right="-1" fontSize="xs">
                      0
                    </Badge>
                  </Button>
                </Link>
              )}

              {isVendedor && (
                <Link href="/vendedor">
                  <Button variant="ghost">Panel Vendedor</Button>
                </Link>
              )}

              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost">
                  <HStack>
                    <Avatar size="sm" name={user?.username} />
                    <Text>{user?.username}</Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
                </MenuList>
              </Menu>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  )
}
