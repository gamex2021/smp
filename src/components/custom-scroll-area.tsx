"use client"

import { ScrollArea } from "@radix-ui/react-scroll-area"
import type React from "react"
import { useEffect, useState } from "react"

const CustomScrollArea = ({
    children,
    maxHeightPercentage = 50, // Default to 50% of viewport height
    minHeight = 200, // Minimum height in pixels
    className = "",
}: {
    children: React.ReactNode
    maxHeightPercentage?: number
    minHeight?: number
    className?: string
}) => {
    const [maxHeight, setMaxHeight] = useState<number>(0)

    useEffect(() => {
        // Set initial height
        updateHeight()

        // Update height on window resize
        window.addEventListener("resize", updateHeight)

        // Cleanup
        return () => window.removeEventListener("resize", updateHeight)
    }, [maxHeightPercentage])

    const updateHeight = () => {
        const viewportHeight = window.innerHeight
        const calculatedHeight = (viewportHeight * maxHeightPercentage) / 100
        setMaxHeight(calculatedHeight)
    }

    return (
        <ScrollArea
            className={`w-full rounded-md border px-2 py-2 ${className}`}
            style={{
                maxHeight: `${maxHeight}px`,
                minHeight: `${minHeight}px`,
                height: "auto",
                overflow: "auto",
            }}
        >
            {children}
        </ScrollArea>
    )
}

export default CustomScrollArea

