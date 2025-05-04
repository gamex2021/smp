// Dummy Subjects
export const dummySubjects = [
    {
      id: "sub1",
      name: "Mathematics",
      code: "MATH101",
      teacher: "Dr. Alan Turing",
      students: 32,
      nextClass: "Monday, 10:00 AM",
      color: "#10b981",
      hasNewContent: true,
    },
    {
      id: "sub2",
      name: "Physics",
      code: "PHYS101",
      teacher: "Prof. Marie Curie",
      students: 28,
      nextClass: "Tuesday, 2:00 PM",
      color: "#3b82f6",
      hasNewContent: false,
    },
    {
      id: "sub3",
      name: "Computer Science",
      code: "CS101",
      teacher: "Dr. Grace Hopper",
      students: 35,
      nextClass: "Wednesday, 11:00 AM",
      color: "#8b5cf6",
      hasNewContent: true,
    },
    {
      id: "sub4",
      name: "Biology",
      code: "BIO101",
      teacher: "Prof. Charles Darwin",
      students: 30,
      nextClass: "Thursday, 9:00 AM",
      color: "#ec4899",
      hasNewContent: false,
    },
    {
      id: "sub5",
      name: "History",
      code: "HIST101",
      teacher: "Dr. Howard Zinn",
      students: 25,
      nextClass: "Friday, 1:00 PM",
      color: "#f59e0b",
      hasNewContent: false,
    },
    {
      id: "sub6",
      name: "Literature",
      code: "LIT101",
      teacher: "Prof. Jane Austen",
      students: 22,
      nextClass: "Monday, 3:00 PM",
      color: "#06b6d4",
      hasNewContent: true,
    },
  ]
  
  // Dummy Announcements
  export const dummyAnnouncements = [
    {
      id: "ann1",
      title: "Midterm Exam Schedule",
      content:
        "Dear students,\n\nThe midterm exam for this subject will be held on October 15th from 10:00 AM to 12:00 PM in Room 301. Please make sure to bring your student ID and necessary stationery.\n\nThe exam will cover all topics discussed up to Week 6. A detailed syllabus has been uploaded to the Resources section.\n\nGood luck with your preparation!",
      author: {
        name: "Dr. Alan Turing",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Professor",
      },
      date: "2023-10-01T10:30:00Z",
      comments: [
        {
          id: "com1",
          author: {
            name: "John Smith",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          content: "Will the exam include the advanced topics from Chapter 7?",
          date: "2023-10-01T14:25:00Z",
        },
        {
          id: "com2",
          author: {
            name: "Dr. Alan Turing",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          content: "No, Chapter 7 will not be included. The exam only covers material up to Week 6 as mentioned.",
          date: "2023-10-01T15:10:00Z",
        },
        {
          id: "com3",
          author: {
            name: "Emily Johnson",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          content: "Is it an open book exam?",
          date: "2023-10-01T16:45:00Z",
        },
      ],
    },
    {
      id: "ann2",
      title: "Guest Lecture Next Week",
      content:
        "I'm excited to announce that we'll have a special guest lecture next week by Dr. Richard Feynman, a renowned expert in the field.\n\nThe lecture will take place during our regular class time on Wednesday. Attendance is mandatory as the content will be included in your final assessment.\n\nPlease come prepared with questions as there will be a Q&A session after the lecture.",
      author: {
        name: "Dr. Alan Turing",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Professor",
      },
      date: "2023-10-05T09:15:00Z",
      comments: [
        {
          id: "com4",
          author: {
            name: "Michael Brown",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          content: "Looking forward to this! Dr. Feynman's work is fascinating.",
          date: "2023-10-05T10:20:00Z",
        },
      ],
    },
    {
      id: "ann3",
      title: "Assignment Deadline Extended",
      content:
        "Due to multiple requests and considering the upcoming midterm exams, I've decided to extend the deadline for Assignment 3.\n\nThe new submission deadline is October 20th at 11:59 PM. No further extensions will be granted after this date.\n\nPlease use this additional time wisely to improve the quality of your work.",
      author: {
        name: "Dr. Alan Turing",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Professor",
      },
      date: "2023-10-08T16:45:00Z",
      comments: [],
    },
  ]
  
  // Dummy Assignments
  export const dummyAssignments = [
    {
      id: "asg1",
      title: "Problem Set 3: Differential Equations",
      description:
        "Complete problems 1-10 from Chapter 5 of the textbook. Show all your work and explain your reasoning for each step.\n\nSubmit your solutions as a single PDF document with your name and student ID on the first page.",
      dueDate: "2023-10-20T23:59:00Z",
      points: 100,
      status: "pending",
      attachments: [
        {
          id: "att1",
          name: "Assignment_Guidelines.pdf",
          type: "PDF Document",
          size: "1.2 MB",
        },
        {
          id: "att2",
          name: "Sample_Solutions.pdf",
          type: "PDF Document",
          size: "850 KB",
        },
      ],
    },
    {
      id: "asg2",
      title: "Research Paper: Mathematical Models in Real-World Applications",
      description:
        "Write a 5-page research paper on how mathematical models are used in real-world applications. Choose a specific field (e.g., economics, biology, engineering) and discuss at least three different mathematical models used in that field.\n\nYour paper should include proper citations and a bibliography in APA format.",
      dueDate: "2023-11-05T23:59:00Z",
      points: 150,
      status: "completed",
      attachments: [
        {
          id: "att3",
          name: "Research_Paper_Guidelines.pdf",
          type: "PDF Document",
          size: "1.5 MB",
        },
      ],
    },
    {
      id: "asg3",
      title: "Quiz 2: Limits and Continuity",
      description:
        "This online quiz covers the topics of limits and continuity from Chapters 3 and 4. You will have 60 minutes to complete the quiz once you start.\n\nThe quiz consists of multiple-choice questions and short answer problems.",
      dueDate: "2023-09-30T23:59:00Z",
      points: 50,
      status: "graded",
      grade: 45,
      feedback:
        "Excellent work! You demonstrated a strong understanding of limits and continuity. Your solutions were well-organized and clearly explained. Keep up the good work!",
      attachments: [],
    },
    {
      id: "asg4",
      title: "Group Project: Statistical Analysis",
      description:
        "In groups of 3-4, collect and analyze a real-world dataset using the statistical methods we've learned in class.\n\nYour submission should include the raw data, your analysis code, and a 3-page report summarizing your findings.",
      dueDate: "2023-09-15T23:59:00Z",
      points: 200,
      status: "overdue",
      attachments: [
        {
          id: "att4",
          name: "Project_Requirements.pdf",
          type: "PDF Document",
          size: "2.1 MB",
        },
        {
          id: "att5",
          name: "Dataset_Options.xlsx",
          type: "Excel Spreadsheet",
          size: "3.5 MB",
        },
      ],
    },
  ]
  
  // Dummy Resources
  export const dummyResources = [
    {
      id: "res1",
      title: "Lecture Notes: Introduction to Calculus",
      description:
        "Comprehensive notes covering the fundamental concepts of calculus, including limits, derivatives, and integrals.",
      type: "document",
      url: "#",
      fileSize: "2.5 MB",
      isNew: true,
      category: "lecture",
    },
    {
      id: "res2",
      title: "Video Tutorial: Solving Differential Equations",
      description: "Step-by-step video guide on solving various types of differential equations with practical examples.",
      type: "video",
      url: "#",
      duration: "45 minutes",
      isNew: false,
      category: "lecture",
    },
    {
      id: "res3",
      title: "Practice Problems: Integration Techniques",
      description: "A collection of practice problems to help you master different integration techniques.",
      type: "document",
      url: "#",
      fileSize: "1.8 MB",
      isNew: false,
      category: "practice",
    },
    {
      id: "res4",
      title: "Interactive Calculus Visualizer",
      description: "An interactive tool to visualize calculus concepts like limits, derivatives, and integrals.",
      type: "link",
      url: "#",
      isNew: true,
      category: "reference",
    },
    {
      id: "res5",
      title: "Midterm Review Quiz",
      description: "Self-assessment quiz to help you prepare for the upcoming midterm exam.",
      type: "quiz",
      url: "#",
      isNew: true,
      category: "practice",
    },
    {
      id: "res6",
      title: "Textbook: Advanced Calculus",
      description: "Digital version of the course textbook with interactive examples and exercises.",
      type: "book",
      url: "#",
      fileSize: "15 MB",
      isNew: false,
      category: "reading",
    },
  ]
  
  // Dummy Schedule
  export const dummySchedule = [
    {
      id: "sch1",
      title: "Lecture: Limits and Continuity",
      date: "2023-10-16T00:00:00Z",
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      location: "Room 301",
      type: "lecture",
      description: "Introduction to limits and continuity with examples.",
    },
    {
      id: "sch2",
      title: "Lab Session: Calculus Software",
      date: "2023-10-18T00:00:00Z",
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      location: "Computer Lab 2",
      type: "lab",
      description: "Hands-on practice with calculus software tools.",
    },
    {
      id: "sch3",
      title: "Midterm Exam",
      date: "2023-10-20T00:00:00Z",
      startTime: "9:00 AM",
      endTime: "11:00 AM",
      location: "Examination Hall",
      type: "exam",
      description: "Comprehensive exam covering all topics from weeks 1-6.",
    },
    {
      id: "sch4",
      title: "Assignment 3 Due",
      date: "2023-10-20T00:00:00Z",
      startTime: "11:59 PM",
      endTime: "11:59 PM",
      location: "Online Submission",
      type: "assignment",
      description: "Final deadline for Assignment 3.",
    },
    {
      id: "sch5",
      title: "Office Hours",
      date: "2023-10-17T00:00:00Z",
      startTime: "1:00 PM",
      endTime: "3:00 PM",
      location: "Professor's Office",
      type: "office_hours",
      description: "Drop-in hours for questions and assistance.",
    },
    {
      id: "sch6",
      title: "Guest Lecture: Dr. Richard Feynman",
      date: "2023-10-18T00:00:00Z",
      startTime: "11:00 AM",
      endTime: "12:30 PM",
      location: "Auditorium",
      type: "lecture",
      description: "Special lecture on applications of calculus in physics.",
    },
  ]
  
  // Dummy Terms
  export const dummyTerms = [
    {
      id: "term1",
      name: "Fall Semester",
      year: "2023",
    },
    {
      id: "term2",
      name: "Spring Semester",
      year: "2023",
    },
    {
      id: "term3",
      name: "Summer Term",
      year: "2023",
    },
    {
      id: "term4",
      name: "Fall Semester",
      year: "2022",
    },
  ]
  
  // Dummy Grades
  export const dummyGrades = [
    {
      id: "grade1",
      subjectId: "sub1",
      subjectName: "Mathematics",
      subjectCode: "MATH101",
      score: 92,
      letterGrade: "A",
      status: "passed",
      teacher: "Dr. Alan Turing",
      feedback: "Excellent work throughout the semester. Your problem-solving skills are outstanding.",
      breakdown: [
        { category: "Assignments", weight: 30, score: 95 },
        { category: "Midterm Exam", weight: 30, score: 88 },
        { category: "Final Exam", weight: 40, score: 93 },
      ],
    },
    {
      id: "grade2",
      subjectId: "sub2",
      subjectName: "Physics",
      subjectCode: "PHYS101",
      score: 85,
      letterGrade: "B+",
      status: "passed",
      teacher: "Prof. Marie Curie",
      feedback: "Good understanding of core concepts. Could improve on laboratory reports.",
      breakdown: [
        { category: "Assignments", weight: 20, score: 90 },
        { category: "Lab Work", weight: 30, score: 78 },
        { category: "Midterm Exam", weight: 20, score: 84 },
        { category: "Final Exam", weight: 30, score: 89 },
      ],
    },
    {
      id: "grade3",
      subjectId: "sub3",
      subjectName: "Computer Science",
      subjectCode: "CS101",
      score: 95,
      letterGrade: "A+",
      status: "passed",
      teacher: "Dr. Grace Hopper",
      feedback: "Outstanding performance in all aspects. Your programming projects were particularly impressive.",
      breakdown: [
        { category: "Coding Assignments", weight: 40, score: 98 },
        { category: "Quizzes", weight: 20, score: 92 },
        { category: "Midterm Project", weight: 15, score: 95 },
        { category: "Final Project", weight: 25, score: 94 },
      ],
    },
    {
      id: "grade4",
      subjectId: "sub4",
      subjectName: "Biology",
      subjectCode: "BIO101",
      score: 78,
      letterGrade: "C+",
      status: "passed",
      teacher: "Prof. Charles Darwin",
      breakdown: [
        { category: "Assignments", weight: 25, score: 75 },
        { category: "Lab Reports", weight: 25, score: 72 },
        { category: "Midterm Exam", weight: 20, score: 80 },
        { category: "Final Exam", weight: 30, score: 83 },
      ],
    },
    {
      id: "grade5",
      subjectId: "sub5",
      subjectName: "History",
      subjectCode: "HIST101",
      score: 88,
      letterGrade: "B+",
      status: "passed",
      teacher: "Dr. Howard Zinn",
      feedback: "Well-researched essays and active participation in discussions.",
      breakdown: [
        { category: "Essays", weight: 40, score: 90 },
        { category: "Participation", weight: 20, score: 95 },
        { category: "Midterm Exam", weight: 15, score: 82 },
        { category: "Final Exam", weight: 25, score: 84 },
      ],
    },
    {
      id: "grade6",
      subjectId: "sub6",
      subjectName: "Literature",
      subjectCode: "LIT101",
      score: 55,
      letterGrade: "F",
      status: "failed",
      teacher: "Prof. Jane Austen",
      feedback: "Insufficient work submitted and poor attendance. Please meet with me to discuss retaking the course.",
      breakdown: [
        { category: "Essays", weight: 30, score: 60 },
        { category: "Participation", weight: 20, score: 40 },
        { category: "Midterm Paper", weight: 20, score: 65 },
        { category: "Final Paper", weight: 30, score: 55 },
      ],
    },
  ]
  
  // Dummy Blog Posts
  export const dummyBlogPosts = [
    {
      id: "post1",
      title: "The Future of AI in Education: A Student's Perspective",
      excerpt:
        "As AI continues to transform various industries, education is no exception. Here's how I see AI changing the way we learn and study.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      coverImage: "/placeholder.svg?height=400&width=800",
      author: {
        id: "author1",
        name: "Alex Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Student",
      },
      date: "2023-10-05T14:30:00Z",
      readTime: "5 min",
      likes: 42,
      comments: 8,
      tags: ["Technology", "Education", "AI"],
    },
    {
      id: "post2",
      title: "My Exchange Semester in Tokyo: What I Learned",
      excerpt:
        "Spending a semester abroad changed my perspective on education and life. Here are the most valuable lessons from my time in Tokyo.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      coverImage: "/placeholder.svg?height=400&width=800",
      author: {
        id: "author2",
        name: "Jessica Lee",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Student",
      },
      date: "2023-09-28T10:15:00Z",
      readTime: "8 min",
      likes: 67,
      comments: 12,
      tags: ["Study Abroad", "Culture", "Personal Growth"],
    },
    {
      id: "post3",
      title: "5 Study Techniques That Actually Work: Based on Science",
      excerpt:
        "After trying countless study methods, I've found these five techniques to be the most effective, and they're backed by scientific research.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      coverImage: "/placeholder.svg?height=400&width=800",
      author: {
        id: "author3",
        name: "David Kim",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Student",
      },
      date: "2023-09-20T09:45:00Z",
      readTime: "6 min",
      likes: 103,
      comments: 24,
      tags: ["Study Tips", "Productivity", "Science"],
    },
  ]
  