"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { type api } from "~/_generated/api";
import WorkspaceHeader from "./workspace-header";
import DocumentList from "./document-list";
import WorkspaceActions from "./workspace-actions";
import WorkspaceStats from "./workspace-stats";
import WorkspaceMembers from "./workspace-members";
import RecentWorkspaceActivity from "./workspace-activities";
import { notFound } from "next/navigation";

export function WorkspaceContent(props: {
    preloadedWorkspaces: Preloaded<typeof api.queries.workspace.getWorkspaceById>;
}) {
    const workspace = usePreloadedQuery(props.preloadedWorkspaces);
    // render `tasks`...

    if (!workspace) {
        notFound()
    }
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <WorkspaceHeader workspace={workspace} />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <DocumentList workspaceId={workspace._id} />
                        <WorkspaceActions workspaceId={workspace.id} />
                    </div>
                    <div className="space-y-8">
                        <WorkspaceStats stats={workspace.stats} />
                        <WorkspaceMembers members={workspace.members} />
                        <RecentWorkspaceActivity workspaceId={workspace._id} />
                    </div>
                </div>
            </main>
        </div>
    )
}