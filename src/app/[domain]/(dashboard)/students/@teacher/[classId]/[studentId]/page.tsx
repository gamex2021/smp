import { StudentDetails } from "@/features/students/shared/student-details"


export default function StudentPage({
    params
}: {
    params: { studentId: string, classId: string }
}) {
    // Fetch student data here
    const student = {
        id: params.studentId,
        name: "Phillip Abraham",
        gender: "Male",
        location: "Abuja",
        position: "First",
        email: "example@gmail.com",
        phone: "070-0341-2348",
        payment: "Payment Complete",
        parentPhone: "080-9210-5466",
        parentEmail: "example@gmail.com"
    }

    return <StudentDetails student={student} />
}

