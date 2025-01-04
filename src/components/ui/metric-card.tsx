import { type LucideIcon } from 'lucide-react'
import { Card } from "./card"

interface MetricCardProps {
    icon: LucideIcon
    title: string
    value: string | number
    subtitle?: string
}

export function MetricCard({ icon: Icon, title, value, subtitle }: MetricCardProps) {
    return (
        <Card className="bg-[#2E8B57] text-white overflow-hidden">
            <div className="p-6 flex flex-col gap-4">
                <div className="bg-white rounded-full p-6 w-fit">
                    <Icon className="w-6 h-6 text-[#2E8B57]" />
                </div>
                <div className="space-y-1">
                    <p className=" font-semibold text-[16px] leading-[30.42px] text-[#F8FBFA]">{title}</p>
                    <p className="text-[#C4DFD0] text-[14px] font-semibold">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-white/60">{subtitle}</p>
                    )}
                </div>
            </div>
        </Card>
    )
}

