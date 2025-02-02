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
import { useAction, useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { TbLoader3 } from "react-icons/tb"
import { toast } from "sonner"
import * as z from "zod"
import { api } from "~/_generated/api"
import { type Id } from "~/_generated/dataModel"



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
    qualifications: z.string().min(1, {
        message: "Please enter qualifications.",
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
    image: z.custom<Id<"_storage">>().optional(),
    isClassTeacher: z.boolean(),
    subjects: z.array(z.object({ subject: z.custom<Id<"subjects">>(), classes: z.custom<Id<"classes">>() })).optional(),
    classAssigned: z.array(z.custom<Id<"classes">>()),
    gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
})


function CreateTeacherForm({ onClose }: { onClose: () => void }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            classAssigned: [],
            qualifications: "",
            bio: "",
            isClassTeacher: false,
            gender: "prefer_not_to_say",
        },
    })
    const [loader, setLoader] = useState<boolean>(false);
    // create the teacher action
    const createTeacher = useAction(api.mutations.teacher.createTeacher);
    // get the school domain
    const { domain } = useDomain()
    // get the schoolInfo which includes the id,
    const schoolInfo = useQuery(api.queries.school.findSchool, {
        domain,
    });
    // used to upload media to convex storage
    const generateUploadUrl = useMutation(api.mutations.user.generateUploadUrl);
    // get the subjects in the school from the subjectteacher schema which includes the subject, class and the teacher, it is basically just a conjunction schem
    const subjectsQuery = useQuery(api.queries.subject.getSTC, {
        domain,
    });
    // get the classes in the school
    const classesQuery = useQuery(api.queries.class.getClassesData, {
        domain,
    });


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
            // create the teacher here
            await createTeacher({
                ...newValues,
                schoolId: schoolInfo?.id,
            })
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

                {/* this is the field where the admin can assign subjects to the teacher basically, but this will be class based, for example if the teacher teaches 
                   ss2 mathematics, then the admin will choose ss2 mathematics in the field, then the teacher will be joined to the subjectteachers schema which contains 
                   the class, subject and the teacher.also this data for this field is being gotten from the subjectteachers schema
                */}
                <FormField
                    control={form.control}
                    name="subjects"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subjects</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    options={subjectsQuery?.map(c => ({
                                        label: `${c?.currentClass?.title} ${c?.currentSubject?.name}`,
                                        value: JSON.stringify({ subject: c?.currentSubject?._id, classes: c?.currentClass?._id })
                                    })) ?? []}
                                    selected={field?.value?.map(item => JSON.stringify(item)) ?? []}
                                    onChange={(values) => {
                                        const parsedValues = values.map((value: string) => JSON.parse(value) as { subject: Id<"subjects">, classes: Id<"classes"> });
                                        field.onChange(parsedValues);
                                    }}
                                    placeholder="Select subjects and classes"
                                />
                            </FormControl>
                            <FormDescription>
                                Subjects Assigned to the teacher
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* the teacher qualifications field , example entry is like bsc, msc etc */}
                <FormField
                    control={form.control}
                    name="qualifications"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Qualifications</FormLabel>
                            <FormControl>
                                <Input placeholder="B.Sc., M.Sc., Ph.D." {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter qualifications separated by commas.
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
                                    placeholder="Tell us about the teacher's experience and expertise..."
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

                {/* choose if they are a class teacher or not */}
                <FormField
                    control={form.control}
                    name="isClassTeacher"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Class Teacher
                                </FormLabel>
                                <FormDescription>
                                    Is this teacher assigned as a class teacher?
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                {/* if they are a class teacher then show this */}
                {form.watch("isClassTeacher") && (
                    <FormField
                        control={form.control}
                        name="classAssigned"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Classes</FormLabel>
                                <FormControl>
                                    <MultiSelect
                                        selected={field.value}
                                        options={classesQuery?.map(c => ({ label: c.title, value: c._id })) ?? []}
                                        onChange={(values) => field.onChange(values)}
                                        placeholder="Select classes"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Select classes you want to assign to the teacher
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
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

export default CreateTeacherForm;
