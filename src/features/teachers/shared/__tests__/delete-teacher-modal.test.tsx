"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import DeleteTeacherModal from "../delete-teacher-modal"
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

const mockTeacher = {
    _id: "test-id",
    name: "Test Teacher",
    email: "test@example.com",
}

const mockOnClose = jest.fn()
const mockDeleteTeacher = jest.fn()

describe("DeleteTeacherModal", () => {
    beforeEach(() => {
        jest.clearAllMocks()
            ; (useAction as jest.Mock).mockReturnValue(mockDeleteTeacher)
    })

    it("renders the delete teacher modal", () => {
        render(<DeleteTeacherModal isOpen={true} onClose={mockOnClose} teacher={mockTeacher} />)

        expect(screen.getByText("Delete Teacher")).toBeInTheDocument()
        expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument()
        expect(screen.getByText(/test@example.com/i)).toBeInTheDocument()
    })

    it("disables delete button when email confirmation does not match", () => {
        render(<DeleteTeacherModal isOpen={true} onClose={mockOnClose} teacher={mockTeacher} />)

        const deleteButton = screen.getByRole("button", { name: /delete teacher/i })
        expect(deleteButton).toBeDisabled()

        const input = screen.getByPlaceholderText("test@example.com")
        fireEvent.change(input, { target: { value: "wrong@example.com" } })

        expect(deleteButton).toBeDisabled()
    })

    it("enables delete button when email confirmation matches", () => {
        render(<DeleteTeacherModal isOpen={true} onClose={mockOnClose} teacher={mockTeacher} />)

        const deleteButton = screen.getByRole("button", { name: /delete teacher/i })
        expect(deleteButton).toBeDisabled()

        const input = screen.getByPlaceholderText("test@example.com")
        fireEvent.change(input, { target: { value: "test@example.com" } })

        expect(deleteButton).not.toBeDisabled()
    })

    it("calls deleteTeacher when delete button is clicked with correct email", async () => {
        mockDeleteTeacher.mockResolvedValue({ success: true })

        render(<DeleteTeacherModal isOpen={true} onClose={mockOnClose} teacher={mockTeacher} />)

        const input = screen.getByPlaceholderText("test@example.com")
        fireEvent.change(input, { target: { value: "test@example.com" } })

        const deleteButton = screen.getByRole("button", { name: /delete teacher/i })
        fireEvent.click(deleteButton)

        await waitFor(() => {
            expect(mockDeleteTeacher).toHaveBeenCalledWith({ teacherId: "test-id" })
            expect(toast.success).toHaveBeenCalledWith("Teacher deleted successfully")
            expect(mockOnClose).toHaveBeenCalled()
        })
    })

    it("shows error toast when deletion fails", async () => {
        const error = new Error("Failed to delete")
        mockDeleteTeacher.mockRejectedValue(error)

        render(<DeleteTeacherModal isOpen={true} onClose={mockOnClose} teacher={mockTeacher} />)

        const input = screen.getByPlaceholderText("test@example.com")
        fireEvent.change(input, { target: { value: "test@example.com" } })

        const deleteButton = screen.getByRole("button", { name: /delete teacher/i })
        fireEvent.click(deleteButton)

        await waitFor(() => {
            expect(mockDeleteTeacher).toHaveBeenCalledWith({ teacherId: "test-id" })
            expect(toast.error).toHaveBeenCalledWith("Failed to delete")
            expect(mockOnClose).not.toHaveBeenCalled()
        })
    })

    it("closes the modal when cancel button is clicked", () => {
        render(<DeleteTeacherModal isOpen={true} onClose={mockOnClose} teacher={mockTeacher} />)

        const cancelButton = screen.getByRole("button", { name: /cancel/i })
        fireEvent.click(cancelButton)

        expect(mockOnClose).toHaveBeenCalled()
    })
})
