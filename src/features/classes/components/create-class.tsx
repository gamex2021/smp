"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function CreateClassCard() {
    const handleAddClass = () => {
        console.log("Add new class");
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    onClick={handleAddClass}
                    className="flex min-h-[160px] w-full flex-col items-center justify-center rounded-lg bg-gray-200 p-4 transition-colors hover:bg-gray-300"
                >
                    <div className="mb-2 rounded-full bg-white p-3">
                        <Plus className="h-6 w-6 text-gray-600" />
                    </div>
                    <span className="text-gray-600">More</span>
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a class</DialogTitle>
                    <DialogDescription>
                        Create a class to assign a class teacher and students to.
                    </DialogDescription>
                </DialogHeader>
                <AddClassForm />
            </DialogContent>
        </Dialog>
    );
}

const FormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
});

export function AddClassForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast.success("Something triggered");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Class title</FormLabel>
                            <FormControl>
                                <Input placeholder="Physics" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
