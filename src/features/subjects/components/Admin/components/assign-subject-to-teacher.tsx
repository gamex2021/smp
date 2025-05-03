/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import { Check, Search } from 'lucide-react'
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "~/_generated/api"
import { type Id } from "~/_generated/dataModel"
import { useDomain } from "@/context/DomainContext"
import { useMutation, usePaginatedQuery, useQuery } from "convex/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { teacherAssignmentSchema, type TeacherAssignmentValues } from "../schemas/class-subject-teacher-assignment"
import { toast } from 'sonner'

type Props = {
    subjectId: Id<"subjects">
}

const TEACHERS_PER_PAGE = 50

export default function AssignSubjectToTeacher({ subjectId }: Props) {
    const { domain } = useDomain()
    const [search, setSearch] = useState("")

    const form = useForm<TeacherAssignmentValues>({
        resolver: zodResolver(teacherAssignmentSchema),
        defaultValues: {
            search: "",
            selectedClassId: "",
            selectedTeacherId: "",
        },
    })

    // Get the subject, classes, teachers relation
    const subjectTeachersClasses = useQuery(api.queries.subject.getSTCBySubjectId, {
        subjectId,
        domain,
    })

    // Get teachers for the school with cursor-based pagination

    const {
        results: teachers,
        status,
        loadMore,
    } = usePaginatedQuery(api.queries.teacher.getTeachersWithPagination, domain ? { domain, search } : "skip", { initialNumItems: 12 })

    // Mutation to assign a teacher
    const assignTeacherToClassSubject = useMutation(api.mutations.subject.UpdateSubjectClassTeachers)

    // Submit handler
    const onSubmit = useCallback(async (values: TeacherAssignmentValues) => {
        try {
            await assignTeacherToClassSubject({
                teacherId: values.selectedTeacherId as Id<"users">,
                classId: values.selectedClassId as Id<"classes">,
                subjectId,
            })

            toast.success("Teacher assigned successfully")
        } catch (error) {
            toast.error("Failed to assign teacher")
            console.error(error)
        }
    }, [assignTeacherToClassSubject, subjectId])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 p-4">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search teachers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                        aria-label="Search teachers"
                    />
                </div>

                {/* Classes Selection */}
                <FormField
                    control={form.control}
                    name="selectedClassId"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">Select Class</h3>
                                    <p className="text-xs">These are all the classes that this subject has been assigned to, assign a teacher to each of the class</p>
                                    <div className="grid gap-2 sm:grid-cols-2 ">
                                        {subjectTeachersClasses?.map((stc) => (
                                            <Card
                                                key={stc?.currentClass?._id}
                                                className={cn(
                                                    "flex cursor-pointer w-full items-center justify-between p-4 transition-colors hover:bg-muted",
                                                    field.value === stc?.currentClass?._id && "border-primary"
                                                )}
                                                onClick={() => field.onChange(stc?.currentClass?._id)}
                                                role="button"
                                                tabIndex={0}
                                                aria-pressed={field.value === stc?.currentClass?._id}
                                            >
                                                <div className='flex flex-col space-y-3'>
                                                    <span className="font-medium">{stc?.currentClass?.title}</span>
                                                    <span className="font-medium"> <span className='text-sm font-normal'>Current Teacher :</span> {stc?.currentTeacher?.name}</span>
                                                </div>

                                                {field.value === stc?.currentClass?._id && (
                                                    <Check className="h-4 w-4 text-primary" />
                                                )}
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Teachers List */}
                {form.watch("selectedClassId") && (
                    <FormField
                        control={form.control}
                        name="selectedTeacherId"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium">Select Teacher</h3>
                                        <ScrollArea className="h-[300px]">
                                            <div className="grid gap-2">
                                                {teachers.map((teacher) => (
                                                    <Card
                                                        key={teacher._id}
                                                        className={cn(
                                                            "flex items-center justify-between p-4",
                                                            field.value === teacher._id && "border-primary"
                                                        )}
                                                        onClick={() => field.onChange(teacher._id)}
                                                        role="button"
                                                        tabIndex={0}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Avatar>
                                                                <AvatarImage src={teacher.image ?? ""} alt={teacher.name} />
                                                                <AvatarFallback>
                                                                    {(teacher?.name ?? "TE").substring(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium">{teacher.name}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {teacher.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                        {/* load more teacher */}
                                        {status === "CanLoadMore" && (
                                            <div className="mt-8 flex justify-center">
                                                <Button role="button" aria-label='Load more teachers' onClick={() => loadMore(12)} variant="outline" className="px-8">
                                                    Load More
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <Button type="submit" className="mt-4 bg-green-800">
                    Assign Teacher
                </Button>
            </form>
        </Form>
    )
}
