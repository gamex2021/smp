"use client"

import { createContext, useContext, type ReactNode } from "react"

type DomainContextType = {
    domain: string
}

const DomainContext = createContext<DomainContextType | undefined>(undefined)

export function DomainProvider({ children, domain }: { children: ReactNode; domain: string }) {
    return <DomainContext.Provider value={{ domain }}>{children}</DomainContext.Provider>
}

export const useDomain = () => {
    const context = useContext(DomainContext)
    if (context === undefined) {
        throw new Error("useDomain must be used within a DomainProvider")
    }
    return context
}

