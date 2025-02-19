import { RoleProtected } from '@/components/providers/role-protected'
import { SettingsForm } from '@/features/settings/components/settings-form'
import React, { Suspense } from 'react'

type Props = object

const page = (props: Props) => {
    return (
        <RoleProtected allowedRoles={['ADMIN', 'TEACHER', 'STUDENT']}>
            <div className="mx-auto max-w-[1600px] p-6">
                <Suspense fallback={<div>Loading settings...</div>}>
                    <SettingsForm />
                </Suspense>
                <p className="mt-8 text-end text-sm text-gray-500">
                    Last login at 13:45pm, 12/04/2023
                </p>
            </div>
        </RoleProtected>
    )
}

export default page