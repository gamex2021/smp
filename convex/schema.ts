import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { metadata } from '../src/app/[domain]/(dashboard)/learn/tools/questions/page';

export default defineSchema({
  // Include authentication tables from @convex-dev/auth
  ...authTables,

  // =========================================================================
  // User Management
  // =========================================================================

  // User table: Stores information about all users in the system
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    password: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.optional(
      v.union(
        v.literal("ADMIN"),
        v.literal("STUDENT"),
        v.literal("TEACHER"),
        // v.literal("ACCOUNTANT"),  //edited this out , because the admin is essentially also an accountant, right bro?
      ),
    ),
    schoolId: v.optional(v.id("schools")),
    schoolName: v.optional(v.string()),
    username: v.optional(v.string()),
    phone: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phoneVerificationTime: v.optional(v.number()),
    qualifications: v.optional(v.string()),
    gender: v.optional(v.string()),
    bio: v.optional(v.string()),
    changedPassword: v.optional(v.boolean()), // this field is only specific to the teacher and student role, and will only be changed once. the default should be false. when they log in and it is false, then they are being forced to change their passwords, we can use middleware for this
    // Student-specific fields
    currentClass: v.optional(v.id("classes")),
    guardianName: v.optional(v.string()),
    guardianPhone: v.optional(v.string()),
    address: v.optional(v.string()),
    dob: v.optional(v.string()),
    favoriteWorkspaces: v.optional(v.array(v.id("workspace"))),
    shared: v.optional(v.array(v.id("workspace"))),
    recents: v.optional(v.array(v.id("workspace"))),
    searchableText: v.optional(v.string()),
    // Teacher-specific fields can be added here in the future
  })
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("by_school", ["schoolId", "role"])
    .index("by_class", ["currentClass"])
    .index("by_email_schoolId", ["email", "schoolId"])
    .searchIndex("search_user", {
      searchField: "searchableText",
      filterFields: ["schoolId"],
    }),

  // =========================================================================
  // School Management
  // =========================================================================

  // Schools table: Stores information about educational institutions
  schools: defineTable({
    name: v.string(),
    domain: v.string(),
    logo: v.optional(v.string()),
    email: v.optional(v.string()),
    motto: v.optional(v.string()),
    phone: v.optional(v.string()),
    type: v.string(),
    category: v.optional(v.string()),
    yearFounded: v.optional(v.number()),
    verified: v.boolean(),
    registeration_doc: v.string(),
    address: v.id("addresses"),
    user: v.optional(v.id("users")), // Reference to the user who created/manages the school
  }).index("by_domain", ["domain"]),



  // Landing Page Configuration
  landingPageConfig: defineTable({
    schoolId: v.id("schools"),
    theme: v.object({
      primaryColor: v.optional(v.string()),
      secondaryColor: v.optional(v.string()),
      accentColor: v.optional(v.string()),
      fontFamily: v.optional(v.string()),
      darkMode: v.optional(v.boolean()),
      buttonStyle: v.optional(v.union(v.literal("rounded"), v.literal("pill"), v.literal("square"))),
    }),
    logo: v.optional(v.id("_storage")),
    customCss: v.optional(v.string()),
    customJs: v.optional(v.string()),
    metaData: v.object({
      title: v.string(),
      description: v.string(),
      keywords: v.array(v.string()),
      ogImage: v.optional(v.id("_storage")),
    }),
    isActive: v.boolean(),
    lastUpdated: v.number(),
  }).index("by_school", ["schoolId"]),

  // Landing Page Sections
  landingPageSections: defineTable({
    schoolId: v.id("schools"),
    type: v.union(
      v.literal("hero"),
      v.literal("about"),
      v.literal("features"),
      v.literal("testimonials"),
      v.literal("stats"),
      v.literal("cta"),
      v.literal("contact"),
      v.literal("gallery"),
      v.literal("team"),
      v.literal("faq"),
      v.literal("admissions"),
      v.literal("custom")
    ),
    title: v.string(),
    subtitle: v.optional(v.string()),
    content: v.optional(v.string()),
    order: v.number(),
    isActive: v.boolean(),
    backgroundType: v.union(
      v.literal("color"),
      v.literal("gradient"),
      v.literal("image")
    ),
    backgroundColor: v.optional(v.string()),
    backgroundImage: v.optional(v.id("_storage")),
    backgroundGradient: v.optional(v.object({
      direction: v.string(),
      from: v.string(),
      to: v.string()
    })),
    media: v.optional(v.array(v.object({
      type: v.union(v.literal("image"), v.literal("video")),
      file: v.id("_storage"),
      alt: v.optional(v.string())
    }))),
    ctaButtons: v.optional(v.array(v.object({
      text: v.string(),
      link: v.string(),
      style: v.union(
        v.literal("primary"),
        v.literal("secondary"),
        v.literal("outline"),
        v.literal("ghost")
      ),
      icon: v.optional(v.string())
    }))),
    lastUpdated: v.number(),
    customFields: v.optional(v.record(v.string(), v.string())),
    animation: v.optional(v.string()),
  })
    .index("by_school", ["schoolId"])
    .index("by_school_and_type", ["schoolId", "type"])
    .index("by_school_and_order", ["schoolId", "order"]),

  // Testimonials
  testimonials: defineTable({
    schoolId: v.id("schools"),
    name: v.string(),
    role: v.string(),
    content: v.string(),
    avatar: v.optional(v.id("_storage")),
    rating: v.optional(v.number()),
    isActive: v.boolean(),
    order: v.number()
  }).index("by_school", ["schoolId"]),

  // FAQ Items
  faqItems: defineTable({
    schoolId: v.id("schools"),
    question: v.string(),
    answer: v.string(),
    category: v.optional(v.string()),
    isActive: v.boolean(),
    order: v.number()
  }).index("by_school", ["schoolId"]),

  // Contact Form Submissions
  contactSubmissions: defineTable({
    schoolId: v.id("schools"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    type: v.union(
      v.literal("general"),
      v.literal("admission"),
      v.literal("support"),
      v.literal("other")
    ),
    status: v.union(
      v.literal("new"),
      v.literal("inProgress"),
      v.literal("completed"),
      v.literal("archived")
    ),
    createdAt: v.string()
  }).index("by_school", ["schoolId"]),

  // create workspace table
  workspace: defineTable({
    name: v.string(),
    description: v.string(),
    schoolId: v.id("schools"),
    documents: v.optional(v.array(v.id("document"))),
    stats: v.optional(
      v.object({
        totalDocuments: v.number(),
        totalPages: v.number(),
        studyTime: v.string(),
        quizzesTaken: v.number(),
        averageScore: v.string(),
      }),
    ),
    lastUpdated: v.optional(v.string()),
  }),

  // documents schema
  document: defineTable({
    title: v.string(),
    file: v.id("_storage"),
    type: v.string(), //pdf, //docx , //pptx
    size: v.string(),
    workspaceId: v.optional(v.id("workspace")),
    userId: v.optional(v.id("user")),
    uploadedAt: v.string(),
    thumbnail: v.optional(v.string()),
  }).index("by_workspace", ["workspaceId"]),

  // the document chunk from its embedidng
  documentChunk: defineTable({
    documentId: v.id("document"),
    page: v.optional(v.number()),
    chunkIndex: v.optional(v.number()),
    content: v.optional(v.string()),
    embedding: v.array(v.float64()),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1024,
    filterFields: ["documentId", "page"],
  }),

  // worspace member
  workspaceMember: defineTable({
    workspaceId: v.id("workspace"),
    userId: v.id("users"),
    schoolId: v.id("schools"),
    role: v.union(v.literal("creator"), v.literal("member")),
  }).index("by_user", ["userId", "schoolId"]),

  // recent activity
  recentActivity: defineTable({
    type: v.union(
      v.literal("quiz_completed"),
      v.literal("document_uploaded"),
      v.literal("workspace_created"),
      v.literal("flashcard_session"),
    ),
    title: v.string(),
    date: v.string(),
    score: v.optional(v.number()),
    cardsReviewed: v.optional(v.number()),
    workspaceId: v.optional(v.id("workspace")), // to get recent activities of a workspace
    userId: v.optional(v.id("user")), // to get recent activities of a user
  }).index("by_workspace", ["workspaceId"]),

  // Addresses table: Stores detailed address information for schools
  addresses: defineTable({
    line1: v.string(),
    line2: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    postal_code: v.string(),
    country: v.string(),
  }),

  // =========================================================================
  // Academic Structure
  // =========================================================================

  // Classes table: Represents different classes or grade levels in a school
  classes: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    schoolId: v.id("schools"),
    isActive: v.optional(v.boolean()),
    capacity: v.optional(v.number()),
    searchableText : v.optional(v.string())
  }).index("by_schoolId", ["schoolId"])
  .searchIndex("search_user", {
    searchField: "searchableText",
    filterFields: ["schoolId"],
  }),

  // ClassTeacher junction table: Links teachers to their assigned classes
  classTeacher: defineTable({
    classId: v.optional(v.id("classes")),
    teacherId: v.id("users"),
    schoolId: v.id("schools"),
    searchableText : v.optional(v.string())
  })
    .index("by_school", ["schoolId"])
    .index("by_teacher", ["teacherId"])
    .index("by_class", ["classId"])
    .index("by_class_teacher", ["classId", "teacherId"])
    .searchIndex("search_user", {
      searchField: "searchableText",
      filterFields: ["schoolId"],
    }),

  // ClassStudent junction table: Links students to their enrolled classes
  classStudent: defineTable({
    classId: v.id("classes"),
    studentId: v.id("users"),
    schoolId: v.id("schools"),
    searchableText : v.optional(v.string())
  })
    .index("by_school", ["schoolId"])
    .index("by_student", ["studentId"])
    .index("by_class", ["classId"])
    .index("by_class_student", ["classId", "studentId"])
    .searchIndex("search_user", {
      searchField: "searchableText",
      filterFields: ["schoolId"],
    }),

  // Subjects table: Stores information about individual subjects
  subjects: defineTable({
    name: v.string(),
    originalName: v.string(), // Store the original predefined name
    description: v.string(),
    category: v.string(),
    schoolId: v.id("schools"),
    isCore: v.boolean(),
    searchableText: v.optional(v.string()),
    isActive: v.boolean(), // Schools can deactivate subjects
    // customFields can be added here for school-specific customizations
  })
    .index("by_school", ["schoolId"])
    .index("by_school_and_name", ["schoolId", "name"])
    .searchIndex("search_user", {
      searchField: "searchableText",
      filterFields: ["schoolId"],
    }),

  // SubjectTeachers junction table: Links subjects to teachers and classes
  subjectTeachers: defineTable({
    classId: v.id("classes"),
    subjectId: v.id("subjects"),
    teacherId: v.optional(v.id("users")),
    schoolId: v.id("schools"),
    schedule: v.optional(
      v.array(
        v.object({
          day: v.union(
            v.literal("monday"),
            v.literal("tuesday"),
            v.literal("wednesday"),
            v.literal("thursday"),
            v.literal("friday"),
          ),
          startTime: v.string(),
          endTime: v.string(),
        }),
      ),
    ),
  })
    .index("by_class", ["classId"])
    .index("by_subject", ["subjectId"])
    .index("by_teacher", ["teacherId"])
    .index("by_school", ["schoolId"])
    .index("by_class_and_subject", ["teacherId", "subjectId", "classId"])
    .index("by_subject_and_class", ["subjectId", "classId"]),

  // =========================================================================
  // Academic Operations
  // =========================================================================

  // Attendance table: Records student attendance
  attendance: defineTable({
    date: v.string(),
    classId: v.id("classes"),
    schoolId: v.id("schools"),
    studentId: v.id("users"),
    status: v.union(
      v.literal("present"),
      v.literal("absent"),
      v.literal("late"),
    ),
    markedById: v.id("users"), // teacher who marked attendance
  })
    .index("by_date_and_class", ["date", "classId"])
    .index("by_student_id", ["studentId"])
    .index("by_school_id", ["schoolId"]),

  // Announcements table: Stores school-wide announcements
  announcements: defineTable({
    schoolId: v.id("schools"),
    title: v.string(),
    content: v.string(),
    createdBy: v.id("users"),
    createdAt: v.string(),
    updatedAt: v.optional(v.string()),
    // targetRoles can be added here to specify announcement recipients
  }).index("by_school_id", ["schoolId"]),

  // Groups table: Represents various groups within a school or class
  groups: defineTable({
    title: v.string(),
    class: v.optional(v.id("classes")),
    school: v.optional(v.id("schools")),
  }).index("by_classId", ["class"]),

  // Terms Configuration table: Stores school-specific term structure
  academicConfig: defineTable({
    schoolId: v.id("schools"),
    academicYear: v.string(),
    numberOfTerms: v.number(),
    startDate: v.string(),
    endDate: v.string(),
    isActive: v.boolean(),
    autoTermProgression: v.boolean(),
    autoYearProgression: v.boolean(),
    currentTerm: v.object({
      termNumber: v.number(),
      name: v.string(),
      startDate: v.string(),
      endDate: v.string(),
      status: v.union(
        v.literal("upcoming"),
        v.literal("active"),
        v.literal("completed"),
      ),
    }),
    terms: v.array(
      v.object({
        termNumber: v.number(),
        name: v.string(),
        startDate: v.string(),
        endDate: v.string(),
        status: v.union(
          v.literal("upcoming"),
          v.literal("active"),
          v.literal("completed"),
        ),
      }),
    ),
    nextYearConfig: v.optional(
      v.object({
        academicYear: v.string(),
        startDate: v.string(),
        endDate: v.string(),
      }),
    ),
  })
    .index("by_school", ["schoolId"])
    .index("by_school_year", ["schoolId", "academicYear"]),

  // Class Fee Structure
  classFeeStructure: defineTable({
    schoolId: v.id("schools"),
    classId: v.id("classes"),
    academicYear: v.string(),
    termId: v.number(),
    fees: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        amount: v.number(),
        dueDate: v.string(),
        isCompulsory: v.boolean(),
        description: v.optional(v.string()),
        allowsInstallment: v.boolean(),
        installmentConfig: v.optional(
          v.object({
            minimumFirstPayment: v.number(),
            maximumInstallments: v.number(),
            installmentDueDates: v.array(v.string()),
          }),
        ),
        reminderDays: v.array(v.number()),
      }),
    ),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_school", ["schoolId"])
    .index("by_class_term", ["classId", "academicYear", "termId"]),

  payments: defineTable({
    schoolId: v.id("schools"),
    studentId: v.id("users"),
    classId: v.id("classes"),
    academicYear: v.string(),
    termId: v.number(),
    receiptNumber: v.string(),
    amount: v.number(),
    feeId: v.string(),
    feeName: v.string(),
    paymentDate: v.string(),
    dueDate: v.optional(v.string()),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("transfer"),
      v.literal("card"),
      v.literal("pos"),
      v.literal("cheque"),
    ),
    status: v.union(
      v.literal("success"),
      v.literal("pending"),
      v.literal("failed"),
    ),
    isInstallment: v.boolean(),
    installmentNumber: v.optional(v.number()),
    totalInstallments: v.optional(v.number()),
    description: v.optional(v.string()),
    metadata: v.optional(v.object({})),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  })
    .index("by_school", ["schoolId"])
    .index("by_student", ["studentId"])
    .index("by_receipt", ["receiptNumber"])
    .index("by_class_term", ["classId", "academicYear", "termId"]),

  // Outstanding Payments
  outstandingPayments: defineTable({
    schoolId: v.id("schools"),
    studentId: v.id("users"),
    classId: v.id("classes"),
    academicYear: v.string(),
    termId: v.number(),
    feeId: v.string(),
    feeName: v.string(),
    amount: v.number(),
    amountPaid: v.optional(v.number()),
    remainingAmount: v.optional(v.number()),
    dueDate: v.string(),
    isCompulsory: v.boolean(),
    lastReminderSent: v.optional(v.string()),
    nextReminderDate: v.optional(v.string()),
    status: v.union(
      v.literal("paid"),
      v.literal("unpaid"),
      v.literal("partial"),
      v.literal("overdue"),
    ),
    installmentStatus: v.optional(
      v.object({
        currentInstallment: v.number(),
        totalInstallments: v.number(),
        nextInstallmentDate: v.string(),
        nextInstallmentAmount: v.number(),
      }),
    ),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  })
    .index("by_school", ["schoolId"])
    .index("by_student", ["studentId"])
    .index("by_class_term", ["classId", "academicYear", "termId"])
    .index("by_due_date", ["dueDate"]),

  // Payment Notifications
  paymentNotifications: defineTable({
    schoolId: v.id("schools"),
    studentId: v.id("users"),
    outstandingPaymentId: v.id("outstandingPayments"),
    type: v.union(
      v.literal("reminder"),
      v.literal("overdue"),
      v.literal("receipt"),
      v.literal("installment_due"),
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("failed"),
    ),
    scheduledFor: v.optional(v.string()),
    sentAt: v.optional(v.string()),
    error: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_student", ["studentId"]),

  // Payment Templates
  paymentTemplates: defineTable({
    schoolId: v.id("schools"),
    name: v.string(),
    description: v.optional(v.string()),
    fees: v.array(
      v.object({
        name: v.string(),
        amount: v.number(),
        isCompulsory: v.boolean(),
        allowsInstallment: v.boolean(),
        installmentConfig: v.optional(
          v.object({
            minimumFirstPayment: v.number(),
            maximumInstallments: v.number(),
          }),
        ),
      }),
    ),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_school", ["schoolId"]),

  // Payment Audit Logs
  paymentAuditLogs: defineTable({
    schoolId: v.id("schools"),
    paymentId: v.optional(v.id("payments")),
    outstandingPaymentId: v.optional(v.id("outstandingPayments")),
    action: v.union(
      v.literal("payment_created"),
      v.literal("payment_updated"),
      v.literal("payment_deleted"),
      v.literal("reminder_sent"),
      v.literal("status_changed"),
    ),
    performedBy: v.id("users"),
    details: v.string(),
    timestamp: v.string(),
  }).index("by_school", ["schoolId"]),

  termProgressLogs: defineTable({
    schoolId: v.id("schools"),
    academicYear: v.string(),
    fromTerm: v.number(),
    toTerm: v.number(),
    progressedAt: v.string(),
    status: v.union(v.literal("success"), v.literal("failed")),
    error: v.optional(v.string()),
  }).index("by_school_year", ["schoolId", "academicYear"]),
});
