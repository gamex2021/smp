'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ProfileHeader } from './profile-header'
import { EditableInput } from './editable-input'
import { LocationSelect } from './location-select'
import { mockUser } from '@/app/config/siteConfig'

interface UserSettings {
    firstName: string
    lastName: string
    email: string
    password: string
    school: string
    location: string
}

export function SettingsForm() {
    const [settings, setSettings] = useState<UserSettings>({
        firstName: 'Emmanuel',
        lastName: 'Adeshina',
        email: 'emmanueladeshina@gmail.com',
        password: '••••••••••',
        school: 'Greenfield Academy',
        location: 'Nigeria'
    })

    const handleSave = () => {
        // Handle save logic here
        console.log('Saving settings:', settings)
    }

    const handleCancel = () => {
        // Handle cancel logic here
        console.log('Cancelling changes')
    }

    const handleChange = (field: keyof UserSettings, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="space-y-8">
            <ProfileHeader
                name={`${settings.firstName} ${settings.lastName}`}
                email={settings.email}
                role={mockUser?.role}
            />

            <div className="grid gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    <EditableInput
                        label="First Name"
                        value={settings.firstName}
                        onChange={(value) => handleChange('firstName', value)}
                    />
                    <EditableInput
                        label="Last Name"
                        value={settings.lastName}
                        onChange={(value) => handleChange('lastName', value)}
                    />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <EditableInput
                        label="E-mail"
                        value={settings.email}
                        onChange={(value) => handleChange('email', value)}
                    />
                    <EditableInput
                        label="Password"
                        type="password"
                        value={settings.password}
                        onChange={(value) => handleChange('password', value)}
                    />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <EditableInput
                        label="School"
                        value={settings.school}
                        onChange={(value) => handleChange('school', value)}
                    />
                    <LocationSelect
                        value={settings.location}
                        onChange={(value) => handleChange('location', value)}
                    />
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={handleSave}
                        className="bg-[#2E8B57] hover:bg-[#2E8B57]/90 text-white"
                    >
                        Save
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}

