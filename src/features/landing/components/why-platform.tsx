import Image from "next/image";
import { Icons } from "@/components/icons";

const SOME_FEATURES = [
  {
    icon: "user1",
    title: "Smart user management",
    description:
      "Assign roles, track activities, and keep profiles up-to-date effortlessly.",
  },
  {
    icon: "board",
    title: "Simplified class scheduling",
    description:
      "Create, manage, and organize classes and subjects in seconds.",
  },
  {
    icon: "graph",
    title: "Efficient Payment Tracking",
    description: "Track fees, balances, and payment history all in one place.",
  },
  {
    icon: "announce",
    title: "Instant Announcements",
    description:
      "Keep everyone in the loop with real-time updates and notifications.",
  },
] satisfies {
  icon: keyof typeof Icons;
  title: string;
  description: string;
}[];

export function WhyPlatform() {
  return (
    <div className="flex min-h-[calc(100vh-30rem)] w-full items-center justify-center bg-[#11321F] py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative">
          <div className="aspect-square">
            <Image
              fill
              src="/images/boy-smiling.jpg"
              className="rounded-lg object-cover object-right"
              alt="hero-image"
            />
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xl font-semibold tracking-tight text-white lg:text-3xl">
            Why make this platform yours?
          </p>
          <ul className="space-y-6">
            {SOME_FEATURES.map((item, index) => {
              const Icon = Icons[item.icon];

              return (
                <li
                  key={`feature-${index}`}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center justify-center rounded-lg bg-white p-3">
                    <Icon className="h-6 w-6 text-[#11321F]" />
                  </div>
                  <div className="md:max-w-[350px]">
                    <span className="mb-3 text-lg font-semibold capitalize text-white md:text-xl">
                      {item.title}
                    </span>
                    <br />
                    <span className="text-sm text-white">
                      {item.description}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
