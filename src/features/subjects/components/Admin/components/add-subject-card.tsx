/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch"
import { type Id } from '~/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { api } from "~/_generated/api"
import { TbLoader3 } from 'react-icons/tb';
import { useDomain } from '@/context/DomainContext';
import { SUBJECT_CATEGORIES } from '@/lib/constants';
import { MultiSelect } from '@/components/ui/multi-select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from 'lucide-react';


const formSchema = z.object({
    name: z.string().min(2, {
        message: "Subject name must be at least 2 characters.",
    }),
    category: z.string(),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    isCore: z.boolean().default(false),
    classes: z.array(z.custom<Id<"classes">>()), // Added classes schema
})

export function CreateSubjectCard() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex min-h-[160px] w-full flex-col items-center justify-center rounded-lg bg-gray-200 p-4 transition-colors hover:bg-gray-300">
                    <div className="mb-2 rounded-full bg-white p-3">
                        <Plus className="h-6 w-6 text-gray-600" />
                    </div>
                    <span className="text-gray-600">More</span>
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a subject</DialogTitle>
                    <DialogDescription>
                        Create a subject.
                    </DialogDescription>
                </DialogHeader>
                <AddSubjectCard />
            </DialogContent>
        </Dialog>
    );
}

export function AddSubjectCard() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            category: "",
            description: "",
            isCore: false,
            classes: []
        },
    })
    const createSubject = useMutation(api.mutations.subject.createSubject);
    const [loader, setLoader] = useState<boolean>(false);
    const { domain } = useDomain()
    // get the classes in the school
    const classesQuery = useQuery(api.queries.class.getClassesData, {
        domain,
    });
    // get the schoolInfo which includes the id,
    const schoolInfo = useQuery(api.queries.school.findSchool, {
        domain,
    });


    // create the subject function
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!schoolInfo?.id) {
            toast.error("Could not get school info.");
            return;
        }
        setLoader(true);
        try {
            await createSubject({
                name: values.name,
                description: values.description,
                schoolId: schoolInfo.id,
                category: values.category,
                isCore: values.isCore,
                classes: values.classes
            })
            toast.success("Successfully created subject")
            setLoader(false);
            form.reset()
        } catch (error) {
            console.error("There was an error", error)
            toast.error(`${error instanceof Error ? error.message : "Something went wrong"}`)
            setLoader(false)
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* the category of the subject */}
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

                {/* the name of the subject */}
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


                {/* the description of the subject */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Brief description of the subject..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* classes if applicable, this is optional */}
                <FormField
                    control={form.control}
                    name="classes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Classes</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    selected={field.value}
                                    options={Array.isArray(classesQuery) ? classesQuery.map((c: { title: string; _id: Id<"classes"> }) => ({ label: c.title, value: c._id })) : []}
                                    onChange={(values) => field.onChange(values)}
                                    placeholder="Select classes"
                                />
                            </FormControl>
                            <FormDescription>
                                Select the classes for this subject.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* if the subject is a core subject or not */}
                <FormField
                    control={form.control}
                    name="isCore"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Core Subject</FormLabel>
                                <FormDescription>
                                    Is this a core subject in the curriculum?
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full bg-green-800">
                    {
                        loader ? (<TbLoader3 className="text-white w-7 h-7 animate-spin" />) : "Add Subject"
                    }
                </Button>
            </form>
        </Form>
    )
}
