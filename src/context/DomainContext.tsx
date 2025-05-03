"use client"

import { useQuery } from "convex/react"
import { createContext, useContext, type ReactNode } from "react"
import { api } from "~/_generated/api"
import { Id, type Doc } from "~/_generated/dataModel"

type DomainContextType = {
    domain: string
    user: Doc<"users"> | undefined
    school: Doc<"schools"> | undefined
}

const DomainContext = createContext<DomainContextType | undefined>(undefined)

export function DomainProvider({ children, domain }: { children: ReactNode; domain: string }) {
    // get the user
    const user = useQuery(api.queries.user.currentUser) ?? undefined;

    // get the school info from the domain
    const school = useQuery(api.queries.school.findSchool, {
        domain,
    }) ?? undefined;

    return <DomainContext.Provider value={{ domain, user, school }}>{children}</DomainContext.Provider>

}

export const useDomain = () => {
    const context = useContext(DomainContext)
    if (context === undefined) {
        throw new Error("useDomain must be used within a DomainProvider")
    }
    return context
}

