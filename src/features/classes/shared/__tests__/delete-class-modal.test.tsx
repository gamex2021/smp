"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import DeleteClassModal from "../delete-class-modal"
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

const mockClass = {
  _id: "test-id",
  title: "JSS1",
  schoolId: "school-1",
}

const mockOnClose = jest.fn()
const mockDeleteClass = jest.fn()

describe("DeleteClassModal", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAction as jest.Mock).mockReturnValue(mockDeleteClass)
  })

  it("renders the delete class modal", () => {
    render(<DeleteClassModal isOpen={true} onClose={mockOnClose} classItem={mockClass} />)

    expect(screen.getByText("Delete Class")).toBeInTheDocument()
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument()
    expect(screen.getByText(/JSS1/i)).toBeInTheDocument()
  })

  it("disables delete button when title confirmation does not match", () => {
    render(<DeleteClassModal isOpen={true} onClose={mockOnClose} classItem={mockClass} />)

    const deleteButton = screen.getByRole("button", { name: /delete class/i })
    expect(deleteButton).toBeDisabled()

    const input = screen.getByPlaceholderText("JSS1")
    fireEvent.change(input, { target: { value: "Wrong Title" } })

    expect(deleteButton).toBeDisabled()
  })

  it("enables delete button when title confirmation matches", () => {
    render(<DeleteClassModal isOpen={true} onClose={mockOnClose} classItem={mockClass} />)

    const deleteButton = screen.getByRole("button", { name: /delete class/i })
    expect(deleteButton).toBeDisabled()

    const input = screen.getByPlaceholderText("JSS1")
    fireEvent.change(input, { target: { value: "JSS1" } })

    expect(deleteButton).not.toBeDisabled()
  })

  it("calls deleteClass when delete button is clicked with correct title", async () => {
    mockDeleteClass.mockResolvedValue({ success: true })

    render(<DeleteClassModal isOpen={true} onClose={mockOnClose} classItem={mockClass} />)

    const input = screen.getByPlaceholderText("JSS1")
    fireEvent.change(input, { target: { value: "JSS1" } })

    const deleteButton = screen.getByRole("button", { name: /delete class/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(mockDeleteClass).toHaveBeenCalledWith({
        classId: "test-id",
      })
      expect(toast.success).toHaveBeenCalledWith("Class deleted successfully")
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it("shows error toast when deletion fails", async () => {
    const error = new Error("Failed to delete")
    mockDeleteClass.mockRejectedValue(error)

    render(<DeleteClassModal isOpen={true} onClose={mockOnClose} classItem={mockClass} />)

    const input = screen.getByPlaceholderText("JSS1")
    fireEvent.change(input, { target: { value: "JSS1" } })

    const deleteButton = screen.getByRole("button", { name: /delete class/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(mockDeleteClass).toHaveBeenCalled()
      expect(toast.error).toHaveBeenCalledWith("Failed to delete")
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  it("closes the modal when cancel button is clicked", () => {
    render(<DeleteClassModal isOpen={true} onClose={mockOnClose} classItem={mockClass} />)

    const cancelButton = screen.getByRole("button", { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })
})
