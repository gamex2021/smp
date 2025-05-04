/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useQuery, useMutation } from "convex/react"
import { Loader2 } from "lucide-react"
import { api } from "~/_generated/api"
import { type Id } from "~/_generated/dataModel"
import { toast } from "sonner"

interface InitializeLandingPageButtonProps {
  schoolId: Id<"schools">
  onInitialized?: () => void
}

export default function InitializeLandingPageButton({ schoolId, onInitialized }: InitializeLandingPageButtonProps) {
  const [isInitializing, setIsInitializing] = useState(false)

  // Check if landing page is already initialized
  const initStatus = useQuery(api.queries.landingPage.checkLandingPageInitialized, { schoolId })
  const isLoading = initStatus === undefined

  // Use the mutation directly
  const initializeLandingPage = useMutation(api.mutations.landingPage.initializeDefaultLandingPage)

  const handleInitialize = async () => {
    try {
      setIsInitializing(true)

      await initializeLandingPage({ schoolId })
      
      toast.success("Landing page initialized with default content.")

      if (onInitialized) {
        onInitialized()
      }
    } catch (error) {
      console.error("Error initializing landing page:", error)
      toast.error("Failed to initialize landing page. Please try again.")
    } finally {
      setIsInitializing(false)
    }
  }

  if (isLoading) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking...
      </Button>
    )
  }

  if (initStatus?.initialized) {
    return null // Don't show button if already initialized
  }

  return (
    <Button
      onClick={handleInitialize}
      disabled={isInitializing}
      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
    >
      {isInitializing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Initializing...
        </>
      ) : (
        "Initialize Default Landing Page"
      )}
    </Button>
  )
}
