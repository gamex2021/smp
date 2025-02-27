"use client"
import { toast } from "sonner"

export function useNotify() {

    const notify = {
        success: (message: string) => {
            toast.success(message)
        },
        error: (message: string) => {
            toast.error(message)
        },
    }

    return notify
}

