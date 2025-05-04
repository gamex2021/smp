"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface Section {
  backgroundType: "color" | "gradient" | "image" | "video";
  backgroundColor?: string;
  backgroundGradient?: {
    direction?: string;
    from: string;
    to: string;
  };
  backgroundImage?: string;
  backgroundVideo?: string;
  media?: { type: "image" | "video"; file: string; alt?: string }[];
  ctaButtons?: {
    _id: string;
    link: string;
    text: string;
    style: "primary" | "secondary" | "outline" | "ghost";
    icon?: boolean;
  }[];
  title: string;
  subtitle: string;
}

export default function HeroSection({ section }: { section: Section }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Get background style based on section configuration
  const getBackgroundStyle = () => {
    switch (section.backgroundType) {
      case "color":
        return { backgroundColor: section.backgroundColor ?? "transparent" }
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

  // Get media for hero section
  const heroMedia = section.media?.find((m) => m.type === "image" || m.type === "video")

  // Get CTA buttons
  const ctaButtons = section.ctaButtons ?? []

  return (
    <section
      id="hero"
      className={cn(
        "relative min-h-screen flex items-center py-20",
        section.backgroundType === "image" && "text-white",
      )}
      style={getBackgroundStyle()}
    >
      {/* Overlay for background images */}
      {section.backgroundType === "image" && <div className="absolute inset-0 bg-black/50" />}

      {/* Background video */}
      {section.backgroundType === "video" && section.backgroundVideo && (
        <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover">
          <source src={`/api/convex/storage/${section.backgroundVideo}`} type="video/mp4" />
        </video>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <div className="text-center md:text-left">
            <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" variants={itemVariants}>
              {section.title}
            </motion.h1>

            <motion.p className="text-lg md:text-xl mb-8 opacity-90" variants={itemVariants}>
              {section.subtitle}
            </motion.p>

            <motion.div className="flex flex-wrap gap-4 justify-center md:justify-start" variants={itemVariants}>
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
                  {button.icon && <ArrowRight className="ml-2 h-4 w-4" />}
                </a>
              ))}
            </motion.div>
          </div>

          {heroMedia && (
            <motion.div className="hidden md:block" variants={itemVariants}>
              {heroMedia.type === "image" ? (
                <img
                  src={`/api/convex/storage/${heroMedia.file}`}
                  alt={heroMedia.alt ?? section.title}
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              ) : (
                <video autoPlay muted loop controls className="w-full h-auto rounded-lg shadow-xl">
                  <source src={`/api/convex/storage/${heroMedia.file}`} type="video/mp4" />
                </video>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      >
        <svg className="w-6 h-12" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="22" height="46" rx="11" stroke="currentColor" strokeWidth="2" />
          <circle className="animate-bounce" cx="12" cy="16" r="4" fill="currentColor" />
        </svg>
      </motion.div>
    </section>
  )
}
