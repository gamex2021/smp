import { MetricCard } from '@/components/ui/metric-card'
import { NotebookTabs, Users } from 'lucide-react'

type Props = object

const TeacherMetricCards = (props: Props) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-7">
            <MetricCard
                icon={Users}
                title="Total number of students"
                value="1000"
            />
            <MetricCard
                icon={NotebookTabs}
                title="Class in charge of"
                value="Class 1"
            />
            <MetricCard
                icon={NotebookTabs}
                title="Total number of subjects"
                value="12"
            />
            {/* big man we can add more metric cards here when we think of more  */}
        </div>
    )
}

export default TeacherMetricCards