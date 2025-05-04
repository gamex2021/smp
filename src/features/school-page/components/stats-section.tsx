"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Users, Award, BookOpen, School, GraduationCap, Globe, Building, Star } from 'lucide-react'

interface Section {
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundGradient?: {
    direction?: string;
    from: string;
    to: string;
  };
  backgroundImage?: string;
  customFields?: {
    stats?: Array<{
      icon: string;
      value: string;
      label: string;
      color: string;
    }>;
  };
  title?: string;
  titleColor?: string;
  subtitle?: string;
  textColor?: string;
}

export default function StatsSection({ section }: { section: Section }) {
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
  
  const counterVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        duration: 0.8 
      },
    },
  }
  
  // Get stats from section or use defaults
  const stats = Array.isArray(section.customFields?.stats) ? section.customFields.stats : [
    {
      icon: "Users",
      value: "1200+",
      label: "Students",
      color: "#3b82f6"
    },
    {
      icon: "Award",
      value: "95%",
      label: "Success Rate",
      color: "#10b981"
    },
    {
      icon: "BookOpen",
      value: "50+",
      label: "Programs",
      color: "#8b5cf6"
    },
    {
      icon: "GraduationCap",
      value: "100+",
      label: "Expert Teachers",
      color: "#f59e0b"
    }
  ]
  
  // Map icon names to components
  const iconMap = {
    Users,
    Award,
    BookOpen,
    School,
    GraduationCap,
    Globe,
    Building,
    Star
  }

  console.log("these are the stats", stats)
  
  return (
    <section
      id="stats"
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
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate={controls}
          variants={itemVariants}
        >
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            section.titleColor && `text-[${section.titleColor}]`
          )}>
            {section.title ?? "Our Impact in Numbers"}
          </h2>
          <p className={cn(
            "text-lg opacity-80",
            section.textColor && `text-[${section.textColor}]`
          )}>
            {section.subtitle ?? "Discover the achievements and milestones that define our educational excellence."}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {stats?.map((stat, index) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || Users;
            
            return (
              <motion.div 
                key={index}
                className="text-center"
                variants={itemVariants}
              >
                <motion.div 
                  className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                  variants={counterVariants}
                >
                  <IconComponent 
                    className="w-8 h-8" 
                    style={{ color: stat.color }} 
                  />
                </motion.div>
                <motion.h3 
                  className="text-3xl md:text-4xl font-bold mb-2"
                  variants={counterVariants}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-sm md:text-base opacity-80">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  )
}
