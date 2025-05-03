import { WorkspaceContent } from "@/features/learn/components/Workspace"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { api } from "~/_generated/api"
import { type Id } from "~/_generated/dataModel"

export const metadata: Metadata = {
    title: "Workspace | AI Study Assistant",
    description: "View and manage your workspace documents and learning materials",
}

type Params = Promise<{ id: Id<"workspace"> }>;

export default async function WorkspacePage({ params }: { params: Params }) {
    const { id } = await params;
    // get the workspace with fetchQuery since this is a server side component
    const workspace = await preloadQuery(api.queries.workspace.getWorkspaceById, {
        workspaceId: id
    }, { token: await convexAuthNextjsToken() },)


    return (
        <WorkspaceContent preloadedWorkspaces={workspace} />
    )
}

