"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

interface Section {
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundGradient?: {
    direction?: string;
    from: string;
    to: string;
  };
  backgroundImage?: string;
  ctaButtons?: {
    label: string;
    url: string;
    variant: "default" | "outline";
  }[];
  media?: {
    type: "image" | "video";
    fileId: string;
  }[];
  title?: string;
  titleColor?: string;
  subtitle?: string;
  textColor?: string;
}

export default function CTASection({ section }: { section: Section }) {
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
  const ctaButtons = section.ctaButtons ?? [
    {
      label: "Get Started",
      url: "#",
      variant: "default"
    },
    {
      label: "Learn More",
      url: "#",
      variant: "outline"
    }
  ]
  
  // Get media for CTA section
  const ctaMedia = section.media?.find(m => m.type === "image" || m.type === "video")
  
  return (
    <section
      id="cta"
      className={cn(
        "py-20 relative overflow-hidden",
        section.backgroundType === "image" && "text-white"
      )}
      style={getBackgroundStyle()}
      ref={ref}
    >
      {/* Overlay for background images */}
      {section.backgroundType === "image" && (
        <div className="absolute inset-0 bg-black/50 z-0" />
      )}
      
      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20 shadow-xl"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div variants={itemVariants}>
              <h2 className={cn(
                "text-3xl md:text-4xl font-bold mb-4",
                section.titleColor && `text-[${section.titleColor}]`
              )}>
                {section.title ?? "Ready to Transform Education?"}
              </h2>
              <p className={cn(
                "text-lg mb-6 opacity-80",
                section.textColor && `text-[${section.textColor}]`
              )}>
                {section.subtitle ?? "Join our innovative learning community and discover a world of opportunities for growth and success."}
              </p>
              
              <div className="flex flex-wrap gap-4">
                {ctaButtons.map((button, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Button 
                      variant={button.variant || "default"} 
                      size="lg"
                      className="gap-2 group"
                      asChild
                    >
                      <a href={button.url || "#"}>
                        {button.label}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative">
              {ctaMedia ? (
                ctaMedia.type === "video" ? (
                  <video 
                    className="w-full h-auto rounded-xl shadow-2xl border border-white/20"
                    controls
                    src={`/api/convex/storage/${ctaMedia.fileId}`}
                  />
                ) : (
                  <img 
                    src={`/api/convex/storage/${ctaMedia.fileId}`}
                    alt="Call to Action"
                    className="w-full h-auto rounded-xl shadow-2xl border border-white/20"
                  />
                )
              ) : (
                <img 
                  src="/placeholder.svg?height=300&width=400"
                  alt="Call to Action"
                  className="w-full h-auto rounded-xl shadow-2xl border border-white/20"
                />
              )}
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-70 blur-lg" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full opacity-70 blur-lg" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
