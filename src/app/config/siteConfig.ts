export const siteConfig = {
  operationalCountries: ["Nigeia", "Ghana"] as const,
  schoolTypes: ["primary", "secondary", "university"] as const,
};

// the roles will contain the roles that are allowed to access the page, so if a role is not in the roles array, the nav item will not be displayed
export const mockNavItems = [
  {
    title: "Home",
    href: "/dashboard",
    icon: "RxDashboard",
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  {
    title: "Classes",
    href: "/classes",
    icon: "Presentation",
    roles: ["ADMIN"],
  },
  {
    title: "Subjects",
    href: "/subjects",
    icon: "BookOpen",
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  {
    title: "Students",
    href: "/students",
    icon: "GraduationCap",
    roles: ["ADMIN", "TEACHER"],
  },
  {
    title: "Teachers",
    href: "/teachers",
    icon: "Users",
    roles: ["ADMIN"],
  },
  {
    title: "School",
    href: "/school",
    icon: "School",
    roles: ["ADMIN"],
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: "BarChart",
    roles: ["ADMIN", "TEACHER"],
  },
  {
    title: "Announcement",
    href: "/announcement",
    icon: "Rss",
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  {
    title: "Learn",
    href: "/learn",
    icon: "BookAIcon",
    roles: ["STUDENT"],
  },
  {
    title: "Messages",
    href: "/messages",
    icon: "MessageSquare",
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  {
    title: "Payment",
    href: "/payments",
    icon: "Banknote",
    roles: ["ADMIN"],
  },
  {
    title : "Marketing",
    href : "/marketing",
    icon: "IdCardIcon",
    roles : ["ADMIN"]
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "Settings",
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
];

export const mockUser = {
  id: "1",
  name: "Emmanuel A",
  role: "ADMIN",
  avatar: "/placeholder-user.jpg",
};

export const mockSchool = {
  id: "1",
  name: "TechSX",
  theme: {
    primaryColor: "#3B8C6A",
    secondaryColor: "#2A644C",
  },
};

export const mockClasses = [
  { id: 1, name: "Class A", teacher: "Mrs Eze Naomi", students: 12 },
  { id: 2, name: "Class B", teacher: "Mrs Eze Naomi", students: 12 },
  { id: 3, name: "Class C", teacher: "Mrs Eze Naomi", students: 12 },
  { id: 4, name: "Class D", teacher: "Mrs Eze Naomi", students: 12 },
  { id: 5, name: "Class F", teacher: "Mrs Eze Naomi", students: 12 },
];

export const mockTeacherClasses = [
  {
    id: 1,
    name: "Class A",
    groups: [
      { id: 1, name: "Group 1", studentCount: 25 },
      { id: 2, name: "Group 2", studentCount: 25 },
      { id: 3, name: "Group 3", studentCount: 25 },
      { id: 4, name: "Group 4", studentCount: 25 },
      { id: 5, name: "Group 5", studentCount: 25 },
    ],
  },
  // ... more classes
];

export const mockSubjects = [
  { id: 1, name: "English" },
  { id: 2, name: "English" },
  { id: 3, name: "English" },
  { id: 4, name: "English" },
  { id: 5, name: "English" },
];

export const teacherMockSubjects = [
  { id: 1, name: "English", teacherName: "Mrs Naomi", className: "class 2b" },
  {
    id: 2,
    name: "Mathematics",
    teacherName: "Mrs Naomi",
    className: "class 2b",
  },
];

export const mockStudents = [
  {
    id: 1,
    name: "Michael Adelayo",
    class: "1",
    group: "A",
    gender: "Male",
    phone: "07057192110",
    email: "michaeladelayo@gmail.com",
    avatar: "/images/dummy-user.png",
  },
  {
    id: 2,
    name: "Naomi Dele",
    class: "1",
    group: "B",
    gender: "Female",
    phone: "07057192110",
    email: "naomidele@gmail.com",
    avatar: "/images/dummy-user.png",
  },
  {
    id: 3,
    name: "Uche Eze",
    class: "2",
    group: "A",
    gender: "Female",
    phone: "07057192110",
    email: "ucheeze@gmail.com",
    avatar: "/images/dummy-user.png",
  },
  // ... more students
];

export const mockTeachers = [
  {
    id: 1,
    name: "Philip Graham",
    class: "JSS1",
    subject: "English",
    email: "philipgraham@gmail.com",
    avatar: "/images/dummy-user.png",
  },
  {
    id: 2,
    name: "Naomi Eze",
    class: "JSS1",
    subject: "Mathematics",
    email: "naomieze@gmail.com",
    avatar: "/images/dummy-user.png",
  },
  {
    id: 3,
    name: "Seyi Michael",
    class: "JSS1",
    subject: "Civic Education",
    email: "seyimichael@gmail.com",
    avatar: "/images/dummy-user.png",
  },
  {
    id: 4,
    name: "Joy Bisi",
    class: "JSS2",
    subject: "English",
    email: "joybisi@gmail.com",
    avatar: "/images/dummy-user.png",
  },
  {
    id: 5,
    name: "Uche Eze",
    class: "JSS2",
    subject: "Basic Technology",
    email: "ucheeze@gmail.com",
    avatar: "/images/dummy-user.png",
  },
  {
    id: 6,
    name: "Tunde Adebayo",
    class: "JSS2",
    subject: "Basic Science",
    email: "tundeadebayo@gmail.com",
    avatar: "/images/dummy-user.png",
  },
];

export const teachersAttendance = [
  {
    id: 1,
    name: "Morrise Johnson",
    Day1: "Present",
    Day2: "Absent",
    Day3: "Present",
    Day4: "Holiday",
    Day5: "Leave",
    Day6: "Absent",
    Day7: "Present",
    avatar: "/images/dummy-user.png",
  },

  {
    id: 2,
    name: "Morrise Johnson",
    Day1: "Present",
    Day2: "Absent",
    Day3: "Present",
    Day4: "Holiday",
    Day5: "Leave",
    Day6: "Absent",
    Day7: "Present",
    avatar: "/images/dummy-user.png",
  },
  {
    id: 3,
    name: "Morrise Johnson",
    Day1: "Present",
    Day2: "Absent",
    Day3: "Present",
    Day4: "Holiday",
    Day5: "Leave",
    Day6: "Absent",
    Day7: "Present",
    avatar: "/images/dummy-user.png",
  },
  {
    id: 4,
    name: "Morrise Johnson",
    Day1: "Present",
    Day2: "Absent",
    Day3: "Present",
    Day4: "Holiday",
    Day5: "Leave",
    Day6: "Absent",
    Day7: "Present",
    avatar: "/images/dummy-user.png",
  },
  {
    id: 5,
    name: "Morrise Johnson",
    Day1: "Present",
    Day2: "Absent",
    Day3: "Present",
    Day4: "Holiday",
    Day5: "Leave",
    Day6: "Absent",
    Day7: "Present",
    avatar: "/images/dummy-user.png",
  },
  {
    id: 6,
    name: "Morrise Johnson",
    Day1: "Present",
    Day2: "Absent",
    Day3: "Present",
    Day4: "Holiday",
    Day5: "Leave",
    Day6: "Absent",
    Day7: "Present",
    avatar: "/images/dummy-user.png",
  },
  {
    id: 7,
    name: "Morrise Johnson",
    Day1: "Present",
    Day2: "Absent",
    Day3: "Present",
    Day4: "Holiday",
    Day5: "Leave",
    Day6: "Absent",
    Day7: "Present",
    avatar: "/images/dummy-user.png",
  },
  {
    id: 8,
    name: "Morrise Johnson",
    Day1: "Present",
    Day2: "Absent",
    Day3: "Present",
    Day4: "Holiday",
    Day5: "Leave",
    Day6: "Absent",
    Day7: "Present",
    avatar: "/images/dummy-user.png",
  },
];

export const mockConversations = [
  {
    id: 1,
    name: "Bimbola A.",
    role: "Admin",
    lastMessage: "Typing....",
    timestamp: "13:45pm",
    unreadCount: 3,
    avatar: "/images/dummy-user.png",
    isTyping: true,
  },
  {
    id: 2,
    name: "Uche E.",
    role: "Teacher",
    lastMessage: "Typing....",
    timestamp: "13:45pm",
    unreadCount: 3,
    avatar: "/images/dummy-user.png",
    isTyping: true,
  },
  // ... more conversations
];

export const mockMessages = [
  {
    id: 1,
    content:
      "Reminder: Midterm grades are due next Monday. Please ensure all student records are updated by then",
    sender: {
      name: "Ade",
      avatar: "/images/dummy-user.png",
    },
    timestamp: new Date("2024-01-04T13:45:00"),
    group: "Yesterday",
  },
  {
    id: 2,
    content:
      "Got it! I noticed some students haven't submitted their assignments yet—I'll follow up with their teachers to get those in.",
    sender: {
      name: "Bolu",
      avatar: "/images/dummy-user.png",
    },
    timestamp: new Date("2024-01-04T14:00:00"),
    group: "Yesterday",
  },
  {
    id: 3,
    content:
      "Let's aim to have everything finalized by Friday, so we're not rushing at the last minute.",
    sender: {
      name: "You",
      avatar: "/images/dummy-user.png",
    },
    timestamp: new Date("2024-01-05T10:00:00"),
    group: "Today",
  },
];

export const mockAnnouncements = [
  {
    id: 1,
    title: "Upcoming sport event starting next week",
    date: "11/08/2024",
    status: "recent", // or "scheduled", "archived", "deleted"
  },
  {
    id: 2,
    title: "Cultural day is starting next week",
    date: "13/08/2024",
    status: "scheduled",
  },
  // ... more announcements
];

export const mockEvents = [
  {
    id: 1,
    title: "Cultural Event",
    date: new Date(2024, 12, 2), // January 2
    time: "09:00",
    color: "coral",
  },
  {
    id: 2,
    title: "Career Day",
    date: new Date(2024, 12, 8), // January 8
    time: "08:00",
    color: "purple",
  },
  {
    id: 3,
    title: "Drama Act",
    date: new Date(2024, 12, 8), //still january 8 tbh
    time: "14:00",
    color: "blue",
  },
  // ... more events
];

export const mockTransactions = [
  {
    id: "2024003",
    date: "2-6-2024",
    reason: "School Fees",
    method: "Bank Transfer",
    source: "Tobi Adeleye",
    status: "Full",
  },
  // ... more transactions
];
