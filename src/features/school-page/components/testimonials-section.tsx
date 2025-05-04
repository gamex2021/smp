"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

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

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  rating?: number;
  avatar?: string;
}

export default function TestimonialsSection({ section, testimonials = [] }: { section: Section; testimonials?: Array<Testimonial> }) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [currentIndex, setCurrentIndex] = useState(0)

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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  // If no testimonials, show placeholder
  if (testimonials.length === 0) {
    testimonials = [
      {
        _id: "placeholder1",
        name: "John Doe",
        role: "Parent",
        content:
          "The school has been an amazing place for my child to learn and grow. The teachers are dedicated and the curriculum is excellent.",
        rating: 5,
      },
      {
        _id: "placeholder2",
        name: "Jane Smith",
        role: "Student",
        content:
          "I've had a wonderful experience at this school. The teachers are supportive and the learning environment is fantastic.",
        rating: 5,
      },
    ]
  }

  return (
    <section
      id="testimonials"
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

        <motion.div
          className="max-w-4xl mx-auto relative"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <div className="absolute -top-10 left-0 opacity-20">
            <Quote className="h-24 w-24 text-primary" style={{ color: "var(--primary-color)" }} />
          </div>

          <div className="relative z-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial._id}
                className={cn("transition-opacity duration-500", index === currentIndex ? "block" : "hidden")}
                variants={itemVariants}
              >
                <div className="mb-8">
                  <p className="text-lg md:text-xl italic text-gray-700 dark:text-gray-300">&apos;{testimonial.content}&apos;</p>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4">
                    {testimonial.avatar ? (
                      <img
                        src={`/api/convex/storage/${testimonial.avatar}`}
                        alt={testimonial.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center bg-primary text-white rounded-full"
                        style={{ backgroundColor: "var(--primary-color)" }}
                      >
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>

                  {testimonial.rating && (
                    <div className="ml-auto flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg
                          key={i}
                          className={cn("w-5 h-5", i < (testimonial.rating ?? 0) ? "text-yellow-400" : "text-gray-300")}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {testimonials.length > 1 && (
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}

          <div className="flex justify-center mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-3 h-3 rounded-full mx-1 transition-colors",
                  index === currentIndex
                    ? "bg-primary"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500",
                )}
                style={index === currentIndex ? { backgroundColor: "var(--primary-color)" } : {}}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
