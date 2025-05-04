"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from 'lucide-react'

interface Section {
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundGradient?: {
    direction?: string;
    from: string;
    to: string;
  };
  backgroundImage?: string;
  title?: string;
  titleColor?: string;
  subtitle?: string;
  textColor?: string;
  media?: { type: "image" | "video"; fileId: string }[];
  ctaButtons?: { label?: string; url?: string; variant?: string }[];
  customFields?: {
    admissionSteps?: { title: string; description: string }[];
  };
}

export default function AdmissionsSection({ section }: { section: Section }) {
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
  
  // Get media for admissions section
  const admissionsMedia = section.media?.find(m => m.type === "image" || m.type === "video")
  
  // Get CTA buttons
  const ctaButtons = section.ctaButtons ?? []
  
  // Admission steps (could be customized via section.customFields)
  const admissionSteps = Array.isArray(section.customFields?.admissionSteps) ? section.customFields?.admissionSteps : [
    {
      title: "Submit Application",
      description: "Complete and submit the online application form with all required documents.",
    },
    {
      title: "Entrance Assessment",
      description: "Students may be required to take an entrance assessment appropriate for their grade level.",
    },
    {
      title: "Interview",
      description: "Selected candidates and their parents will be invited for an interview with school administrators.",
    },
    {
      title: "Admission Decision",
      description: "Admission decisions are communicated to families within two weeks of the interview.",
    },
    {
      title: "Enrollment",
      description: "Upon acceptance, complete the enrollment process by paying the required fees and submitting additional forms.",
    },
  ]
  
  return (
    <section
      id="admissions"
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
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial="hidden"
          animate={controls}
          variants={itemVariants}
        >
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            section.titleColor && `text-[${section.titleColor}]`
          )}>
            {section.title ?? "Admissions Process"}
          </h2>
          <p className={cn(
            "text-lg opacity-80",
            section.textColor && `text-[${section.textColor}]`
          )}>
            {section.subtitle ?? "Join our community of learners and start your educational journey with us."}
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8 items-center mb-16"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-xl">
              <h3 className="text-2xl font-bold mb-6">How to Apply</h3>
              <div className="space-y-6">
                {admissionSteps.map((step, index) => (
                  <motion.div 
                    key={index}
                    className="flex gap-4"
                    variants={itemVariants}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{step.title}</h4>
                      <p className="opacity-80 text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            {admissionsMedia ? (
              admissionsMedia.type === "video" ? (
                <video 
                  className="w-full h-auto rounded-xl shadow-2xl border border-white/20"
                  controls
                  src={`/api/convex/storage/${admissionsMedia.fileId}`}
                />
              ) : (
                <img 
                  src={`/api/convex/storage/${admissionsMedia.fileId}`}
                  alt="Admissions"
                  className="w-full h-auto rounded-xl shadow-2xl border border-white/20"
                />
              )
            ) : (
              <img 
                src="/placeholder.svg?height=400&width=600"
                alt="Admissions"
                className="w-full h-auto rounded-xl shadow-2xl border border-white/20"
              />
            )}
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-30 blur-xl" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full opacity-30 blur-xl" />
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center gap-4 mt-8"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {ctaButtons.map((button, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Button 
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
                variant={button.variant ?? "default"} 
                size="lg"
                className="gap-2 group"
                asChild
              >
                <a href={button.url ?? "#"}>
                  {button.label ?? "Apply Now"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </motion.div>
          ))}
          
          {ctaButtons.length === 0 && (
            <motion.div variants={itemVariants}>
              <Button 
                variant="default" 
                size="lg"
                className="gap-2 group"
              >
                Apply Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
