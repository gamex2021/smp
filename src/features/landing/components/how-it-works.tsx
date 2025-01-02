import Image from "next/image";
import { Icons } from "@/components/icons";

const STEPS = [
  {
    title: "Sign up",
    image: "/images/boy-smiling.jpg",
  },
  {
    title: "Setup your school",
    image: "/images/boy-smiling.jpg",
  },
  {
    title: "Manage effortlessly",
    image: "/images/boy-smiling.jpg",
  },
];

export function HowItWorks() {
  return (
    <div className="flex min-h-[100vh-30rem] w-full flex-col items-center justify-center bg-[#F8FBFA] py-12 text-[#11321F]">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-xl font-semibold capitalize lg:text-3xl">
          How it works
        </p>
        <div className="flex w-full items-center">
          <div className="h-[1px] w-full flex-1 bg-[#11321F]" />
          <Icons.play className="h-2 w-2" />
        </div>
      </div>
      <div className="mx-auto mt-2 grid w-full max-w-6xl grid-cols-1 gap-1 md:grid-cols-3">
        {STEPS.map((item, index) => (
          <div key={`steps-${index}`} className="space-y-3">
            <span className="text-lg font-light">
              {index === 0
                ? "First"
                : index === 1
                  ? "Second"
                  : index === 2
                    ? "Third"
                    : "Other"}{" "}
              Step
            </span>
            <br />
            <span className="text-xl font-bold">{item.title}</span>
            <Image
              src={item.image}
              alt={`step-${index + 1}-image`}
              width={350}
              height={200}
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
