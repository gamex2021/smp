import { RoleProtected } from '@/components/providers/role-protected'
import React from 'react'

type Props = object

const page = (props: Props) => {
    return (
        // the role protected component is used to protect the page from roles that are not allowed to access the page
        <RoleProtected allowedRoles={['admin', 'teacher', 'student']}>
            <div>page</div>
        </RoleProtected>
    )
}

export default page