/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import { extractTextFromEditorJSON } from "../functions/extract-text-from-json";
import CustomScrollArea from "@/components/custom-scroll-area";

interface AnnouncementViewerProps {
    announcement: { _id: string; title: string; content: string; createdAt: string } | null
    isOpen: boolean
    onClose: () => void
}

export function AnnouncementViewer({ announcement, isOpen, onClose }: AnnouncementViewerProps) {

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{announcement?.title}</DialogTitle>
                </DialogHeader>
                <CustomScrollArea>
                    <div className="prose prose-sm max-w-none">
                        {extractTextFromEditorJSON(JSON.parse(announcement?.content ?? "[]"))}
                    </div>
                </CustomScrollArea>

            </DialogContent>
        </Dialog>
    )
}

