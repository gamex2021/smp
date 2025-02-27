/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useQuery, useMutation } from "convex/react"
import { CalendarClock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { type Id } from "~/_generated/dataModel"
import { api } from "~/_generated/api"
import { toast } from "sonner"

export function TermProgressionSettings({ schoolId }: {
    schoolId: Id<"schools">
}) {

    const currentConfig = useQuery(api.queries.school.getCurrentAcademicYear, {
        schoolId,
    })
    const updateAutoProgression = useMutation(api.mutations.academic.updateAutoTermProgression)
    const progressToNextTerm = useMutation(api.mutations.academic.progressToNextTerm)
    const [isUpdating, setIsUpdating] = useState(false)

    const handleAutoProgressionToggle = async (enabled: boolean) => {
        if (!currentConfig?._id) return

        setIsUpdating(true)
        try {
            await updateAutoProgression({
                configId: currentConfig._id,
                autoTermProgression: enabled,
            })
            toast.success(`Automatic term progression ${enabled ? "enabled" : "disabled"}`)
        } catch (error) {
            toast.error("Failed to update setting")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleManualProgression = async () => {
        if (!currentConfig?._id) return

        setIsUpdating(true)
        try {
            await progressToNextTerm({
                configId: currentConfig._id,
            })
            toast.success("Successfully progressed to next term")
        } catch (error) {
            toast.error("Failed to progress term")
        } finally {
            setIsUpdating(false)
        }
    }

    if (!currentConfig) {
        return null
    }

    const currentTerm = currentConfig.currentTerm
    const isLastTerm = currentTerm?.termNumber === currentConfig.numberOfTerms

    return (
        <Card>
            <CardHeader>
                <CardTitle>Term Progression Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <h3 className="text-base font-medium">Automatic Term Progression</h3>
                        <p className="text-sm text-gray-500">Automatically progress to next term based on end date</p>
                    </div>
                    <Switch
                        checked={currentConfig.autoTermProgression}
                        onCheckedChange={handleAutoProgressionToggle}
                        disabled={isUpdating}
                    />
                </div>

                <div className="rounded-md border p-4">
                    <div className="flex items-center gap-4">
                        <CalendarClock className="h-8 w-8 text-[#2E8B57]" />
                        <div>
                            <h4 className="font-medium">Current Term</h4>
                            <p className="text-sm text-gray-500">
                                {currentTerm
                                    ? `${currentTerm.name} (${new Date(currentTerm.startDate).toLocaleDateString()} - ${new Date(
                                        currentTerm.endDate,
                                    ).toLocaleDateString()})`
                                    : "No active term"}
                            </p>
                        </div>
                    </div>
                </div>

                {currentTerm?.status === "active" && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Term End Date Approaching</AlertTitle>
                        <AlertDescription>
                            Current term ends on {new Date(currentTerm.endDate).toLocaleDateString()}
                        </AlertDescription>
                    </Alert>
                )}

                <Button onClick={handleManualProgression} disabled={isUpdating || isLastTerm} className="w-full">
                    {isLastTerm ? "Final Term of Academic Year" : isUpdating ? "Progressing..." : "Progress to Next Term"}
                </Button>

                {currentConfig.autoTermProgression && (
                    <p className="text-sm text-gray-500">
                        Next term will begin automatically on {new Date(currentTerm?.endDate ?? "").toLocaleDateString()}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

