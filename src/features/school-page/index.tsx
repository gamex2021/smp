/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import type React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { api } from "~/_generated/api";
import Link from "next/link";

// Dynamically import section components
const HeroSection = dynamic(() => import("./components/hero-section"));
const AboutSection = dynamic(() => import("./components/about-section"));
const FeaturesSection = dynamic(() => import("./components/features-section"));
const TestimonialsSection = dynamic(
  () => import("./components/testimonials-section"),
);
const StatsSection = dynamic(() => import("./components/stats-section"));
const CtaSection = dynamic(() => import("./components/cts-section"));
const ContactSection = dynamic(() => import("./components/contact-section"));
const GallerySection = dynamic(() => import("./components/gallery-section"));
const TeamSection = dynamic(() => import("./components/team-section"));
const FaqSection = dynamic(() => import("./components/faq-section"));
const AdmissionsSection = dynamic(
  () => import("./components/admissions-section"),
);
const CustomSection = dynamic(() => import("./components/custom-section"));

export default function LandingPage({ domain }: { domain: string }) {
  // Get landing page configuration
  const { school, config } = useQuery(
    api.queries.landingPage.getLandingPageConfig,
    {
      domain,
    },
  ) ?? { school: null, config: null };

  // Get landing page sections
  const sectionsData = useQuery(
    api.queries.landingPage.getLandingPageSections,
    {
      domain,
    },
  );

  // Get testimonials for testimonial sections
  const testimonials = useQuery(api.queries.landingPage.getTestimonials, {
    domain,
  });

  // Get FAQ items for FAQ sections
  const faqItems = useQuery(api.queries.landingPage.getFaqItems, {
    domain,
  });

  // Apply custom CSS if provided
  useEffect(() => {
    if (config?.customCss) {
      const styleElement = document.createElement("style");
      styleElement.textContent = config.customCss;
      document.head.appendChild(styleElement);

      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [config?.customCss]);

  // Apply custom JS if provided
  useEffect(() => {
    if (config?.customJs) {
      const scriptElement = document.createElement("script");
      scriptElement.textContent = config.customJs;
      document.body.appendChild(scriptElement);

      return () => {
        document.body.removeChild(scriptElement);
      };
    }
  }, [config?.customJs]);

  // Loading state
  if (!school || !sectionsData) {
    return <LandingPageSkeleton />;
  }

  const { sections } = sectionsData;

  // Filter active sections and sort by order
  const activeSections = Array.isArray(sections)
    ? sections
        .filter(
          (section: { isActive: boolean; order: number }) => section.isActive,
        )
        .sort((a, b) => a.order - b.order)
    : [];

  return (
    <div
      className={cn(
        "min-h-screen",
        config?.theme?.darkMode
          ? "dark bg-gray-900 text-white"
          : "bg-white text-gray-900",
      )}
      style={
        {
          "--primary-color": config?.theme?.primaryColor ?? "#2E8B57",
          "--secondary-color": config?.theme?.secondaryColor ?? "#4B6CB7",
          "--accent-color": config?.theme?.accentColor ?? "#F59E0B",
          "--font-family": config?.theme?.fontFamily ?? "Inter, sans-serif",
        } as React.CSSProperties
      }
    >
      <LandingPageHeader
        school={{
          name: school.name,
          address: school.address
            ? {
                line1: school.address.line1,
                city: school.address.city,
                state: school.address.state,
              }
            : undefined,
          phone: school.phone,
          email: school.email,
          motto: school.motto,
        }}
        config={config ?? { theme: {} }}
      />

      <main>
        {activeSections.map((section) => {
          // Render different section components based on type
          switch (section.type) {
            case "hero":
              return (
                <HeroSection
                  key={section._id}
                  section={{
                    ...section,
                    subtitle: section.subtitle ?? "", // Provide a default value for subtitle
                    ctaButtons: section.ctaButtons?.map((button, index) => ({
                      ...button,
                      _id: `cta-${section._id}-${index}`,
                      icon: !!button.icon, // Convert icon to a boolean
                    })),
                  }}
                />
              );
            case "about":
              return (
                <AboutSection
                  key={section._id}
                  section={{
                    ...section,
                    content: section.content ?? "",
                    ctaButtons: section.ctaButtons?.map((button, index) => ({
                      ...button,
                      _id: `cta-${section._id}-${index}`,
                    })),
                  }}
                />
              );
            case "features":
              return (
                <FeaturesSection
                  key={section._id}
                  section={{
                    ...section,
                    subtitle: section.subtitle ?? "", // Provide a default value for subtitle
                    media: section.media?.map((item, index) => ({
                      title: `Media ${index + 1}`, // Add a default title
                      file: item.file.toString(), // Convert file to string
                      alt: item.alt,
                    })),
                  }}
                />
              );
            case "testimonials":
              return (
                <TestimonialsSection
                  key={section._id}
                  section={{ ...section, subtitle: section.subtitle ?? "" }}
                  testimonials={testimonials ?? []}
                />
              );
            case "stats":
              return <StatsSection key={section._id} section={section} />;
            case "cta":
              return (
                <CtaSection
                  key={section._id}
                  section={{
                    ...section,
                    ctaButtons: section.ctaButtons?.map((button) => ({
                      label: button.text,
                      url: button.link,
                      variant:
                        button.style === "primary" ||
                        button.style === "secondary"
                          ? "default"
                          : "outline",
                    })),
                    media: section.media?.map((item) => ({
                      type: item.type,
                      fileId: item.file.toString(), // Ensure 'fileId' is a string
                      alt: item.alt, // Include optional alt property
                    })),
                  }}
                />
              );
            case "contact":
              return (
                <ContactSection
                  key={section._id}
                  section={{ ...section, subtitle: section.subtitle ?? "" }}
                  schoolId={school._id}
                />
              );
            case "gallery":
              return (
                <GallerySection
                  key={section._id}
                  section={{
                    ...section,
                    media: section.media?.map((item, index) => ({
                      id: `media-${section._id}-${index}`,
                      fileId: item.file,
                      caption: item.alt,
                      description: "",
                      type: item.type,
                    })),
                  }}
                />
              );
            case "team":
              return <TeamSection key={section._id} section={section} />;
            case "faq":
              return (
                <FaqSection
                  key={section._id}
                  section={{ ...section, subtitle: section.subtitle ?? "" }}
                  faqItems={faqItems ?? []}
                />
              );
            case "admissions":
              return (
                <AdmissionsSection
                  key={section._id}
                  section={{
                    ...section,
                    media: section.media?.map((item) => ({
                      ...item,
                      fileId: item.file,
                    })),
                    ctaButtons: section.ctaButtons?.map((button) => ({
                      label: button.text,
                      url: button.link,
                      variant: button.style,
                    })),
                  }}
                />
              );
            case "custom":
              return (
                <CustomSection
                  key={section._id}
                  section={{
                    ...section,
                    ctaButtons: section.ctaButtons?.map((button) => ({
                      label: button.text,
                      url: button.link,
                      variant:
                        button.style === "primary" ||
                        button.style === "secondary"
                          ? "default"
                          : "outline",
                    })),
                    media: section.media?.map((item) => ({
                      type: item.type,
                      fileId: item.file.toString(), // Ensure 'fileId' is a string
                      alt: item.alt, // Include optional alt property
                    })),
                  }}
                />
              );
            default:
              return null;
          }
        })}
      </main>

      <LandingPageFooter school={school} config={config} />
    </div>
  );
}

function LandingPageHeader({
  school,
  config,
}: {
  school: {
    name: string;
    address?: { line1: string; city: string; state: string };
    phone?: string;
    email?: string;
    motto?: string;
  };
  config: { logo?: string; theme?: { buttonStyle?: string } };
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 py-2 shadow-md backdrop-blur-md dark:bg-gray-900/90"
          : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          {config?.logo ? (
            <img
              src={`/api/convex/storage/${config.logo}`}
              alt={school.name}
              className="h-10 w-auto"
            />
          ) : (
            <h1 className="text-xl font-bold">{school.name}</h1>
          )}
        </div>

        <nav className="hidden items-center space-x-6 md:flex">
          <a href="#about" className="transition-colors hover:text-primary">
            About
          </a>
          <a href="#features" className="transition-colors hover:text-primary">
            Features
          </a>
          <a
            href="#testimonials"
            className="transition-colors hover:text-primary"
          >
            Testimonials
          </a>
          <a href="#contact" className="transition-colors hover:text-primary">
            Contact
          </a>
          <Link
            href="/login"
            className={cn(
              "rounded-md px-4 py-2 transition-colors",
              config?.theme?.buttonStyle === "pill"
                ? "rounded-full"
                : config?.theme?.buttonStyle === "square"
                  ? "rounded-none"
                  : "rounded-md",
              "bg-primary text-white hover:bg-primary/90",
            )}
            style={{ backgroundColor: `var(--primary-color)` }}
          >
            Sign In
          </Link>
        </nav>

        <button className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}

function LandingPageFooter({
  school,
  config,
}: {
  school: {
    name: string;
    address?: { line1: string; city: string; state: string } | null;
    phone?: string;
    email?: string;
    motto?: string;
  };
  config: { logo?: string; theme?: { buttonStyle?: string } } | null;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-12 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center">
              {config?.logo ? (
                <img
                  src={`/api/convex/storage/${config.logo}`}
                  alt={school.name}
                  className="h-10 w-auto"
                />
              ) : (
                <h1 className="text-xl font-bold">{school.name}</h1>
              )}
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              {school.motto ?? "Empowering minds, shaping futures"}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-primary dark:text-gray-300"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary dark:text-gray-300"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary dark:text-gray-300"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary dark:text-gray-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-600 hover:text-primary dark:text-gray-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-600 hover:text-primary dark:text-gray-300"
                >
                  Programs
                </a>
              </li>
              <li>
                <a
                  href="#admissions"
                  className="text-gray-600 hover:text-primary dark:text-gray-300"
                >
                  Admissions
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-600 hover:text-primary dark:text-gray-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg
                  className="mr-2 h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">
                  {school.address?.line1}, {school.address?.city},{" "}
                  {school.address?.state}
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mr-2 h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">
                  {school.phone ?? "Phone number not available"}
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mr-2 h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">
                  {school.email ?? "Email not available"}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Newsletter</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Subscribe to our newsletter for updates
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700"
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
                style={{ backgroundColor: `var(--primary-color)` }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">
            © {currentYear} {school.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function LandingPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="fixed left-0 right-0 top-0 z-50 bg-white py-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Skeleton className="h-10 w-40" />
          <div className="hidden items-center space-x-6 md:flex">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
          <Skeleton className="h-6 w-6 md:hidden" />
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="pb-12 pt-24">
        {/* Hero section skeleton */}
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <Skeleton className="mx-auto mb-6 h-12 w-3/4" />
            <Skeleton className="mx-auto mb-4 h-6 w-full" />
            <Skeleton className="mx-auto mb-8 h-6 w-5/6" />
            <div className="flex justify-center space-x-4">
              <Skeleton className="h-12 w-32 rounded-md" />
              <Skeleton className="h-12 w-32 rounded-md" />
            </div>
          </div>
        </div>

        {/* Features section skeleton */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <Skeleton className="mx-auto mb-4 h-10 w-64" />
              <Skeleton className="mx-auto h-6 w-full max-w-2xl" />
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg bg-white p-6 shadow-sm">
                  <Skeleton className="mb-4 h-12 w-12 rounded-full" />
                  <Skeleton className="mb-4 h-8 w-48" />
                  <Skeleton className="mb-2 h-4 w-full" />
                  <Skeleton className="mb-2 h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About section skeleton */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <Skeleton className="mb-4 h-10 w-48" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-6 h-4 w-3/4" />
              <Skeleton className="h-12 w-32 rounded-md" />
            </div>
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="mb-4 h-8 w-40" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="mb-2 h-4 w-5/6" />
                <Skeleton className="mb-2 h-4 w-4/6" />
                <Skeleton className="mb-2 h-4 w-full" />
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8 text-center">
            <Skeleton className="mx-auto h-4 w-64" />
          </div>
        </div>
      </div>
    </div>
  );
}
