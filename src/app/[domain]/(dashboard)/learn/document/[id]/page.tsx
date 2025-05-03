import DocumentHeader from "@/features/learn/components/Document/document-header"
import DocumentSidebar from "@/features/learn/components/Document/document-sidebar"
import DocumentViewer from "@/features/learn/components/Document/document-viewer"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
    title: "Document Viewer | AI Study Assistant",
    description: "View and study your document with AI-powered tools",
}

// This would be a server-side data fetch in a real implementation
async function getDocument(id: string) {
    // Mock data
    const documents = [
        {
            id: "1",
            title: "Cell Structure and Function",
            type: "pdf",
            size: "2.4 MB",
            uploadedAt: "2023-05-10T14:30:00Z",
            workspaceId: "1",
            workspaceTitle: "Biology 101",
            content: "This is a sample document about cell structure and function...",
            pages: 24,
            annotations: [
                {
                    id: "1",
                    text: "Important concept about cell membranes",
                    page: 3,
                    position: { x: 120, y: 250 },
                    color: "yellow",
                },
                {
                    id: "2",
                    text: "Remember this for the exam",
                    page: 8,
                    position: { x: 200, y: 150 },
                    color: "green",
                },
            ],
        },
        {
            id: "9",
            title: "DNA Replication",
            type: "docx",
            size: "1.8 MB",
            uploadedAt: "2023-05-12T09:15:00Z",
            workspaceId: "1",
            workspaceTitle: "Biology 101",
            content: "This is a sample document about DNA replication...",
            pages: 18,
            annotations: [],
        },
    ]

    const document = documents.find((doc) => doc.id === id)
    if (!document) return null

    return document
}

export default async function DocumentPage({ params }: { params: { id: string } }) {
    const document = await getDocument(params.id)

    if (!document) {
        notFound()
    }

    return (
        <div className="flex flex-col h-screen">
            <DocumentHeader document={document} />
            <div className="flex flex-1 overflow-hidden">
                <DocumentViewer document={document} />
                <DocumentSidebar document={document} />
            </div>
        </div>
    )
}

