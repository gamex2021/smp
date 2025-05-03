"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import DeleteSubjectModal from "../delete-subject-modal"
import { useMutation } from "convex/react"
import { toast } from "sonner"

// Mock the necessary modules
jest.mock("convex/react", () => ({
    useMutation: jest.fn(),
    useQuery: jest.fn(() => ({ id: "school-id" })),
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

const mockSubject = {
    _id: "test-id",
    name: "Mathematics",
    category: "Mathematics",
    description: "Basic mathematics course",
    isCore: true,
    isActive: true,
}

const mockOnClose = jest.fn()
const mockDeleteSubject = jest.fn()

describe("DeleteSubjectModal", () => {
    beforeEach(() => {
        jest.clearAllMocks()
            ; (useMutation as jest.Mock).mockReturnValue(mockDeleteSubject)
    })

    it("renders the delete subject modal", () => {
        render(<DeleteSubjectModal isOpen={true} onClose={mockOnClose} subject={mockSubject} />)

        expect(screen.getByText("Delete Subject")).toBeInTheDocument()
        expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument()
        expect(screen.getByText(/Mathematics/i)).toBeInTheDocument()
    })

    it("disables delete button when name confirmation does not match", () => {
        render(<DeleteSubjectModal isOpen={true} onClose={mockOnClose} subject={mockSubject} />)

        const deleteButton = screen.getByRole("button", { name: /delete subject/i })
        expect(deleteButton).toBeDisabled()

        const input = screen.getByPlaceholderText("Mathematics")
        fireEvent.change(input, { target: { value: "Wrong Name" } })

        expect(deleteButton).toBeDisabled()
    })

    it("enables delete button when name confirmation matches", () => {
        render(<DeleteSubjectModal isOpen={true} onClose={mockOnClose} subject={mockSubject} />)

        const deleteButton = screen.getByRole("button", { name: /delete subject/i })
        expect(deleteButton).toBeDisabled()

        const input = screen.getByPlaceholderText("Mathematics")
        fireEvent.change(input, { target: { value: "Mathematics" } })

        expect(deleteButton).not.toBeDisabled()
    })

    it("calls deleteSubject when delete button is clicked with correct name", async () => {
        mockDeleteSubject.mockResolvedValue({ success: true })

        render(<DeleteSubjectModal isOpen={true} onClose={mockOnClose} subject={mockSubject} />)

        const input = screen.getByPlaceholderText("Mathematics")
        fireEvent.change(input, { target: { value: "Mathematics" } })

        const deleteButton = screen.getByRole("button", { name: /delete subject/i })
        fireEvent.click(deleteButton)

        await waitFor(() => {
            expect(mockDeleteSubject).toHaveBeenCalledWith({
                subjectId: "test-id",
                schoolId: "school-id",
            })
            expect(toast.success).toHaveBeenCalledWith("Subject deleted successfully")
            expect(mockOnClose).toHaveBeenCalled()
        })
    })

    it("shows error toast when deletion fails", async () => {
        const error = new Error("Failed to delete")
        mockDeleteSubject.mockRejectedValue(error)

        render(<DeleteSubjectModal isOpen={true} onClose={mockOnClose} subject={mockSubject} />)

        const input = screen.getByPlaceholderText("Mathematics")
        fireEvent.change(input, { target: { value: "Mathematics" } })

        const deleteButton = screen.getByRole("button", { name: /delete subject/i })
        fireEvent.click(deleteButton)

        await waitFor(() => {
            expect(mockDeleteSubject).toHaveBeenCalled()
            expect(toast.error).toHaveBeenCalledWith("Failed to delete")
            expect(mockOnClose).not.toHaveBeenCalled()
        })
    })

    it("closes the modal when cancel button is clicked", () => {
        render(<DeleteSubjectModal isOpen={true} onClose={mockOnClose} subject={mockSubject} />)

        const cancelButton = screen.getByRole("button", { name: /cancel/i })
        fireEvent.click(cancelButton)

        expect(mockOnClose).toHaveBeenCalled()
    })
})
