export const siteConfig = {
  operationalCountries: ["Nigeia", "Ghana"] as const,
  schoolTypes: ["primary", "secondary", "university"] as const,
};

// the roles will contain the roles that are allowed to access the page, so if a role is not in the roles array, the nav item will not be displayed
export const mockNavItems = [
  {
    title: "Home",
    href: "/schoolname/dashboard",
    icon: "Home",
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Classes",
    href: "/schoolname/classes",
    icon: "LayoutDashboard",
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Subjects",
    href: "/schoolname/subjects",
    icon: "BookOpen",
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Students",
    href: "/dashboard/students",
    icon: "GraduationCap",
    roles: ["admin", "teacher"],
  },
  {
    title: "Teachers",
    href: "/dashboard/teachers",
    icon: "Users",
    roles: ["admin"],
  },
  {
    title: "School",
    href: "/dashboard/school",
    icon: "School",
    roles: ["admin"],
  },
  {
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: "BarChart",
    roles: ["admin", "teacher"],
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: "MessageSquare",
    roles: ["admin", "teacher", "student"],
  },
];

export const mockUser = {
  id: "1",
  name: "Emmanuel A",
  role: "admin",
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
