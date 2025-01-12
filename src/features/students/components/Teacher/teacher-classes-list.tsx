/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ClassCard } from "../../shared/class-card"
// import { StudentMoreCard } from "../../shared/student-class-more-card"



interface ClassesListProps {
    initialClasses: any[]
}

export function TeacherClassesList({ initialClasses }: ClassesListProps) {
    return (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {initialClasses.map((classItem) => (
                <ClassCard
                    key={classItem.id}
                    id={classItem.id}
                    name={classItem.name}
                    studentCount={classItem.groups.reduce((acc: number, group: any) => acc + group.studentCount, 0)}
                />
            ))}

            {/* I do not think we need a more card over here sha, a teacher cannot create a class. only an admin */}
            {/* <StudentMoreCard /> */}
        </div>
    )
}

