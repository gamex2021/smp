/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, FolderPlus, Clock, Filter, BookAIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { showErrorToast } from "@/lib/handle-error"
import { useMutation, useQuery } from "convex/react"
import { api } from "~/_generated/api"
import { useDomain } from "@/context/DomainContext"
import Loader from "@/components/loader"
import { toast } from "sonner"


const workspaceSchema = z.object({
    name: z.string(),
    description: z.string()
})

type WorkspaceSchema = z.infer<typeof workspaceSchema>

interface Workspace {
    id: string
    title: string
    description: string
    documentCount: number
    lastUpdated: string
    thumbnail: string
}

export default function WorkspaceLibrary({ workspaces }: { workspaces: Workspace[] }) {
    const [activeTab, setActiveTab] = useState("all")
    const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false)
    const [loader, setLoader] = useState(false)
    // create workspace mutation
    const createWorkspace = useMutation(api.mutations.workspace.createWorkspace)
    // get user Id and school id
    const { school, user } = useDomain()
    // get workspaces
    const userWorkspaces = useQuery(api.queries.workspace.getStudentWorkspace, school && user ? {
        schoolId: school._id,
        studentId: user._id
    } : "skip")

    const form = useForm<WorkspaceSchema>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    }

    // function to create the workspace
    const handleSubmit = async (values: WorkspaceSchema) => {

        if (!school || !user) {
            showErrorToast("You do not have the required permission");
            return
        }
        setLoader(true)
        try {
            await createWorkspace({
                ...values,
                schoolId: school?._id,
                creatorId: user?._id
            })
            setIsNewWorkspaceModalOpen(false)
            form.reset();
            toast.success("Workspace Created")
        } catch (err) {
            showErrorToast(err)
        } finally {
            setLoader(false)
        }

    }
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Library</h2>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Recently Updated</DropdownMenuItem>
                            <DropdownMenuItem>Alphabetical</DropdownMenuItem>
                            <DropdownMenuItem>Most Documents</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" onClick={() => setIsNewWorkspaceModalOpen(true)}>
                        <FolderPlus className="h-4 w-4 mr-2" />
                        New Workspace
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="favorites">Favorites</TabsTrigger>
                    <TabsTrigger value="shared">Shared</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.div variants={item}>
                            <Dialog open={isNewWorkspaceModalOpen} onOpenChange={setIsNewWorkspaceModalOpen}>
                                <DialogTrigger asChild>
                                    <Card className="border-dashed cursor-pointer hover:border-primary/50 transition-colors group">
                                        <CardContent className="flex flex-col items-center justify-center h-[200px]">
                                            <Plus className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <p className="mt-4 text-muted-foreground group-hover:text-primary transition-colors">
                                                Create New Workspace
                                            </p>
                                        </CardContent>
                                    </Card>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create New Workspace</DialogTitle>
                                        <DialogDescription>Create a new workspace to organize your study materials</DialogDescription>
                                    </DialogHeader>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={
                                                    ({ field }) => <FormItem>
                                                        <FormLabel>Workspace Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="Enter workspace name" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                }
                                            />

                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={
                                                    ({ field }) => <FormItem>
                                                        <FormLabel>Workspace Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea {...field} placeholder="Enter workspace description" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                }
                                            />
                                            <Button disabled={loader} className="w-full">
                                                {
                                                    loader ? <Loader /> : "Create Workspace"
                                                }
                                            </Button>
                                        </form>
                                    </Form>

                                </DialogContent>
                            </Dialog>
                        </motion.div>

                        {Array.isArray(userWorkspaces) && userWorkspaces.map((workspace) => (
                            <motion.div key={workspace._id} variants={item}>
                                <Link href={`/learn/workspace/${workspace?.workspace?._id}`} key={workspace._id}>
                                    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                                        <div className="relative h-32 w-full overflow-hidden">
                                            <Image
                                                src={"/images/placeholder.svg"}
                                                alt={workspace.workspace?.name ?? "placeholder"}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {/* <BookAIcon /> */}
                                            {/* icon for the workspace */}
                                        </div>
                                        <CardHeader className="p-4 pb-2">
                                            <CardTitle className="text-lg">{workspace.workspace?.name}</CardTitle>
                                            <CardDescription className="line-clamp-2">{workspace.workspace?.description}</CardDescription>
                                        </CardHeader>
                                        <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                                            <span>{workspace.workspace?.documents?.length ?? 0} documents</span>
                                            <span className="flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {workspace?._creationTime ? new Date(workspace._creationTime as string | number | Date).toLocaleDateString() : "Invalid date"}
                                            </span>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </TabsContent>
                <TabsContent value="recent">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {workspaces
                            .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
                            .slice(0, 3)
                            .map((workspace) => (
                                <Card
                                    key={workspace.id}
                                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                                >
                                    <div className="relative h-32 w-full overflow-hidden">
                                        <Image
                                            src={"/images/placeholder.svg"}
                                            alt={workspace.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-lg">{workspace.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">{workspace.description}</CardDescription>
                                    </CardHeader>
                                    <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                                        <span>{workspace.documentCount} documents</span>
                                        <span className="flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {new Date(workspace.lastUpdated).toLocaleDateString()}
                                        </span>
                                    </CardFooter>
                                </Card>
                            ))}
                    </div>
                </TabsContent>
                <TabsContent value="favorites">
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">You haven&apos;t favorited any workspaces yet.</p>
                    </div>
                </TabsContent>
                <TabsContent value="shared">
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No shared workspaces found.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </section>
    )
}

