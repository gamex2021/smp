/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import TeacherActions from "../teacher-actions"

// Mock the necessary modules and components
jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}))

jest.mock("convex/react", () => ({
    useAction: jest.fn(),
    useMutation: jest.fn(),
    useQuery: jest.fn(() => []),
}))

jest.mock("@/context/DomainContext", () => ({
    useDomain: jest.fn(() => ({ domain: "test.com" })),
}))

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}))

// Mock the EditTeacherModal and DeleteTeacherModal
jest.mock("../edit-teacher-modal", () => ({
    __esModule: true,
    default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
        isOpen ? (
            <div data-testid="edit-modal">
                <button onClick={onClose}>Close</button>
            </div>
        ) : null,
}))

jest.mock("../delete-teacher-modal", () => ({
    __esModule: true,
    default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
        isOpen ? (
            <div data-testid="delete-modal">
                <button onClick={onClose}>Close</button>
            </div>
        ) : null,
}))

const mockTeacher = {
    _id: "test-id",
    name: "Test Teacher",
    email: "test@example.com",
    image: "https://example.com/image.jpg",
    assignedClasses: [{ _id: "class-1", title: "JSS1" }],
    subjects: [{ _id: "subject-1", name: "Mathematics" }],
}

describe("TeacherActions", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("renders dropdown menu trigger", () => {
        render(<TeacherActions teacher={mockTeacher} />)
        const trigger = screen.getByRole("button", { name: /options/i })
        expect(trigger).toBeInTheDocument()
    })

    it("opens dropdown menu when trigger is clicked", () => {
        render(<TeacherActions teacher={mockTeacher} />)
        const trigger = screen.getByRole("button", { name: /options/i })

        fireEvent.click(trigger)

        expect(screen.getByText("Actions")).toBeInTheDocument()
        expect(screen.getByText("Edit")).toBeInTheDocument()
        expect(screen.getByText("Delete")).toBeInTheDocument()
    })

    it("opens edit modal when edit action is clicked", async () => {
        render(<TeacherActions teacher={mockTeacher} />)
        const trigger = screen.getByRole("button", { name: /options/i })

        fireEvent.click(trigger)
        fireEvent.click(screen.getByText("Edit"))

        expect(screen.getByTestId("edit-modal")).toBeInTheDocument()
    })

    it("opens delete modal when delete action is clicked", async () => {
        render(<TeacherActions teacher={mockTeacher} />)
        const trigger = screen.getByRole("button", { name: /options/i })

        fireEvent.click(trigger)
        fireEvent.click(screen.getByText("Delete"))

        expect(screen.getByTestId("delete-modal")).toBeInTheDocument()
    })

    it("closes modals when close button is clicked", async () => {
        render(<TeacherActions teacher={mockTeacher} />)
        const trigger = screen.getByRole("button", { name: /options/i })

        // Open and close edit modal
        fireEvent.click(trigger)
        fireEvent.click(screen.getByText("Edit"))
        expect(screen.getByTestId("edit-modal")).toBeInTheDocument()

        fireEvent.click(screen.getByText("Close"))
        await waitFor(() => {
            expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument()
        })

        // Open and close delete modal
        fireEvent.click(trigger)
        fireEvent.click(screen.getByText("Delete"))
        expect(screen.getByTestId("delete-modal")).toBeInTheDocument()

        fireEvent.click(screen.getByText("Close"))
        await waitFor(() => {
            expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument()
        })
    })
})
