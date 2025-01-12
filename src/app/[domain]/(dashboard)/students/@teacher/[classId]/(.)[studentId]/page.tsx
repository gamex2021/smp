import { TeacherStudentModalWrapper } from "@/features/students/components/Teacher/teacher-student-modal-wrapper"


async function getStudentData(studentId: string) {
    // In a real application, this would be an API call or database query
    return {
        id: studentId,
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
}

export default async function StudentModal({
    params
}: {
    params: { studentId: string, classId: string }
}) {
    const student = await getStudentData(params.studentId)

    return <TeacherStudentModalWrapper student={student} />
}

