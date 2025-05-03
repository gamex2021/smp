"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import DeleteStudentModal from "../delete-student-modal"
import { useAction } from "convex/react"
import { toast } from "sonner"

// Mock the necessary modules
jest.mock("convex/react", () => ({
    useAction: jest.fn(),
}))

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}))

jest.mock("@/context/DomainContext", () => ({
    useDomain: jest.fn(() => ({ domain: "test.com" })),
}))

const mockStudent = {
    _id: "test-id",
    name: "Test Student",
    email: "test@example.com",
    schoolId: "school-id",
}

const mockOnClose = jest.fn()
const mockDeleteStudent = jest.fn()

describe("DeleteStudentModal", () => {
    beforeEach(() => {
        jest.clearAllMocks()
            ; (useAction as jest.Mock).mockReturnValue(mockDeleteStudent)
    })

    it("renders the delete student modal", () => {
        render(<DeleteStudentModal isOpen={true} onClose={mockOnClose} student={mockStudent} />)

        expect(screen.getByText("Delete Student")).toBeInTheDocument()
        expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument()
        expect(screen.getByText(/test@example.com/i)).toBeInTheDocument()
    })

    it("disables delete button when email confirmation does not match", () => {
        render(<DeleteStudentModal isOpen={true} onClose={mockOnClose} student={mockStudent} />)

        const deleteButton = screen.getByRole("button", { name: /delete student/i })
        expect(deleteButton).toBeDisabled()

        const input = screen.getByPlaceholderText("test@example.com")
        fireEvent.change(input, { target: { value: "wrong@example.com" } })

        expect(deleteButton).toBeDisabled()
    })

    it("enables delete button when email confirmation matches", () => {
        render(<DeleteStudentModal isOpen={true} onClose={mockOnClose} student={mockStudent} />)

        const deleteButton = screen.getByRole("button", { name: /delete student/i })
        expect(deleteButton).toBeDisabled()

        const input = screen.getByPlaceholderText("test@example.com")
        fireEvent.change(input, { target: { value: "test@example.com" } })

        expect(deleteButton).not.toBeDisabled()
    })

    it("calls deleteStudent when delete button is clicked with correct email", async () => {
        mockDeleteStudent.mockResolvedValue({ success: true })

        render(<DeleteStudentModal isOpen={true} onClose={mockOnClose} student={mockStudent} />)

        const input = screen.getByPlaceholderText("test@example.com")
        fireEvent.change(input, { target: { value: "test@example.com" } })

        const deleteButton = screen.getByRole("button", { name: /delete student/i })
        fireEvent.click(deleteButton)

        await waitFor(() => {
            expect(mockDeleteStudent).toHaveBeenCalledWith({
                studentId: "test-id",
                schoolId: "school-id",
            })
            expect(toast.success).toHaveBeenCalledWith("Student deleted successfully")
            expect(mockOnClose).toHaveBeenCalled()
        })
    })

    it("shows error toast when deletion fails", async () => {
        const error = new Error("Failed to delete")
        mockDeleteStudent.mockRejectedValue(error)

        render(<DeleteStudentModal isOpen={true} onClose={mockOnClose} student={mockStudent} />)

        const input = screen.getByPlaceholderText("test@example.com")
        fireEvent.change(input, { target: { value: "test@example.com" } })

        const deleteButton = screen.getByRole("button", { name: /delete student/i })
        fireEvent.click(deleteButton)

        await waitFor(() => {
            expect(mockDeleteStudent).toHaveBeenCalledWith({
                studentId: "test-id",
                schoolId: "school-id",
            })
            expect(toast.error).toHaveBeenCalledWith("Failed to delete")
            expect(mockOnClose).not.toHaveBeenCalled()
        })
    })

    it("closes the modal when cancel button is clicked", () => {
        render(<DeleteStudentModal isOpen={true} onClose={mockOnClose} student={mockStudent} />)

        const cancelButton = screen.getByRole("button", { name: /cancel/i })
        fireEvent.click(cancelButton)

        expect(mockOnClose).toHaveBeenCalled()
    })
})
