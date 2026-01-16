"use client"

import { useEffect, useState } from "react"
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
import { ShoppingCart, User, LogOut, History, Phone, Menu, Home, Utensils, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { AuthDialog } from "./auth-dialog"

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { cart } = useCart()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:dark:bg-gray-900/80">
        <div className="container mx-auto flex min-h-[64px] items-center justify-between gap-2 px-3 sm:px-4 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center space-x-2 sm:space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 sm:h-12 sm:w-12">
              <Utensils className="h-5 w-5 text-white sm:h-7 sm:w-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900 dark:text-white sm:text-xl">FoodOrder</span>
              <span className="hidden text-xs text-gray-600 dark:text-gray-400 sm:block">24/7 Delivery</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-gray-700 transition-colors hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400">
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

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Phone Number - Desktop */}
            <a href="tel:0947118058" className="hidden items-center gap-2 text-sm text-gray-700 dark:text-gray-300 md:flex">
              <Phone className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="font-medium">094 711 80 58</span>
            </a>

            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 sm:h-10 sm:w-10"
                aria-label="View cart"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {mounted && cart.totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-semibold text-white dark:bg-orange-500 sm:h-5 sm:w-5 sm:text-xs">
                    {cart.totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart Total - Desktop */}
            {mounted && cart.totalItems > 0 && (
              <div className="hidden text-sm font-semibold text-gray-900 dark:text-white md:block">
                ${Number(cart.finalTotal).toFixed(2)}
              </div>
            )}

            {/* User Menu */}
            {mounted && isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10"
                    aria-label="User menu"
                  >
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
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
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      My Profile
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
                className="h-9 bg-orange-600 px-3 text-sm text-white hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 sm:h-10 sm:px-4"
              >
                Login
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:hidden sm:h-10 sm:w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 md:hidden">
            <nav className="container mx-auto flex flex-col gap-1 px-3 py-4 sm:px-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-orange-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-orange-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                href="/categories"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-orange-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-orange-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Menu
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-orange-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-orange-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contacts"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-orange-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-orange-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacts
              </Link>
              {/* Phone Number - Mobile */}
              <a href="tel:0947118058" className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                <Phone className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="font-medium">094 711 80 58</span>
              </a>
              {/* Cart Total - Mobile */}
              {cart.totalItems > 0 && (
                <div className="mt-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white">
                  Cart Total: ${Number(cart.finalTotal).toFixed(2)}
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  )
}
