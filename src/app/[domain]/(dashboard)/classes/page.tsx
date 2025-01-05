
import { mockClasses } from '@/app/config/siteConfig'
import { RoleProtected } from '@/components/providers/role-protected'
import { ClassCard } from '@/features/classes/components/classes-card'
import { CreateClassCard } from '@/features/classes/components/create-class'
import { SearchHeader } from '@/features/classes/components/search-header'


export default function ClassesPage() {

    return (
        // only the admin have access to the classes route
        <RoleProtected allowedRoles={['admin']}>
            <div className="p-6 max-w-[1600px] mx-auto">
                <SearchHeader />

                {/* Classes Grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mockClasses.map((classItem) => (
                        <ClassCard
                            key={classItem.id}
                            name={classItem.name}
                            teacher={classItem.teacher}
                            students={classItem.students}
                        />
                    ))}
                    <CreateClassCard />
                </div>
            </div>
        </RoleProtected>

    )
}

