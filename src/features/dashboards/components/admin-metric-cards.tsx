import { MetricCard } from '@/components/ui/metric-card'
import { Banknote, NotebookTabs, UserPen, Users } from 'lucide-react'

type Props = object

const AdminMetricCards = (props: Props) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-7">
            <MetricCard
                icon={Users}
                title="Total number of students"
                value="1000"
            />
            <MetricCard
                icon={UserPen}
                title="Total number of teachers"
                value="1000"
            />
            <MetricCard
                icon={NotebookTabs}
                title="Total number of subjects"
                value="12"
            />
            <MetricCard
                icon={Banknote}
                title="Total revenue"
                value="₦1000"
            />
        </div>
    )
}

export default AdminMetricCards