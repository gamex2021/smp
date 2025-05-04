"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useDomain } from "@/context/DomainContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, usePaginatedQuery, useQuery } from "convex/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { TbLoader3 } from "react-icons/tb"
import { toast } from "sonner"
import * as z from "zod"
import { api } from "~/_generated/api"
import { MultiSelect } from "@/components/ui/multi-select"
import { Search } from "lucide-react"
import type { Id } from "~/_generated/dataModel"
import { type Classes } from "../types"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  teacherIds: z.array(z.custom<Id<"users">>()),
})

interface EditClassFormProps {
  classItem: Classes
  onClose: () => void
}

export default function EditClassForm({ classItem, onClose }: EditClassFormProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const { domain } = useDomain()
  const [teacherSearch, setTeacherSearch] = useState("")

  // Get school info
  const schoolInfo = useQuery(api.queries.school.findSchool, { domain })

  // Get class teachers
  const classTeachers = useQuery(api.queries.class.getClassTeach, {
    classId: classItem._id,
  })

  // Get teachers with pagination
  const {
    results: teachers,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.queries.teacher.getTeachersWithPagination,
    domain ? { domain, search: teacherSearch } : "skip",
    { initialNumItems: 12 },
  )

  // Update class mutation
  const updateClass = useMutation(api.mutations.class.updateClass)

  // Extract teacher IDs from class teachers
  const teacherIds = classTeachers?.map((teacher) => teacher.teacherId) ?? []

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: classItem.title || "",
      teacherIds: teacherIds,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!schoolInfo?.id) {
      toast.error("Could not get school info.")
      return
    }

    setLoading(true)

    try {
      // Update the class
      await updateClass({
        classId: classItem._id,
        title: values.title,
        schoolId: schoolInfo.id,
        teacherIds: values.teacherIds,
      })

      toast.success("Class updated successfully")
      onClose()
    } catch (error) {
      console.error("Error updating class:", error)
      toast.error(`${error instanceof Error ? error.message : "Something went wrong"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Class Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Title</FormLabel>
              <FormControl>
                <Input placeholder="JSS1 or SS3" {...field} />
              </FormControl>
              <FormDescription>
                This should be the name of a class in your school, you can also create groups within a class.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Assign Teachers */}
        <FormField
          control={form.control}
          name="teacherIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Class Teacher(s)</FormLabel>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search for a teacher..."
                  className="w-full pl-9"
                  onChange={(e) => setTeacherSearch(e.target.value)}
                />
              </div>
              <FormControl>
                <MultiSelect
                  selected={field.value}
                  options={
                    teachers?.map((c) => ({
                      label: c.name ?? c.email,
                      value: c._id,
                    })) ?? []
                  }
                  onChange={(values) => field.onChange(values)}
                  placeholder="Select teacher(s)"
                />
              </FormControl>
              <FormDescription>
                Select class teacher(s) for this class. You can choose multiple teachers if needed.
              </FormDescription>
              {status === "CanLoadMore" && (
                <div className="mt-4 flex justify-center">
                  <Button
                    type="button"
                    aria-label="Load more teachers"
                    onClick={() => loadMore(12)}
                    variant="outline"
                    className="px-8"
                  >
                    Load More
                  </Button>
                </div>
              )}
              <FormMessage />
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
