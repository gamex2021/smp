"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Linkedin, Twitter, Globe, Mail } from 'lucide-react'

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
  customFields?: {
    teamMembers?: Array<{
      name: string;
      role: string;
      bio: string;
      image?: string | null;
      social?: {
        linkedin?: string;
        twitter?: string;
        website?: string;
        email?: string;
      };
    }>;
  };
}

export default function TeamSection({ section }: { section: Section }) {
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
  
  // Get team members from section or use defaults
  const teamMembers = Array.isArray(section.customFields?.teamMembers) ? section?.customFields?.teamMembers : [
    {
      name: "Dr. Sarah Johnson",
      role: "Principal",
      bio: "With over 20 years of experience in education, Dr. Johnson leads our school with passion and vision.",
      image: null,
      social: {
        linkedin: "#",
        twitter: "#",
        website: "#",
        email: "principal@school.edu"
      }
    },
    {
      name: "Prof. Michael Chen",
      role: "Academic Director",
      bio: "Prof. Chen oversees our curriculum development and ensures academic excellence across all programs.",
      image: null,
      social: {
        linkedin: "#",
        twitter: "#",
        website: "#",
        email: "academic@school.edu"
      }
    },
    {
      name: "Ms. Emily Rodriguez",
      role: "Student Affairs",
      bio: "Ms. Rodriguez creates a supportive environment for students and manages extracurricular activities.",
      image: null,
      social: {
        linkedin: "#",
        twitter: "#",
        website: "#",
        email: "affairs@school.edu"
      }
    },
    {
      name: "Mr. David Wilson",
      role: "Technology Director",
      bio: "Mr. Wilson leads our digital transformation initiatives and manages educational technology.",
      image: null,
      social: {
        linkedin: "#",
        twitter: "#",
        website: "#",
        email: "tech@school.edu"
      }
    }
  ]
  
  return (
    <section
      id="team"
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
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl" />
      
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
            {section.title ?? "Meet Our Leadership Team"}
          </h2>
          <p className={cn(
            "text-lg opacity-80",
            section.textColor && `text-[${section.textColor}]`
          )}>
            {section.subtitle ?? "Get to know the dedicated professionals who guide our educational institution."}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {teamMembers.map((member, index) => (
            <motion.div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="relative mb-6 mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
                <img 
                  src={member.image ? `/api/convex/storage/${member.image}` : `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(member.name.charAt(0))}`}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <h3 className="text-xl font-bold text-center mb-1">{member.name}</h3>
              <p className="text-center text-sm opacity-70 mb-3">{member.role}</p>
              <p className="text-sm text-center mb-4 opacity-80">{member.bio}</p>
              
              <div className="flex justify-center space-x-3">
                {member.social?.linkedin && (
                  <a 
                    href={member.social.linkedin} 
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                
                {member.social?.twitter && (
                  <a 
                    href={member.social.twitter} 
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                
                {member.social?.website && (
                  <a 
                    href={member.social.website} 
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                
                {member.social?.email && (
                  <a 
                    href={`mailto:${member.social.email}`} 
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
