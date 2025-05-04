"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
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
  media?: Array<{
    type: "image" | "video";
    file: string;
    alt?: string;
  }>;
  ctaButtons?: Array<{
    _id: string;
    link: string;
    text: string;
    style: "primary" | "secondary" | "outline" | "ghost";
    icon?: React.ReactNode;
  }>;
  title: string;
  content: string;
}

export default function AboutSection({ section }: { section: Section }) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  useEffect(() => {
    if (inView) {
      void controls.start("visible")
    }
  }, [controls, inView])

  // Get background style based on section configuration
  const getBackgroundStyle = () => {
    switch (section.backgroundType) {
      case "color":
        return { backgroundColor: section.backgroundColor ?? "#ffffff" }
      case "gradient":
        if (section.backgroundGradient) {
          return {
            backgroundImage: `linear-gradient(${section.backgroundGradient.direction ?? "to right"}, ${section.backgroundGradient.from}, ${section.backgroundGradient.to})`,
          }
        }
        return {}
      case "image":
        if (section.backgroundImage) {
          return {
            backgroundImage: `url(/api/convex/storage/${section.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
        }
        return {}
      default:
        return {}
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
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

  // Get media for about section
  const aboutMedia = section.media?.find((m) => m.type === "image" || m.type === "video")

  // Get CTA buttons
  const ctaButtons = section.ctaButtons ?? []

  return (
    <section
      id="about"
      className={cn("py-20", section.backgroundType === "image" && "text-white")}
      style={getBackgroundStyle()}
      ref={ref}
    >
      {/* Overlay for background images */}
      {section.backgroundType === "image" && <div className="absolute inset-0 bg-black/50" />}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {aboutMedia && (
            <motion.div variants={itemVariants} className="order-2 md:order-1">
              {aboutMedia.type === "image" ? (
                
                <Image
                  src={`/api/convex/storage/${aboutMedia.file}`}
                  alt={aboutMedia.alt ?? section.title}
                  className="w-full h-auto rounded-lg shadow-xl"
                  width={800} // Replace with the actual width of the image
                  height={600} // Replace with the actual height of the image
                  priority // Optional: Add this for LCP-critical images
                />
              ) : (
                <video autoPlay muted loop controls className="w-full h-auto rounded-lg shadow-xl">
                  <source src={`/api/convex/storage/${aboutMedia.file}`} type="video/mp4" />
                </video>
              )}
            </motion.div>
          )}

          <motion.div className="order-1 md:order-2">
            <motion.h2 className="text-3xl md:text-4xl font-bold mb-6" variants={itemVariants}>
              {section.title}
            </motion.h2>

            <motion.div
              className="prose prose-lg max-w-none mb-8"
              variants={itemVariants}
              dangerouslySetInnerHTML={{ __html: section.content }}
            />

            {ctaButtons.length > 0 && (
              <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
                {ctaButtons.map((button) => (
                  <a
                    key={button._id}
                    href={button.link}
                    className={cn(
                      "px-6 py-3 rounded-md font-medium transition-all duration-300 flex items-center",
                      button.style === "primary" && "bg-primary text-white hover:bg-primary/90",
                      button.style === "secondary" && "bg-secondary text-white hover:bg-secondary/90",
                      button.style === "outline" && "border-2 border-primary text-primary hover:bg-primary/10",
                      button.style === "ghost" && "text-primary hover:bg-primary/10",
                    )}
                    style={
                      button.style === "primary"
                        ? { backgroundColor: "var(--primary-color)" }
                        : button.style === "secondary"
                          ? { backgroundColor: "var(--secondary-color)" }
                          : button.style === "outline"
                            ? { borderColor: "var(--primary-color)", color: "var(--primary-color)" }
                            : { color: "var(--primary-color)" }
                    }
                  >
                    {button.text}
                    {button.icon && <span className="ml-2">{button.icon}</span>}
                  </a>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
