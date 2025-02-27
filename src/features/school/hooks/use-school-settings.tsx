/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useMutation, useQuery } from "convex/react"
import { api } from "~/_generated/api"
import { type Id } from "~/_generated/dataModel"


export function useSchoolSettings(schoolId: Id<"schools">) {
    // Queries
    const profile = useQuery(api.queries.school.getSchoolProfile, { schoolId })
    const academicConfig = useQuery(api.queries.school.getAcademicConfig, { schoolId })
    const academicYears = useQuery(api.queries.school.getAllAcademicYears, { schoolId })

    // Mutations
    const updateProfile = useMutation(api.mutations.school.updateSchoolProfile)
    const configureAcademicYear = useMutation(api.mutations.school.configureAcademicYear)
    const configureTerm = useMutation(api.mutations.school.configureTerm)
    const updateTermSettings = useMutation(api.mutations.school.updateTermSettings)
    const deleteTerm = useMutation(api.mutations.school.deleteTerm)

    const handleProfileUpdate = async (data: Record<string, unknown>) => {

        console.log("the data", data);

        try {
            await updateProfile({
                schoolId,
                address: data.address as string,
                name: data.name as string,
                email: data.email as string,
                type: data.type as "primary" | "secondary" | "both",
                phone: data.phone as string,
                category: data.category as "public" | "private" | "international",
                yearFounded: parseInt(`${data.yearFounded}`),
                logo: data.logo as string | undefined,
                motto: data.motto as string | undefined
            })
            return { success: true }
        } catch (error) {
            console.error("Failed to update profile:", error)
            return { success: false, error }
        }
    }

    const handleAcademicYearConfig = async (data: any) => {
        try {
            await configureAcademicYear({ schoolId, ...data })
            return { success: true }
        } catch (error) {
            console.error("Failed to configure academic year:", error)
            return { success: false, error }
        }
    }

    const handleTermConfig = async (academicConfigId: Id<"academicConfig">, data: { name: string; startDate: string; endDate: string; termNumber: number; feeStructure: { amount: number; feeType: string; dueDate: string; isCompulsory: boolean; }[]; }) => {
        try {
            await configureTerm({ academicConfigId, ...data })
            return { success: true }
        } catch (error) {
            console.error("Failed to configure term:", error)
            return { success: false, error }
        }
    }

    return {
        // Data
        profile,
        academicConfig,
        academicYears,

        // Actions
        handleProfileUpdate,
        handleAcademicYearConfig,
        handleTermConfig,
        updateTermSettings,
        deleteTerm,
    }
}

