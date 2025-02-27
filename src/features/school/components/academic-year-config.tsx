/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Plus, Save } from "lucide-react"
import { useMutation, useQuery } from "convex/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { api } from "~/_generated/api"
import { type Id } from "~/_generated/dataModel"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AcademicYearConfigProps {
    schoolId: Id<"schools">
}

export function AcademicYearConfig({ schoolId }: AcademicYearConfigProps) {
    const [showNewYearDialog, setShowNewYearDialog] = useState(false)
    const configureYear = useMutation(api.mutations.school.configureAcademicYear)
    const updateRollover = useMutation(api.mutations.school.updateAcademicConfig)
    const currentYear = useQuery(api.queries.school.getCurrentAcademicYear, { schoolId })
    const academicConfig = useQuery(api.queries.academic.getCurrentTerm, { schoolId })

    const [formData, setFormData] = useState({
        academicYear: "",
        numberOfTerms: 3,
        startDate: "",
        endDate: "",
        autoTermProgression: false,
        terms: [
            {
                termNumber: 1,
                name: "First Term",
                startDate: "",
                endDate: "",
                status: "active" as "active" | "upcoming" | "completed"
            },
        ],
        nextYearConfig: {
            academicYear: "",
            startDate: "",
            endDate: "",
        },
    })


    console.log("formData", formData)

    const handleAddTerm = () => {
        if (formData.terms.length >= formData.numberOfTerms) return

        const termNumber = formData.terms.length + 1
        let termName = ""
        switch (termNumber) {
            case 2:
                termName = "Second Term"
                break
            case 3:
                termName = "Third Term"
                break
            case 4:
                termName = "Fourth Term"
                break
            default:
                termName = `Term ${termNumber}`
        }

        setFormData((prev) => ({
            ...prev,
            terms: [
                ...prev.terms,
                {
                    termNumber,
                    name: termName,
                    startDate: "",
                    endDate: "",
                    status: "active"
                },
            ],
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            // remove nextYearConfig from formData before configuring year
            const formDataWithoutNextYearConfig = {
                academicYear: formData.academicYear,
                numberOfTerms: formData.numberOfTerms,
                startDate: formData.startDate,
                endDate: formData.endDate,
                autoTermProgression: formData.autoTermProgression,
                terms: formData.terms,
            }

            await configureYear({
                schoolId,
                ...formDataWithoutNextYearConfig,
                isActive: true, // or set to the appropriate value
                autoTermProgression: formData.autoTermProgression, // or set to the appropriate value
                autoYearProgression: formData.autoTermProgression, // or set to the appropriate value
            })
            toast.success("Academic year configured successfully")
            setShowNewYearDialog(false)
        } catch (error) {
            toast.error("Failed to configure academic year")
        }
    }

    const handleAutoRolloverChange = async (checked: boolean) => {
        if (!currentYear) return

        try {
            if (academicConfig?.id) {
                await updateRollover({
                    academicConfigId: academicConfig?.id,
                    autotermprogession: checked
                })
                toast.success("Auto-rollover settings updated")
            } else {
                toast.error("Configure school year first")
            }

        } catch (error) {
            toast.error("Failed to update auto-rollover settings")
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Current Academic Year</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {currentYear ? (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label>Academic Year</Label>
                                    <p className="text-2xl font-semibold">{currentYear.academicYear}</p>
                                </div>
                                <div>
                                    <Label>Number of Terms</Label>
                                    <p className="text-2xl font-semibold">{currentYear.numberOfTerms}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label>Start Date</Label>
                                    <p>{new Date(currentYear.startDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <Label>End Date</Label>
                                    <p>{new Date(currentYear.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label>Automatic Year Rollover</Label>
                                    <p className="text-sm text-gray-500">Automatically create next academic year and migrate settings</p>
                                </div>
                                <Switch checked={currentYear.autoTermProgression} onCheckedChange={handleAutoRolloverChange} />
                            </div>

                            {currentYear.terms.map((term) => (
                                <div key={term.termNumber} className="rounded-lg border p-4">
                                    <h3 className="font-semibold mb-4">{term.name}</h3>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label>Start Date</Label>
                                            <p>{new Date(term.startDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <Label>End Date</Label>
                                            <p>{new Date(term.endDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p className="text-center text-gray-500">No academic year configured</p>
                    )}
                </CardContent>
            </Card>

            <Dialog open={showNewYearDialog} onOpenChange={setShowNewYearDialog}>
                <DialogTrigger asChild>
                    <Button className="w-full gap-2">
                        <Plus className="h-4 w-4" />
                        Configure New Academic Year
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Configure New Academic Year</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-96 w-full px-4 py-5 rounded-md border">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="academicYear">Academic Year</Label>
                                    <Input
                                        id="academicYear"
                                        placeholder="2023/2024"
                                        value={formData.academicYear}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                academicYear: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="numberOfTerms">Number of Terms</Label>
                                    <Input
                                        id="numberOfTerms"
                                        type="number"
                                        min="1"
                                        max="4"
                                        value={formData.numberOfTerms}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                numberOfTerms: Number.parseInt(e.target.value),
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="startDate">Academic Year Start</Label>
                                    <div className="relative">
                                        <Input
                                            id="startDate"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    startDate: e.target.value,
                                                }))
                                            }
                                        />
                                        <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="endDate">Academic Year End</Label>
                                    <div className="relative">
                                        <Input
                                            id="endDate"
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    endDate: e.target.value,
                                                }))
                                            }
                                        />
                                        <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">Term Configuration</h3>
                                    <Button type="button" variant="outline" size="sm" onClick={handleAddTerm}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Term
                                    </Button>
                                </div>

                                {formData.terms.map((term, index) => (
                                    <div key={term.termNumber} className="rounded-lg border p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">{term.name}</h4>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label>Term Start</Label>
                                                <div className="relative">
                                                    <Input
                                                        type="date"
                                                        value={term.startDate}
                                                        onChange={(e) => {
                                                            const newTerms = [...formData.terms]
                                                            if (newTerms[index]) {
                                                                newTerms[index].startDate = e.target.value
                                                            }
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                terms: newTerms,
                                                            }))
                                                        }}
                                                    />
                                                    <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Term End</Label>
                                                <div className="relative">
                                                    <Input
                                                        type="date"
                                                        value={term.endDate}
                                                        onChange={(e) => {
                                                            const newTerms = [...formData.terms]
                                                            if (newTerms[index]) {
                                                                newTerms[index].endDate = e.target.value
                                                            }
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                terms: newTerms,
                                                            }))
                                                        }}
                                                    />
                                                    <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* show the option to enable an autonatic rollover when the academicyear, startDate and endDate has been set */}
                            {
                                (formData.academicYear && formData.startDate && formData.endDate) && (
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label>Enable Auto-Rollover</Label>
                                            <p className="text-sm text-gray-500">Automatically create next academic year when current year ends</p>
                                        </div>
                                        <Switch
                                            checked={formData.autoTermProgression}
                                            onCheckedChange={(checked) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    autoTermProgression: checked,
                                                    nextYearConfig: checked
                                                        ? {
                                                            academicYear: getNextAcademicYear(prev.academicYear),
                                                            startDate: getNextYearDate(prev.startDate),
                                                            endDate: getNextYearDate(prev.endDate),
                                                        }
                                                        : {
                                                            academicYear: "",
                                                            startDate: "",
                                                            endDate: "",
                                                        },
                                                }))
                                            }
                                        />
                                    </div>
                                )
                            }


                            {formData.autoTermProgression && (
                                <div className="rounded-lg border p-4 space-y-4">
                                    <h4 className="font-medium">Next Academic Year Settings</h4>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label>Academic Year</Label>
                                            <Input
                                                value={formData.nextYearConfig.academicYear}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        nextYearConfig: {
                                                            ...prev.nextYearConfig,
                                                            academicYear: e.target.value,
                                                        },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Start Date</Label>
                                            <div className="relative">
                                                <Input
                                                    type="date"
                                                    value={formData.nextYearConfig.startDate}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            nextYearConfig: {
                                                                ...prev.nextYearConfig,
                                                                startDate: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                />
                                                <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Button type="submit" className="w-full">
                                <Save className="h-4 w-4 mr-2" />
                                Save Configuration
                            </Button>
                        </form>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Helper functions
function getNextAcademicYear(currentYear: string): string {
    const [start, end] = currentYear.split("/")
    const nextStart = end ? Number.parseInt(end) : 0
    const nextEnd = nextStart + 1
    return `${nextStart}/${nextEnd}`
}

function getNextYearDate(date: string): string {
    const d = new Date(date)
    d.setFullYear(d.getFullYear() + 1)
    return d.toISOString().split("T")[0] ?? ""
}

