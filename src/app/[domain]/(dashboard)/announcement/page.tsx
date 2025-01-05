import { mockAnnouncements, mockEvents } from '@/app/config/siteConfig'
import { RoleProtected } from '@/components/providers/role-protected'
import { AnnouncementContent } from '@/features/announcement/components/announcement-content'
import React, { Suspense } from 'react'

type Props = object

const page = (props: Props) => {
    return (
        <RoleProtected allowedRoles={['admin', 'teacher', 'student']}>
            <div className="p-6 max-w-[1600px] mx-auto space-y-8">
                <Suspense >
                    <AnnouncementContent
                        initialAnnouncements={mockAnnouncements}
                        initialEvents={mockEvents}
                    />
                </Suspense>
            </div>
        </RoleProtected>
    )
}

export default page