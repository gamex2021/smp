/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useDomain } from "@/context/DomainContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction, useMutation, usePaginatedQuery, useQuery } from "convex/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { TbLoader3 } from "react-icons/tb"
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner"
import * as z from "zod"
import { api } from "~/_generated/api"
import { type Id } from "~/_generated/dataModel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
        message: "Phone number must be at least 10 digits.",
    }),
    bio: z.string().min(10, {
        message: "Bio must be at least 10 characters.",
    }),
    profilePicture: z.instanceof(File).optional().refine((file) => {
        if (file) {
            return file.size <= 5000000; // 5MB
        }
        return true;
    }, `Max file size is 5MB.`),
    address: z.string().min(4, {
        message: "Address must be at least 10 characters.",
    }),
    guardianPhone: z.string().min(10, {
        message: "Phone number must be at least 10 digits.",
    }),
    guardianName: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    image: z.custom<Id<"_storage">>().optional(),
    currentClass: z.custom<Id<"classes">>(),
    gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
})


function CreateStudentForm({ onClose }: { onClose: () => void }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            guardianPhone: "",
            guardianName: "",
            bio: "",
            gender: "prefer_not_to_say",
        },
    })
    const [loader, setLoader] = useState<boolean>(false);
    // create the student action
    const createStudent = useAction(api.mutations.student.createStudent);
    // get the school domain
    const { domain } = useDomain()
    // get the schoolInfo which includes the id,
    const schoolInfo = useQuery(api.queries.school.findSchool, {
        domain,
    });
    // used to upload media to convex storage
    const generateUploadUrl = useMutation(api.mutations.user.generateUploadUrl);

   // TODO: to search for a class, this should be done later , in the form
     const [classesSearch, setClassesSearch] = useState("");
     // get the classes in the school
     const {
       results: classes,
       status,
       loadMore,
     } = usePaginatedQuery(
       api.queries.class.getClassesData,
       domain ? { domain, search: classesSearch } : "skip",
       { initialNumItems: 12 },
     );
    // convex auth
    const { signIn } = useAuthActions();


    // create the teacher function
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!schoolInfo?.id) {
            toast.error("Could not get school info.");
            return;
        }
        setLoader(true);
        let newValues = { ...values };
        delete newValues.profilePicture;  // Remove profilePicture initially

        if (values?.profilePicture?.type) {
            const postUrl = await generateUploadUrl();
            // Step 2: POST the file to the URL
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": values.profilePicture.type },
                body: values.profilePicture,
            });
            const { storageId } = await result.json();
            const storage: Id<"_storage"> = storageId
            newValues = {
                ...newValues,
                image: storage
            }
        }

        try {
            // add the teacher profile to convex
            const fd = new FormData();
            fd.append("email", newValues.email);

            void signIn("resend-otp", fd).then(async () => {
                // create the teacher here
                await createStudent({
                    ...newValues,
                    schoolId: schoolInfo?.id,
                })
            });

            toast.success("Successfully Created Teacher, email and password sent")
            setLoader(false);
            onClose()
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* the teacher's name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* the teacher's email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="johndoe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* basically just the field for the teacher's phone entry */}
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+1234567890" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* basically The guardian's phone number */}
                    <FormField
                        control={form.control}
                        name="guardianPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Guardian Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+1234567890" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* basically the guardian name */}
                    <FormField
                        control={form.control}
                        name="guardianName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Guardian Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Guardian Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* basically just the field for the gender */}
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="male" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Male
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="female" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Female
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="other" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Other
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="prefer_not_to_say" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Prefer not to say
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                {/* the student address field*/}
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Student's address" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter Student Address
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* this is essentially just the description of the teacher */}
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="If there is any student's information , please write here..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* add a profile picture for the teacher */}
                <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                            <FormLabel>Profile Picture</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        onChange(file)
                                    }}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Upload a profile picture (max 5MB).
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* input to assign a class to the student */}
                <FormField
                    control={form.control}
                    name="currentClass"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Class of the student</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a class" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {classes?.map((c) => (
                                        <SelectItem key={c._id} value={c._id}>
                                            {c.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>Select class you want to assign to the student</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="bg-[#11321f]/80 hover:bg-[#11321f]/50">
                        {
                            loader ? (<TbLoader3 className="text-white w-7 h-7 animate-spin" />) : "Add Teacher"
                        }
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CreateStudentForm;
