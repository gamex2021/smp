import Link from "next/link";
import Image from "next/image";
import { Icons } from "@/components/icons";
import { SignInForm } from "../_components/signin-form";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { notFound } from "next/navigation";

type Params = Promise<Record<string, string | undefined>>;

export default async function SignInPage(props: { params: Params }) {
  const params = await props.params;
  const domain = params.domain;

  if (!domain) {
    notFound();
  }

  const schoolData = await fetchQuery(api.queries.school.findSchool, {
    domain,
  });

  if (!schoolData?.verified) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="mx-auto max-w-sm text-center">
          <p className="text-xl font-semibold tracking-tight">
            We verifying your school.
          </p>
          <p>We will let you know once the verification process is done.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-2">
      <Link
        href="/"
        className="absolute left-8 top-6 z-20 flex items-center text-lg font-bold tracking-tight text-foreground/80 transition-colors hover:text-foreground"
      >
        <Icons.play className="mr-2 size-6" aria-hidden="true" />
        <span>School name</span>
      </Link>
      <main className="absolute left-1/2 top-1/2 z-40 flex w-full -translate-x-1/2 -translate-y-1/2 items-center lg:static lg:left-0 lg:top-0 lg:flex lg:translate-x-0 lg:translate-y-0">
        <SignInForm schoolId={schoolData.id} />
      </main>
      <div className="relative aspect-video size-full">
        {/* change this to the one the school set */}
        <Image
          src="/images/boy-smiling.jpg"
          alt="A skateboarder dropping into a bowl"
          fill
          className="absolute inset-0 object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-black/80 lg:to-black/40" />
      </div>
    </div>
  );
}
