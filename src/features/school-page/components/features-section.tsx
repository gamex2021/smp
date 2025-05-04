/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

interface Section {
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundGradient?: {
    direction?: string;
    from: string;
    to: string;
  };
  backgroundImage?: string;
  media?: { title: string; file: string; alt?: string }[];
  customFields?: { features?: string };
  title: string;
  subtitle: string;
}

export default function FeaturesSection({ section }: { section: Section }) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    if (inView) {
      void controls.start("visible")
    }
  }, [controls, inView])

  // Get background style based on section configuration
  const getBackgroundStyle = () => {
    switch (section.backgroundType) {
      case "color":
        return { backgroundColor: section.backgroundColor ?? "#f9fafb" }
      case "gradient":
        if (section.backgroundGradient) {
          return {
            backgroundImage: `linear-gradient(${section.backgroundGradient.direction ?? "to right"}, ${section.backgroundGradient.from}, ${section.backgroundGradient.to})`,
          }
        }
        return { backgroundColor: "#f9fafb" }
      case "image":
        if (section.backgroundImage) {
          return {
            backgroundImage: `url(/api/convex/storage/${section.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
        }
        return { backgroundColor: "#f9fafb" }
      default:
        return { backgroundColor: "#f9fafb" }
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  // Get media for features
  const featureMedia = section.media ?? []

  // Parse custom fields for features if available
  const features = section.customFields?.features
    ? JSON.parse(section.customFields.features)
    : [
        {
          title: "Quality Education",
          description: "Our curriculum is designed to provide the highest quality education.",
        },
        { title: "Expert Teachers", description: "Learn from experienced educators who are experts in their fields." },
        { title: "Modern Facilities", description: "Access to state-of-the-art facilities and learning resources." },
        {
          title: "Personalized Learning",
          description: "Tailored learning experiences to meet individual student needs.",
        },
        {
          title: "Extracurricular Activities",
          description: "A wide range of activities to develop well-rounded students.",
        },
        { title: "Safe Environment", description: "A secure and nurturing environment for optimal learning." },
      ]

  return (
    <section
      id="features"
      className={cn("py-20", section.backgroundType === "image" && "text-white")}
      style={getBackgroundStyle()}
      ref={ref}
    >
      {/* Overlay for background images */}
      {section.backgroundType === "image" && <div className="absolute inset-0 bg-black/50" />}

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={itemVariants}
          >
            {section.title}
          </motion.h2>

          <motion.p
            className="text-lg opacity-80"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={itemVariants}
            transition={{ delay: 0.2 }}
          >
            {section.subtitle}
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {features.map((feature: { title: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined; description: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }, index: Key | null | undefined) => {
            // Try to find matching media for this feature
            const media = featureMedia.find((m) => m.title === feature.title)

            return (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
                variants={itemVariants}
              >
                {media && (
                  <div className="h-48 overflow-hidden">
                    <Image
                      src={`/api/convex/storage/${media.file}`}
                      alt={(media.alt!) || (feature.title as string) || "Feature image"}
                      className="w-full h-full object-cover"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary mr-2" style={{ color: "var(--primary-color)" }} />
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
