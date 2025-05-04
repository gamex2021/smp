"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ChevronDown, ChevronUp } from "lucide-react"

interface Section {
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundGradient?: {
    direction?: string;
    from: string;
    to: string;
  };
  backgroundImage?: string;
  title: string;
  subtitle: string;
}

interface FaqSectionProps {
  section: Section;
  faqItems?: {
    _id: string;
    question: string;
    answer: string;
    isActive: boolean;
  }[];
}

export default function FaqSection({ section, faqItems = [] }: FaqSectionProps) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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

  const toggleFaq = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // If no FAQ items, show placeholders
  if (faqItems.length === 0) {
    faqItems = [
      {
        _id: "placeholder1",
        question: "What are the school hours?",
        answer:
          "Our school hours are from 8:00 AM to 3:00 PM, Monday through Friday. We also offer before and after school programs for families who need extended care.",
        isActive: true,
      },
      {
        _id: "placeholder2",
        question: "What is the admission process?",
        answer:
          "The admission process involves submitting an application form, providing academic records, and attending an interview. Please contact our admissions office for more details.",
        isActive: true,
      },
      {
        _id: "placeholder3",
        question: "Do you offer transportation services?",
        answer:
          "Yes, we offer transportation services for students living within a 10-mile radius of the school. Additional fees may apply.",
        isActive: true,
      },
      {
        _id: "placeholder4",
        question: "What extracurricular activities are available?",
        answer:
          "We offer a wide range of extracurricular activities including sports, arts, music, drama, debate, and various clubs. Students are encouraged to participate in activities that interest them.",
        isActive: true,
      },
    ]
  }

  // Filter active FAQ items
  const activeFaqItems = faqItems.filter((item) => item.isActive)

  return (
    <section
      id="faq"
      className={cn("py-20", section.backgroundType === "image" && "text-white")}
      style={getBackgroundStyle()}
      ref={ref}
    >
      {/* Overlay for background images */}
      {section.backgroundType === "image" && <div className="absolute inset-0 bg-black/50" />}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.title}</h2>
          <p className="text-lg opacity-80">{section.subtitle}</p>
        </motion.div>

        <motion.div className="max-w-3xl mx-auto" initial="hidden" animate={controls} variants={containerVariants}>
          {activeFaqItems.map((faq, index) => (
            <motion.div key={faq._id} className="mb-4" variants={itemVariants}>
              <button
                className={cn(
                  "w-full text-left p-4 rounded-lg flex items-center justify-between transition-colors",
                  openIndex === index
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700",
                )}
                onClick={() => toggleFaq(index)}
                style={openIndex === index ? { backgroundColor: "var(--primary-color)" } : {}}
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 flex-shrink-0" />
                )}
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 bg-white dark:bg-gray-800 rounded-b-lg",
                  openIndex === index ? "max-h-96 p-4" : "max-h-0",
                )}
              >
                <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
