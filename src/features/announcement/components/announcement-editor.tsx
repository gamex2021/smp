/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import CustomScrollArea from "@/components/custom-scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDomain } from "@/context/DomainContext"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/core/style.css"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import { useCreateBlockNote } from "@blocknote/react"
import { useCompletion } from "ai/react"
import { useAction, useQuery } from "convex/react"
import { useEffect, useRef, useState } from "react"
import { ImMagicWand } from "react-icons/im"
import { api } from "~/_generated/api"

interface EditorProps {
    announcement?: any
    onComplete?: () => void
}

export function AnnouncementEditor({ announcement, onComplete }: EditorProps) {
    const [title, setTitle] = useState(announcement?.title || "")
    const editor = useCreateBlockNote({
        initialContent: announcement?.content ? JSON.parse(announcement.content) : undefined
    })
    const createAnnouncement = useAction(api.mutations.announcements.createAnnouncement)
    const updateAnnouncement = useAction(api.mutations.announcements.updateAnnouncement)
    // get the school domain
    const { domain } = useDomain()
    // get the schoolInfo which includes the id,
    const schoolInfo = useQuery(api.queries.school.findSchool, {
        domain,
    });
    // get current user
    const user = useQuery(api.queries.user.currentUser)
    const lastCompletionRef = useRef("")
    // the api endpoint
    const { complete, isLoading: isGenerating, completion } = useCompletion({
        api: "/api/generate",
        onError: (err: any) => {
            console.error("AI completion error:", err)
        }
    })

    // console.log("this is the completion basically", completion)

    const handleSave = async () => {
        try {
            const content = JSON.stringify(editor.document)

            if (announcement?._id) {
                await updateAnnouncement({
                    id: announcement._id,
                    title,
                    content
                })
            } else {
                if (schoolInfo?.id && user?._id) {
                    await createAnnouncement({
                        title,
                        content,
                        schoolId: schoolInfo?.id, // this is the school Id
                        createdBy: user?._id // this is the user ID
                    })
                }
            }
            onComplete?.()
        } catch (error) {
            console.error("Failed to save announcement:", error)
        }
    }

    useEffect(() => {
        if (completion) {
            // Get only the new content by comparing with the last completion
            const newContent = completion.slice(lastCompletionRef.current.length)
            if (newContent) {
                editor._tiptapEditor.commands.insertContent(newContent)
                lastCompletionRef.current = completion
            }
        }
    }, [completion, editor])

    const insertMagicAi = async () => {
        try {
            // Reset the last completion reference
            lastCompletionRef.current = ""

            const prevText = editor._tiptapEditor.state.doc.textBetween(
                Math.max(0, editor._tiptapEditor.state.selection.from - 5000),
                editor._tiptapEditor.state.selection.from - 1,
                "\n",
            )

            await complete(prevText)
        } catch (error) {
            console.error("AI completion failed:", error)
        }
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Announcement title"
                />
            </div>

            <div className="border rounded-lg">
                <div className="border-b bg-muted p-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={insertMagicAi}
                        disabled={isGenerating}
                    >
                        <ImMagicWand className="w-4 h-4 mr-2" />
                        {isGenerating ? "Generating..." : "AI Complete"}
                    </Button>
                </div>
                <CustomScrollArea>
                    <BlockNoteView
                        editor={editor}
                        theme="light"
                    />
                </CustomScrollArea>

            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onComplete}>
                    Cancel
                </Button>
                <Button onClick={handleSave}>
                    {announcement ? "Update" : "Create"} Announcement
                </Button>
            </div>
        </div>
    )
}

