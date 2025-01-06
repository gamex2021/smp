import { mockConversations, mockMessages, mockUser } from '@/app/config/siteConfig'
import { RoleProtected } from '@/components/providers/role-protected'
import { MessagesContent } from '@/features/messages/components/messages-content'
import React, { Suspense } from 'react'

type Props = object

const page = (props: Props) => {
    return (
        <RoleProtected allowedRoles={['admin', 'teacher', 'student']}>
            <div className="h-[calc(100vh-70px)]">
                <Suspense>
                    <MessagesContent
                        initialConversations={mockConversations}
                        initialMessages={mockMessages}
                        currentUser={mockUser}
                    />
                </Suspense>
            </div>
        </RoleProtected>
    )
}

export default page