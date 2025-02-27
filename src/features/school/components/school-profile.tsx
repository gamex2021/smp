"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
import { useSchoolSettings } from "../hooks/use-school-settings"
import { useNotify } from "@/components/ui/notifications"
import { type Id } from "~/_generated/dataModel"
import { api } from "~/_generated/api"
import { useQuery } from "convex/react"

interface SchoolProfileProps {
    schoolId: Id<"schools">
}

export function SchoolProfile({ schoolId }: SchoolProfileProps) {
    const { profile, handleProfileUpdate } = useSchoolSettings(schoolId)
    const notify = useNotify()
    const [loading, setLoading] = useState(false)
    // get school data
    const school = useQuery(api.queries.school.getSchoolProfile, {
        schoolId
    })

    const [formData, setFormData] = useState({
        name: profile?.name ?? school?.name,
        motto: profile?.motto ?? school?.motto,
        email: profile?.email ?? school?.email,
        phone: profile?.phone ?? school?.phone,
        address: profile?.address ?? school?.address,
        type: profile?.type ?? school?.type,
        category: profile?.category ?? school?.category,
        yearFounded: profile?.yearFounded ?? school?.yearFounded,
        logo: profile?.logo ?? "",
    })

    useEffect(() => {
        setFormData({
            name: profile?.name ?? school?.name,
            motto: profile?.motto ?? school?.motto,
            email: profile?.email ?? school?.email,
            phone: profile?.phone ?? school?.phone,
            address: profile?.address ?? school?.address,
            type: profile?.type ?? school?.type,
            category: profile?.category ?? school?.category,
            yearFounded: profile?.yearFounded ?? school?.yearFounded,
            logo: profile?.logo ?? "",
        })
    }, [school])

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await handleProfileUpdate(formData)
            if (result.success) {
                notify.success("School profile updated successfully")
            } else {
                notify.error("Failed to update school profile")
            }
        } catch (error) {
            notify.error("An error occurred while updating the profile")
        } finally {
            setLoading(false)
        }
    }

    if (!profile) {
        return <div>Loading profile...</div>
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Update your school&apos;s basic information and contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                            <div className="relative h-24 w-24">
                                <img
                                    src={formData.logo || "/placeholder.svg?height=96&width=96"}
                                    alt="School logo"
                                    className="rounded-lg border object-cover"
                                />
                                <Button size="sm" variant="outline" className="absolute -bottom-3 -right-3">
                                    <Upload className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">School Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="Enter school name"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="motto">School Motto</Label>
                                <Input
                                    id="motto"
                                    value={formData.motto}
                                    onChange={(e) => handleChange("motto", e.target.value)}
                                    placeholder="Enter school motto"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="school@example.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                placeholder="+234..."
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            placeholder="Enter school address"
                            className="resize-none"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="type">School Type</Label>
                            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="primary">Primary School</SelectItem>
                                    <SelectItem value="secondary">Secondary School</SelectItem>
                                    <SelectItem value="both">Primary & Secondary</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="private">Private</SelectItem>
                                    <SelectItem value="public">Public</SelectItem>
                                    <SelectItem value="international">International</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="yearFounded">Year Founded</Label>
                            <Input
                                id="yearFounded"
                                type="number"
                                value={formData.yearFounded}
                                onChange={(e) => handleChange("yearFounded", e.target.value)}
                                placeholder="YYYY"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" className="bg-[#2E8B57] hover:bg-[#2E8B57]/90" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}

