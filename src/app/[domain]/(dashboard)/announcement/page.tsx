import { RoleProtected } from '@/components/providers/role-protected'
import AdminAnnouncements from '@/features/announcement/components/admin-announcements'
import { Suspense } from 'react'

type Props = object

const page = (props: Props) => {
    return (
        <RoleProtected allowedRoles={['ADMIN', 'TEACHER', 'STUDENT']}>
            <div className="p-6 max-w-[1600px] mx-auto space-y-8">
                <Suspense >
                    {/* <AnnouncementContent
                        initialAnnouncements={mockAnnouncements}
                        initialEvents={mockEvents}
                    /> */}
                    <AdminAnnouncements />
                </Suspense>
            </div>
        </RoleProtected>
    )
}

export default page