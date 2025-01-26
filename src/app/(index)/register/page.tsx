import { ScrollArea } from "@/components/ui/scroll-area";
import { OnboardingForm } from "../../../features/landing/components/forms/onboarding-form";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="bg-[#DEEDE5]">
      <div className="mx-auto grid w-full max-w-[82rem] grid-cols-1 py-12 md:min-h-[calc(100vh-20rem)] md:grid-cols-2">
        <div className="relative rounded-md">
          <Image
            src="/images/boy-smiling.jpg"
            className="rounded-bl-md rounded-tl-md object-cover object-right"
            alt="onboarding-image"
            fill
          />
        </div>
        <ScrollArea className="h-full w-full bg-white p-5 md:h-[calc(100vh-20rem)] md:max-h-[calc(100vh-20rem)] md:p-8">
          <div className="flex items-center justify-center rounded-md">
            <OnboardingForm />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
