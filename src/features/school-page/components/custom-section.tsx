/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import parse from "html-react-parser"

interface Section {
  id?: string;
  title?: string;
  subtitle?: string;
  backgroundType?: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundGradient?: {
    direction?: string;
    from: string;
    to: string;
  };
  backgroundImage?: string;
  titleColor?: string;
  textColor?: string;
  ctaButtons?: Array<{
    label: string;
    url?: string;
    variant?: string;
  }>;
  media?: Array<{
    type: "image" | "video";
    fileId: string;
  }>;
  customFields?: {
    htmlContent?: string;
    layout?: "centered" | "left-media" | "right-media";
  };
}

export default function CustomSection({ section }: { section: Section }) {
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

  // Get CTA buttons
  const ctaButtons = section.ctaButtons ?? []

  // Get media for custom section
  const customMedia = section.media?.find((m) => m.type === "image" || m.type === "video")

  // Get custom HTML content
  const customContent =
    section.customFields?.htmlContent ?? "<p>Custom content goes here. You can edit this in the admin dashboard.</p>"

  // Get layout type
  const layoutType = section.customFields?.layout ?? "centered" // centered, left-media, right-media

  return (
    <section
      id={section.id ?? "custom-section"}
      className={cn("py-20 relative overflow-hidden", section.backgroundType === "image" && "text-white")}
      style={getBackgroundStyle()}
      ref={ref}
    >
      {/* Overlay for background images */}
      {section.backgroundType === "image" && <div className="absolute inset-0 bg-black/50 z-0" />}

      {/* Decorative elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className={cn("max-w-4xl mx-auto", layoutType === "centered" && "text-center")}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {/* Title and subtitle */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2
              className={cn(
                "text-3xl md:text-4xl font-bold mb-4",
                section.titleColor && `text-[${section.titleColor}]`,
              )}
            >
              {section.title ?? "Custom Section"}
            </h2>
            {section.subtitle && (
              <p className={cn("text-lg opacity-80", section.textColor && `text-[${section.textColor}]`)}>
                {section.subtitle}
              </p>
            )}
          </motion.div>

          {/* Content based on layout */}
          {layoutType === "centered" ? (
            <>
              {/* Media */}
              {customMedia && (
                <motion.div variants={itemVariants} className="mb-8">
                  {customMedia.type === "video" ? (
                    <video
                      className="w-full h-auto rounded-xl shadow-2xl border border-white/20 mx-auto max-w-2xl"
                      controls
                      src={`/api/convex/storage/${customMedia.fileId}`}
                    />
                  ) : (
                    <img
                      src={`/api/convex/storage/${customMedia.fileId}`}
                      alt={section.title ?? "Custom Section"}
                      className="w-full h-auto rounded-xl shadow-2xl border border-white/20 mx-auto max-w-2xl"
                    />
                  )}
                </motion.div>
              )}

              {/* Custom HTML content */}
              <motion.div
                variants={itemVariants}
                className={cn("prose prose-lg max-w-none", section.backgroundType === "image" && "prose-invert")}
              >
                {parse(customContent)}
              </motion.div>
            </>
          ) : (
            <div
              className={cn(
                "grid md:grid-cols-2 gap-8 items-center",
                layoutType === "right-media" && "md:grid-flow-dense",
              )}
            >
              {/* Content */}
              <motion.div variants={itemVariants}>
                <div className={cn("prose prose-lg max-w-none", section.backgroundType === "image" && "prose-invert")}>
                  {parse(customContent)}
                </div>
              </motion.div>

              {/* Media */}
              <motion.div variants={itemVariants} className={cn(layoutType === "right-media" ? "md:col-start-2" : "")}>
                {customMedia ? (
                  customMedia.type === "video" ? (
                    <video
                      className="w-full h-auto rounded-xl shadow-2xl border border-white/20"
                      controls
                      src={`/api/convex/storage/${customMedia.fileId}`}
                    />
                  ) : (
                    <img
                      src={`/api/convex/storage/${customMedia.fileId}`}
                      alt={section.title ?? "Custom Section"}
                      className="w-full h-auto rounded-xl shadow-2xl border border-white/20"
                    />
                  )
                ) : (
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt={section.title ?? "Custom Section"}
                    className="w-full h-auto rounded-xl shadow-2xl border border-white/20"
                  />
                )}
              </motion.div>
            </div>
          )}

          {/* CTA Buttons */}
          {ctaButtons.length > 0 && (
            <motion.div
              className={cn(
                "flex flex-wrap gap-4 mt-8",
                layoutType === "centered" ? "justify-center" : "justify-start",
              )}
              variants={itemVariants}
            >
              {ctaButtons.map((button, index) => (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-expect-error
                <Button key={index} variant={button.variant ?? "default"} size="lg" className="gap-2 group" asChild>
                  <a href={button.url ?? "#"}>
                    {button.label}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
