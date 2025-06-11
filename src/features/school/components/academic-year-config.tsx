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
import { CalendarIcon, Plus, Save, Archive, Trash2, CheckCircle } from "lucide-react"
import { useMutation, useQuery } from "convex/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { api } from "~/_generated/api"
import { type Id } from "~/_generated/dataModel"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AcademicYearConfigProps {
  schoolId: Id<"schools">
}

export function AcademicYearConfig({ schoolId }: AcademicYearConfigProps) {
  const [showNewYearDialog, setShowNewYearDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedYearId, setSelectedYearId] = useState<Id<"academicConfig"> | null>(null)

  const createYear = useMutation(api.mutations.academic.createAcademicYear)
  const updateYear = useMutation(api.mutations.academic.updateAcademicYear)
  const deleteYear = useMutation(api.mutations.academic.deleteAcademicYear)
  const setActiveYear = useMutation(api.mutations.academic.setActiveAcademicYear)
  const archiveYear = useMutation(api.mutations.academic.archiveAcademicYear)

  const allYears = useQuery(api.queries.academic.getAllAcademicYears, { schoolId })
  const activeYear = useQuery(api.queries.academic.getActiveAcademicYear, { schoolId })

  const [formData, setFormData] = useState({
    academicYear: "",
    numberOfTerms: 3,
    startDate: "",
    endDate: "",
    autoTermProgression: false,
    autoYearProgression: false,
    terms: [
      {
        termNumber: 1,
        name: "First Term",
        startDate: "",
        endDate: "",
        status: "upcoming" as "upcoming" | "active" | "completed",
      },
    ],
    description: "",
  })

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
          status: "upcoming",
        },
      ],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createYear({
        schoolId,
        ...formData,
      })
      toast.success("Academic year created successfully")
      setShowNewYearDialog(false)
      setFormData({
        academicYear: "",
        numberOfTerms: 3,
        startDate: "",
        endDate: "",
        autoTermProgression: false,
        autoYearProgression: false,
        terms: [
          {
            termNumber: 1,
            name: "First Term",
            startDate: "",
            endDate: "",
            status: "upcoming",
          },
        ],
        description: "",
      })
    } catch (error) {
      toast.error("Failed to create academic year")
    }
  }

  const handleSetActive = async (yearId: Id<"academicConfig">) => {
    try {
      await setActiveYear({
        academicYearId: yearId,
        schoolId,
      })
      toast.success("Active academic year updated")
    } catch (error) {
      toast.error("Failed to update active academic year")
    }
  }

  const handleArchive = async (yearId: Id<"academicConfig">) => {
    try {
      await archiveYear({
        academicYearId: yearId,
      })
      toast.success("Academic year archived")
    } catch (error) {
      toast.error("Failed to archive academic year")
    }
  }

  const handleDelete = async () => {
    if (!selectedYearId) return

    try {
      await deleteYear({
        academicYearId: selectedYearId,
      })
      toast.success("Academic year deleted")
      setShowDeleteDialog(false)
      setSelectedYearId(null)
    } catch (error) {
      toast.error("Failed to delete academic year")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>
      case "completed":
        return <Badge className="bg-gray-500">Completed</Badge>
      case "archived":
        return <Badge className="bg-yellow-500">Archived</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Academic Years</h2>
        <Dialog open={showNewYearDialog} onOpenChange={setShowNewYearDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Academic Year
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

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Optional description for this academic year"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
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

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Auto Term Progression</Label>
                      <p className="text-sm text-gray-500">
                        Automatically progress to next term when current term ends
                      </p>
                    </div>
                    <Switch
                      checked={formData.autoTermProgression}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          autoTermProgression: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Auto Year Progression</Label>
                      <p className="text-sm text-gray-500">
                        Automatically create next academic year when current year ends
                      </p>
                    </div>
                    <Switch
                      checked={formData.autoYearProgression}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          autoYearProgression: checked,
                        }))
                      }
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Create Academic Year
                </Button>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {allYears?.map((year) => (
          <Card key={year._id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                {year.academicYear}
                {getStatusBadge(year.status)}
                {year.isActive && (
                  <Badge variant="outline" className="bg-green-50">
                    Current Year
                  </Badge>
                )}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!year.isActive && (
                    <DropdownMenuItem onClick={() => handleSetActive(year._id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Set as Current
                    </DropdownMenuItem>
                  )}
                  {year.status !== "archived" && (
                    <DropdownMenuItem onClick={() => handleArchive(year._id)}>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  )}
                  {!year.isActive && (
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setSelectedYearId(year._id)
                        setShowDeleteDialog(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Start Date</Label>
                  <p>{new Date(year.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>End Date</Label>
                  <p>{new Date(year.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-4">
                <Label>Terms</Label>
                <div className="mt-2 space-y-2">
                  {year.terms.map((term) => (
                    <div key={term.termNumber} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{term.name}</h4>
                        {getStatusBadge(term.status)}
                      </div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2 text-sm text-gray-500">
                        <div>
                          Start: {new Date(term.startDate).toLocaleDateString()}
                        </div>
                        <div>
                          End: {new Date(term.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {year.description && (
                <div className="mt-4">
                  <Label>Description</Label>
                  <p className="text-sm text-gray-500">{year.description}</p>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Switch checked={year.autoTermProgression} disabled />
                  <Label>Auto Term Progression</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={year.autoYearProgression} disabled />
                  <Label>Auto Year Progression</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the academic year and all its
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

