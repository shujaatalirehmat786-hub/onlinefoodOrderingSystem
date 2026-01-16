"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { getStoreSlug } from "@/lib/store"
import { Loader2 } from "lucide-react"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [store, setStore] = useState(() => getStoreSlug())
  const [otp, setOtp] = useState("")
  const [showOtpInput, setShowOtpInput] = useState(false)
  const { login, verifyOtp, isLoading, error, user } = useAuth()

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(phone, store)
    if (success) {
      setShowOtpInput(true)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await verifyOtp(phone, otp, store)
    if (result?.success) {
      onOpenChange(false)
      setPhone("")
      setStore(getStoreSlug())
      setOtp("")
      setShowOtpInput(false)
      
      // Check if user has complete profile information
      const currentUser = result.user || user
      if (!currentUser?.firstName || !currentUser?.lastName) {
        // Redirect to profile page if firstName or lastName is missing
        router.push("/profile?fromAuth=true")
      }
    }
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setPhone("")
      setStore(getStoreSlug())
      setOtp("")
      setShowOtpInput(false)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{showOtpInput ? "Verify OTP" : "Sign in to continue"}</DialogTitle>
          <DialogDescription>
            {showOtpInput
              ? `Enter the OTP sent to ${phone}`
              : "Enter your phone number to sign in or create an account."}
          </DialogDescription>
        </DialogHeader>
        {!showOtpInput ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store">Store</Label>
              <Input
                id="store"
                type="text"
                placeholder="savera"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91XXXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store">Store</Label>
              <Input
                id="store"
                type="text"
                placeholder="savera"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={isLoading}
                maxLength={6}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setShowOtpInput(false)
                setOtp("")
              }}
              disabled={isLoading}
            >
              Change Phone Number
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
