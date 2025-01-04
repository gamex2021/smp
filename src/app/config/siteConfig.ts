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
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Classes",
    href: "/classes",
    icon: "Presentation",
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Subjects",
    href: "/subjects",
    icon: "BookOpen",
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Students",
    href: "/students",
    icon: "GraduationCap",
    roles: ["admin", "teacher"],
  },
  {
    title: "Teachers",
    href: "/teachers",
    icon: "Users",
    roles: ["admin"],
  },
  {
    title: "School",
    href: "/school",
    icon: "School",
    roles: ["admin"],
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: "BarChart",
    roles: ["admin", "teacher"],
  },
  {
    title: "Announcement",
    href: "/announcement",
    icon: "Rss",
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Messages",
    href: "/messages",
    icon: "MessageSquare",
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Payment",
    href: "/payments",
    icon: "Banknote",
    roles: ["admin"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "Settings",
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
