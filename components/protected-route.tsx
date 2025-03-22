"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check authentication status only on the client side
  useEffect(() => {
    if (isClient) {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsAuthenticated(isLoggedIn)

      // Only redirect if not authenticated and not on public routes
      if (!isLoggedIn && !pathname.includes("/login") && !pathname.includes("/signup") && pathname !== "/") {
        router.push("/login")
      }
    }
  }, [isClient, pathname, router])

  // Don't render anything during server-side rendering for protected routes
  if (!isClient) {
    // Return children for public routes during SSR
    if (pathname === "/" || pathname.includes("/login") || pathname.includes("/signup")) {
      return <>{children}</>
    }
    // Return null for protected routes during SSR to avoid hydration issues
    return null
  }

  // For public routes or authenticated users, render children
  if (pathname === "/" || pathname.includes("/login") || pathname.includes("/signup") || isAuthenticated) {
    return <>{children}</>
  }

  // For protected routes with unauthenticated users, render nothing
  return null
}

