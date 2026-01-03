"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingCart, User, LogOut, History, Phone, Menu, Home, Utensils } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { AuthDialog } from "./auth-dialog"

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { cart } = useCart()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:dark:bg-gray-900/80">
        <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4">
          <Link href="/" className="flex shrink-0 items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <Utensils className="h-7 w-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 dark:text-white">FoodOrder</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">24/7 Delivery</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-gray-700 transition-colors hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400">
              <Home className="mr-1 inline h-4 w-4" />
              Home
            </Link>
            <Link href="/categories" className="text-sm font-medium text-gray-700 transition-colors hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400">
              Menu
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 transition-colors hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400">
              About Us
            </Link>
            <Link href="/contacts" className="text-sm font-medium text-gray-700 transition-colors hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400">
              Contacts
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            {/* Phone Number */}
            <div className="hidden items-center gap-2 text-sm text-gray-700 dark:text-gray-300 md:flex">
              <Phone className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="font-medium">094 711 80 58</span>
            </div>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative h-10 w-10">
                <ShoppingCart className="h-5 w-5" />
                {cart.totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-xs font-semibold text-white dark:bg-orange-500">
                    {cart.totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart Total */}
            {cart.totalItems > 0 && (
              <div className="hidden text-sm font-semibold text-gray-900 dark:text-white md:block">
                ${Number(cart.finalTotal).toFixed(2)}
              </div>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.firstName || user?.phone}</p>
                      {user?.email && <p className="text-xs leading-none text-muted-foreground">{user.email}</p>}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="w-full cursor-pointer">
                      <History className="mr-2 h-4 w-4" />
                      Order History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => setAuthDialogOpen(true)}
                className="bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  )
}
