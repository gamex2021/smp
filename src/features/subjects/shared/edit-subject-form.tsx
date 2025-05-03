"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useDomain } from "@/context/DomainContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { TbLoader3 } from "react-icons/tb"
import { toast } from "sonner"
import * as z from "zod"
import { api } from "~/_generated/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { SUBJECT_CATEGORIES } from "@/lib/constants"
import { type Subject } from "../types"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Subject name must be at least 2 characters.",
    }),
    category: z.string(),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    isCore: z.boolean().default(false),
})

interface EditSubjectFormProps {
    subject: Subject
    onClose: () => void
}

export default function EditSubjectForm({ subject, onClose }: EditSubjectFormProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const { domain } = useDomain()

    // Get school info
    const schoolInfo = useQuery(api.queries.school.findSchool, { domain })

    // Update subject mutation
    const updateSubject = useMutation(api.mutations.subject.updateSubject)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: subject.name || "",
            category: subject.category || "",
            description: subject.description || "",
            isCore: subject.isCore || false,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!schoolInfo?.id) {
            toast.error("Could not get school info.")
            return
        }

        setLoading(true)

        try {
            // Update the subject
            await updateSubject({
                subjectId: subject._id,
                name: values.name,
                description: values.description,
                category: values.category,
                isCore: values.isCore,
                schoolId: schoolInfo?.id,
            })

            toast.success("Subject updated successfully")
            onClose()
        } catch (error) {
            console.error("Error updating subject:", error)
            toast.error(`${error instanceof Error ? error.message : "Something went wrong"}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Category */}
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {SUBJECT_CATEGORIES?.map((category, index) => (
                                        <SelectItem key={index} value={category.name}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Subject Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Advanced Mathematics" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Brief description of the subject..." className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Is Core Subject */}
                <FormField
                    control={form.control}
                    name="isCore"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Core Subject</FormLabel>
                                <FormDescription>Is this a core subject in the curriculum?</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={onClose} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-[#2E8B57] hover:bg-[#2E8B57]/80" disabled={loading}>
                        {loading ? <TbLoader3 className="text-white w-7 h-7 animate-spin" /> : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
