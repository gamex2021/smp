"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SchoolProfile } from "./school-profile"
import { useDomain } from "@/context/DomainContext"
import { useQuery } from "convex/react"
import { api } from "~/_generated/api"
import { AcademicYearConfig } from "./academic-year-config"
import { TermProgressionSettings } from "./term-progression-settings"
import { InstallmentCalculator } from "./installment-calculator"
import { ClassFeeConfig } from "./class-fee-config"



export function SchoolTabs() {
    const [activeTab, setActiveTab] = useState("profile")
    const { domain } = useDomain()
    // get the schoolInfo which includes the id,
    const school = useQuery(api.queries.school.findSchool, {
        domain,
    });

    if (!school?.id) {
        return null;
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white">
                <TabsTrigger value="profile">School Profile</TabsTrigger>
                <TabsTrigger value="academic">Academic Year</TabsTrigger>
                <TabsTrigger value="terms">Term Settings</TabsTrigger>
                <TabsTrigger value="fees">Fee Structure</TabsTrigger>
                <TabsTrigger value="payments">Payment Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
                <SchoolProfile schoolId={school?.id} />
            </TabsContent>

            <TabsContent value="academic" className="space-y-6">
                <AcademicYearConfig schoolId={school?.id} />
            </TabsContent>

            <TabsContent value="terms" className="space-y-6">
                <div className="grid gap-6">
                    <TermProgressionSettings schoolId={school?.id} />
                </div>
            </TabsContent>

            <TabsContent value="fees" className="space-y-6">
                <ClassFeeConfig schoolId={school?.id} />
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* <PaymentReminderSettings schoolId={school?.id} /> */}
                    <InstallmentCalculator />
                </div>
            </TabsContent>
        </Tabs>
    )
}

