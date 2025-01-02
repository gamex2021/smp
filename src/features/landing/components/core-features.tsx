import { Icons } from "@/components/icons";

const CORE_FEATURES = [
  {
    icon: "user1",
    title: "AI-Powered Chatbot",
    description:
      "Get real-time answers to your queries—from student stats to payment balances—with an intelligent chatbot",
  },
  {
    icon: "board",
    title: "Interactive Dashboard",
    description:
      "Visualize student performance, attendance trends, and financial data with customizable reports.",
  },
  {
    icon: "graph",
    title: "Smart Notifications & Alerts",
    description:
      "Stay informed with reminders, updates, and announcements tailored to your school’s needs.",
  },
  {
    icon: "announce",
    title: "Instant Messaging",
    description:
      "Communicate effortlessly with admins, teachers, and students—all in one place.",
  },
  {
    icon: "announce",
    title: "Class Management",
    description:
      "Effortlessly create, assign, and manage classes for smooth academic operations.",
  },
  {
    icon: "announce",
    title: "Event Tracking",
    description:
      "Keep track and stay on top of important school events, deadlines, and schedules.",
  },
] satisfies {
  icon: keyof typeof Icons;
  title: string;
  description: string;
}[];

export function CoreFeatures() {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-10 bg-[#11321F] py-10">
      <p className="text-center text-xl font-semibold capitalize text-white lg:text-3xl">
        Our core features
      </p>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-3">
        {CORE_FEATURES.map((item, index) => {
          const Icon = Icons[item.icon];

          return (
            <div
              key={`core-feature-${index}`}
              className="flex w-full flex-col gap-3 rounded-lg bg-[#F8FBFA66] p-5"
            >
              <div className="flex w-fit items-center justify-center rounded-lg bg-white p-3">
                <Icon className="h-7 w-7 text-[#11321F]" />
              </div>
              <div className="">
                <span className="mb-3 text-lg font-semibold capitalize text-white md:text-xl">
                  {item.title}
                </span>
                <br />
                <span className="text-sm text-white">{item.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
