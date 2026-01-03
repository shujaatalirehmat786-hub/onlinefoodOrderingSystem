"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { api } from "@/lib/api"
import { getStoreFromSubdomain } from "@/lib/store"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Utensils, ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

const ITEMS_PER_PAGE = 12

export default function CategoriesPage() {
  const [departments, setDepartments] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [store, setStore] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    loadStore()
  }, [])

  useEffect(() => {
    if (store) {
      loadDepartments()
      loadAllProducts()
    }
  }, [store])

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  const loadStore = async () => {
    const storeData = await getStoreFromSubdomain()
    setStore(storeData)
  }

  const loadDepartments = async () => {
    try {
      const response = await api.department.list({ storeId: store._id, page: 1, limit: 100 })
      setDepartments(response.data || [])
    } catch (error) {
      console.error("Error loading departments:", error)
    }
  }

  const loadAllProducts = async () => {
    try {
      setLoading(true)
      // Load all products (increase limit to get all products)
      const response = await api.product.list({
        storeId: store._id,
        page: 1,
        limit: 1000, // Load more products to handle pagination
        order: "desc",
      })
      const products = response.data?.products || response.products || []
      setAllProducts(products)
      // Debug: Log first product to see department structure
      if (products.length > 0) {
        console.log("Sample product department structure:", {
          department: products[0].department,
          departmentId: products[0].departmentId,
          fullProduct: products[0]
        })
      }
    } catch (error) {
      console.error("Error loading products:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (departmentId: string) => {
    setSelectedCategory(departmentId === selectedCategory ? "" : departmentId)
    setCurrentPage(1) // Reset to first page when category changes
  }

  const handleAddToCart = (product: any) => {
    const TAX_RATE = 0.0832

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      modifiers: [],
      image: product.image,
      subTotal: Number(product.price),
      tax: Number(product.price) * TAX_RATE,
      discount: 0,
    }

    addToCart(cartItem)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Filter products based on selected category
  // Check multiple possible field names for department
  const filteredProducts = selectedCategory
    ? allProducts.filter((p) => {
        // Try different possible field names and formats
        // Product might have: p.department (string ID), p.department._id (object), or p.departmentId
        let productDeptId = null
        
        if (p.department) {
          if (typeof p.department === 'string') {
            productDeptId = p.department
          } else if (p.department._id) {
            productDeptId = p.department._id
          } else if (p.department.id) {
            productDeptId = p.department.id
          }
        } else if (p.departmentId) {
          productDeptId = p.departmentId
        }
        
        // Compare both as strings to handle type mismatches
        const match = productDeptId && String(productDeptId) === String(selectedCategory)
        
        // Debug logging for troubleshooting
        if (allProducts.indexOf(p) < 5 && selectedCategory) {
          console.log("Filtering product:", {
            productName: p.name,
            productDept: p.department,
            productDeptId: productDeptId,
            selectedCategory: selectedCategory,
            match: match
          })
        }
        
        return match
      })
    : allProducts // Show all products when "ALL" is selected

  // Get popular products (5-7 items) from all products
  const popularProducts = allProducts.slice(0, 7)

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Handle page navigation - scroll to products section instead of top
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to products section instead of top
    const productsSection = document.getElementById("products-section")
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section with Menu Text */}
        <section className="relative h-[400px] overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&h=1080&fit=crop)",
            }}
          >
            <div className="absolute inset-0 bg-black/60" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex h-full items-center justify-center">
            {/* Semi-transparent white circular outline with MENU text */}
            <div className="flex flex-col items-center">
              <div className="mb-8 flex items-center gap-6 text-sm font-semibold uppercase tracking-wider">
                <Link 
                  href="/" 
                  className="text-white transition-opacity hover:opacity-80"
                >
                  HOME
                </Link>
                <span className="text-orange-400">MENU</span>
              </div>
              <div className="relative">
                <div className="absolute inset-0 rounded-full border-4 border-white/30 blur-sm" />
                <div className="relative rounded-full border-4 border-white/50 p-8">
                  <h1 className="text-7xl font-bold text-white md:text-8xl lg:text-9xl">
                    MENU
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Buttons Section - Right after hero */}
        <section className="bg-white py-8 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {departments.length === 0 ? (
              <div className="py-12 text-center">
                <Utensils className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No categories found.</p>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3">
                {/* All Button */}
                <Button
                  onClick={() => {
                    setSelectedCategory("")
                    setCurrentPage(1)
                  }}
                  className={`rounded-full px-6 py-3 text-sm font-semibold uppercase transition-all ${
                    selectedCategory === ""
                      ? "bg-orange-500 text-white shadow-lg hover:bg-orange-600 dark:bg-orange-500"
                      : "bg-orange-400 text-white hover:bg-orange-500 dark:bg-orange-400"
                  }`}
                >
                  ALL
                </Button>
                
                {/* Category Buttons - Loaded from backend */}
                {departments.map((dept) => (
                  <Button
                    key={dept._id}
                    onClick={() => handleCategoryClick(dept._id)}
                    className={`rounded-full px-6 py-3 text-sm font-semibold uppercase transition-all ${
                      selectedCategory === dept._id
                        ? "bg-orange-500 text-white shadow-lg hover:bg-orange-600 dark:bg-orange-500"
                        : "bg-orange-400 text-white hover:bg-orange-500 dark:bg-orange-400"
                    }`}
                  >
                    {dept.name.toUpperCase()}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Products Section with Pagination */}
        <section id="products-section" className="bg-gray-50 py-12 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                {selectedCategory ? departments.find((d) => d._id === selectedCategory)?.name?.toUpperCase() || "PRODUCTS" : "ALL PRODUCTS"}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {selectedCategory ? "Category Products" : "Clients' Most Popular Choice"}
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
                {selectedCategory && (
                  <span className="ml-2 text-orange-600 dark:text-orange-400">
                    (Filtered by: {departments.find((d) => d._id === selectedCategory)?.name || selectedCategory})
                  </span>
                )}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              onClick={() => handlePageChange(page)}
                              className={
                                currentPage === page
                                  ? "bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-500"
                                  : "border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400"
                              }
                            >
                              {page}
                            </Button>
                          )
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="px-2 text-gray-500">...</span>
                        }
                        return null
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Page Info */}
                <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
              </>
            ) : (
              <Card className="py-12 text-center">
                <Utensils className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No products found.</p>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

