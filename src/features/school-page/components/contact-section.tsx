/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "~/_generated/api"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { type Id } from "~/_generated/dataModel"

interface Section {
  title: string;
  subtitle: string;
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundGradient?: {
    direction?: string;
    from: string;
    to: string;
  };
  backgroundImage?: string;
}

export default function ContactSection({ section, schoolId }: { section: Section; schoolId: Id<"schools"> }) {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    message: string;
    type: "general" | "admission" | "support" | "other";
  }>({
    name: "",
    email: "",
    phone: "",
    message: "",
    type: "general",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const submitContactForm = useMutation(api.mutations.landingPage.submitContactForm)

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      await submitContactForm({
        schoolId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
        type: formData.type,
      })

      setSubmitSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        type: "general",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitError("There was an error submitting your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

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

  return (
    <section
      id="contact"
      className={cn("py-20", section.backgroundType === "image" && "text-white")}
      style={getBackgroundStyle()}
    >
      {/* Overlay for background images */}
      {section.backgroundType === "image" && <div className="absolute inset-0 bg-black/50" />}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.title}</h2>
            <p className="text-lg opacity-80">{section.subtitle}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-primary text-white p-8">
                <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
                <p className="mb-8">
                  We&apos;d love to hear from you. Fill out the form and we&apos;ll get back to you as soon as possible.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 mr-4 mt-1" />
                    <div>
                      <h4 className="font-medium">Address</h4>
                      <p className="opacity-80">123 School Street, City, State, ZIP</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-6 w-6 mr-4 mt-1" />
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <p className="opacity-80">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="h-6 w-6 mr-4 mt-1" />
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="opacity-80">info@schooldomain.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your message has been sent successfully. We&apos;ll get back to you soon.
                    </p>
                    <button className="mt-6 text-primary font-medium" onClick={() => setSubmitSuccess(false)}>
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Inquiry Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="admission">Admission Information</option>
                        <option value="support">Technical Support</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      ></textarea>
                    </div>

                    {submitError && <div className="text-red-500 text-sm">{submitError}</div>}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
