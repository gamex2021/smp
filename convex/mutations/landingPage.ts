import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { checkAdmin } from "./helpers";

// Submit contact form
export const submitContactForm = mutation({
  args: {
    schoolId: v.id("schools"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    type: v.union(
      v.literal("general"),
      v.literal("admission"),
      v.literal("support"),
      v.literal("other")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactSubmissions", {
      ...args,
      status: "new",
      createdAt: new Date().toISOString(),
    });
  },
});


// Update landing page theme and configuration
export const updateLandingPageConfig = mutation({
  args: {
    schoolId: v.id("schools"),
    theme: v.object({
      primaryColor: v.string(),
      secondaryColor: v.string(),
      accentColor: v.string(),
      fontFamily: v.string(),
      buttonStyle: v.union(v.literal("rounded"), v.literal("pill"), v.literal("square")),
      darkMode: v.boolean(),
    }),
    logo: v.optional(v.id("_storage")),
    favicon: v.optional(v.id("_storage")),
    metaData: v.object({
      title: v.string(),
      description: v.string(),
      keywords: v.array(v.string()),
      ogImage: v.optional(v.id("_storage")),
    }),
    customCss: v.optional(v.string()),
    customJs: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify admin permissions
    await checkAdmin(ctx)

    // Check if config already exists
    const existingConfig = await ctx.db
      .query("landingPageConfig")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .first()

    if (existingConfig) {
      // Update existing config
      return await ctx.db.patch(existingConfig._id, {
        ...args,
        lastUpdated: Date.now(),
      })
    } else {
      // Create new config
      return await ctx.db.insert("landingPageConfig", {
        ...args,
        isActive: true,
        lastUpdated: Date.now(),
      })
    }
  },
})

// Reorder landing page sections
export const reorderLandingPageSections = mutation({
  args: {
    schoolId: v.id("schools"),
    sectionIds: v.array(v.id("landingPageSections")),
  },
  handler: async (ctx, args) => {
    // Verify admin permissions
    await checkAdmin(ctx)

    // Update order for each section
    for (let i = 0; i < args.sectionIds.length; i++) {
      const sectionId = args.sectionIds[i]
      const section = await ctx.db.get(sectionId)

      if (!section || section.schoolId !== args.schoolId) {
        throw new Error(`Section ${sectionId} not found or access denied`)
      }

      await ctx.db.patch(sectionId, {
        order: i,
        lastUpdated: Date.now(),
      })
    }

    return { success: true }
  },
})


// Initialize default landing page configuration and sections
export const initializeDefaultLandingPage = mutation({
  args: {
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    const { schoolId } = args

    // Check if landing page config already exists
    const existingConfig = await ctx.db
      .query("landingPageConfig")
      .withIndex("by_school", (q) => q.eq("schoolId", schoolId))
      .first()

    // If config doesn't exist, create default config
    if (!existingConfig) {
      await ctx.db.insert("landingPageConfig", {
        schoolId,
        theme: {
          primaryColor: "#2E8B57", // Sea Green
          secondaryColor: "#4B6CB7", // Royal Blue
          accentColor: "#F59E0B", // Amber
          fontFamily: "Inter, sans-serif",
          buttonStyle: "rounded",
          darkMode: false,
        },
        metaData: {
          title: "Welcome to Our School",
          description: "A place for learning, growth, and excellence",
          keywords: ["education", "school", "learning", "academics"],
        },
        isActive: true,
        lastUpdated: Date.now(),
      })
    }

    // Check if sections already exist
    const existingSections = await ctx.db
      .query("landingPageSections")
      .withIndex("by_school", (q) => q.eq("schoolId", schoolId))
      .collect()

    // If no sections exist, create default sections
    if (existingSections.length === 0) {
      // Create Hero Section
      const heroSection = await ctx.db.insert("landingPageSections", {
        schoolId,
        type: "hero",
        title: "Welcome to Excellence in Education",
        subtitle:
          "Empowering minds, shaping futures, and building tomorrow's leaders through quality education and innovative learning experiences.",
        order: 0,
        isActive: true,
        backgroundType: "gradient",
        backgroundGradient: {
          from: "#4B6CB7",
          to: "#182848",
          direction: "to bottom right",
        },
        lastUpdated: Date.now(),
      })

      // Create About Section
      const aboutSection = await ctx.db.insert("landingPageSections", {
        schoolId,
        type: "about",
        title: "About Our School",
        subtitle: "A tradition of excellence since 1995",
        content:
          "<p>Our school is dedicated to providing a nurturing and stimulating environment where students can develop intellectually, socially, and emotionally. We believe in a holistic approach to education that prepares students for the challenges of the future.</p><p>With dedicated teachers, state-of-the-art facilities, and a comprehensive curriculum, we strive to bring out the best in every student and help them achieve their full potential.</p>",
        order: 1,
        isActive: true,
        backgroundType: "color",
        backgroundColor: "#ffffff",
        lastUpdated: Date.now(),
      })

      // Create Features Section
      const featuresSection = await ctx.db.insert("landingPageSections", {
        schoolId,
        type: "features",
        title: "Why Choose Us",
        subtitle: "Discover what makes our educational approach unique",
        order: 2,
        isActive: true,
        backgroundType: "color",
        backgroundColor: "#f9fafb",
        customFields: {
          features: JSON.stringify([
            {
              title: "Quality Education",
              description:
                "Our curriculum is designed to provide the highest quality education with a focus on critical thinking and problem-solving skills.",
            },
            {
              title: "Expert Teachers",
              description:
                "Learn from experienced educators who are experts in their fields and passionate about student success.",
            },
            {
              title: "Modern Facilities",
              description:
                "Access to state-of-the-art facilities including labs, libraries, and digital learning resources.",
            },
            {
              title: "Personalized Learning",
              description: "Tailored learning experiences to meet individual student needs and learning styles.",
            },
            {
              title: "Extracurricular Activities",
              description:
                "A wide range of activities to develop well-rounded students with diverse interests and talents.",
            },
            {
              title: "Safe Environment",
              description:
                "A secure and nurturing environment where students can focus on learning and personal growth.",
            },
          ]),
        },
        lastUpdated: Date.now(),
      })

      // Create Testimonials Section
      const testimonialsSection = await ctx.db.insert("landingPageSections", {
        schoolId,
        type: "testimonials",
        title: "What Our Community Says",
        subtitle: "Hear from our students, parents, and alumni",
        order: 3,
        isActive: true,
        backgroundType: "color",
        backgroundColor: "#ffffff",
        lastUpdated: Date.now(),
      })

      // Create default testimonials
      await ctx.db.insert("testimonials", {
        schoolId,
        name: "John Doe",
        role: "Parent",
        content:
          "The school has been an amazing place for my child to learn and grow. The teachers are dedicated and the curriculum is excellent.",
        rating: 5,
        isActive: true,
        order: 0,
      })

      await ctx.db.insert("testimonials", {
        schoolId,
        name: "Jane Smith",
        role: "Student",
        content:
          "I've had a wonderful experience at this school. The teachers are supportive and the learning environment is fantastic.",
        rating: 5,
        isActive: true,
        order: 1,
      })

      await ctx.db.insert("testimonials", {
        schoolId,
        name: "Robert Johnson",
        role: "Alumni",
        content:
          "My education at this school prepared me well for college and beyond. I'm grateful for the foundation it provided.",
        rating: 5,
        isActive: true,
        order: 2,
      })

      // Create Stats Section
      const statsSection = await ctx.db.insert("landingPageSections", {
        schoolId,
        type: "stats",
        title: "Our Impact in Numbers",
        subtitle: "Discover the achievements and milestones that define our educational excellence",
        order: 4,
        isActive: true,
        backgroundType: "gradient",
        backgroundGradient: {
          from: "#2E8B57",
          to: "#3CB371",
          direction: "to right",
        },
        customFields: {
          stats: JSON.stringify([
            {
              icon: "Users",
              value: "1200+",
              label: "Students",
              color: "#3b82f6",
            },
            {
              icon: "Award",
              value: "95%",
              label: "Success Rate",
              color: "#10b981",
            },
            {
              icon: "BookOpen",
              value: "50+",
              label: "Programs",
              color: "#8b5cf6",
            },
            {
              icon: "GraduationCap",
              value: "100+",
              label: "Expert Teachers",
              color: "#f59e0b",
            },
          ]),
        },
        lastUpdated: Date.now(),
      })

      // Create FAQ Section
      const faqSection = await ctx.db.insert("landingPageSections", {
        schoolId,
        type: "faq",
        title: "Frequently Asked Questions",
        subtitle: "Find answers to common questions about our school and programs",
        order: 5,
        isActive: true,
        backgroundType: "color",
        backgroundColor: "#f9fafb",
        lastUpdated: Date.now(),
      })

      // Create default FAQ items
      await ctx.db.insert("faqItems", {
        schoolId,
        question: "What are the school hours?",
        answer:
          "Our school hours are from 8:00 AM to 3:00 PM, Monday through Friday. We also offer before and after school programs for families who need extended care.",
        isActive: true,
        order: 0,
      })

      await ctx.db.insert("faqItems", {
        schoolId,
        question: "What is the admission process?",
        answer:
          "The admission process involves submitting an application form, providing academic records, and attending an interview. Please contact our admissions office for more details.",
        isActive: true,
        order: 1,
      })

      await ctx.db.insert("faqItems", {
        schoolId,
        question: "Do you offer transportation services?",
        answer:
          "Yes, we offer transportation services for students living within a 10-mile radius of the school. Additional fees may apply.",
        isActive: true,
        order: 2,
      })

      await ctx.db.insert("faqItems", {
        schoolId,
        question: "What extracurricular activities are available?",
        answer:
          "We offer a wide range of extracurricular activities including sports, arts, music, drama, debate, and various clubs. Students are encouraged to participate in activities that interest them.",
        isActive: true,
        order: 3,
      })

      // Create Admissions Section
      const admissionsSection = await ctx.db.insert("landingPageSections", {
        schoolId,
        type: "admissions",
        title: "Admissions Process",
        subtitle: "Join our community of learners and start your educational journey with us",
        order: 6,
        isActive: true,
        backgroundType: "color",
        backgroundColor: "#ffffff",
        customFields: {
          admissionSteps: JSON.stringify([
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
              description:
                "Selected candidates and their parents will be invited for an interview with school administrators.",
            },
            {
              title: "Admission Decision",
              description: "Admission decisions are communicated to families within two weeks of the interview.",
            },
            {
              title: "Enrollment",
              description:
                "Upon acceptance, complete the enrollment process by paying the required fees and submitting additional forms.",
            },
          ]),
        },
        lastUpdated: Date.now(),
      })

      // Create CTA Section
      const ctaSection = await ctx.db.insert("landingPageSections", {
        schoolId,
        type: "cta",
        title: "Ready to Join Our School?",
        subtitle: "Take the first step towards a bright future for your child",
        order: 7,
        isActive: true,
        backgroundType: "gradient",
        backgroundGradient: {
          from: "#4B6CB7",
          to: "#182848",
          direction: "to right",
        },
        ctaButtons : [
          {
            text: "Apply Now",
            link: "/admissions",
            style: "primary",
          },
          {
            text: "Schedule a Tour",
            link: "/contact",
            style: "outline",
          }
        ],
        lastUpdated: Date.now(),
      })

      

      // Create Gallery Section
      const gallerySection = await ctx.db.insert("landingPageSections", {
        schoolId,
        type: "gallery",
        title: "Our Campus Gallery",
        subtitle: "Take a visual tour of our facilities and campus life",
        order: 8,
        isActive: true,
        backgroundType: "color",
        backgroundColor: "#f9fafb",
        lastUpdated: Date.now(),
      })

      // Create Team Section
      const teamSection = await ctx.db.insert("landingPageSections", {
        schoolId,
        type: "team",
        title: "Meet Our Leadership Team",
        subtitle: "Get to know the dedicated professionals who guide our educational institution",
        order: 9,
        isActive: true,
        backgroundType: "color",
        backgroundColor: "#ffffff",
        customFields: {
          teamMembers: JSON.stringify([
            {
              name: "Dr. Sarah Johnson",
              role: "Principal",
              bio: "With over 20 years of experience in education, Dr. Johnson leads our school with passion and vision.",
              social: {
                linkedin: "#",
                twitter: "#",
                email: "principal@school.edu",
              },
            },
            {
              name: "Prof. Michael Chen",
              role: "Academic Director",
              bio: "Prof. Chen oversees our curriculum development and ensures academic excellence across all programs.",
              social: {
                linkedin: "#",
                twitter: "#",
                email: "academic@school.edu",
              },
            },
            {
              name: "Ms. Emily Rodriguez",
              role: "Student Affairs",
              bio: "Ms. Rodriguez creates a supportive environment for students and manages extracurricular activities.",
              social: {
                linkedin: "#",
                email: "affairs@school.edu",
              },
            },
            {
              name: "Mr. David Wilson",
              role: "Technology Director",
              bio: "Mr. Wilson leads our digital transformation initiatives and manages educational technology.",
              social: {
                linkedin: "#",
                website: "#",
                email: "tech@school.edu",
              },
            },
          ]),
        },
        lastUpdated: Date.now(),
      })

      // Create Contact Section
      const contactSection = await ctx.db.insert("landingPageSections", {
        schoolId,
        type: "contact",
        title: "Get in Touch",
        subtitle: "We'd love to hear from you. Reach out with any questions or inquiries.",
        order: 10,
        isActive: true,
        backgroundType: "color",
        backgroundColor: "#ffffff",
        lastUpdated: Date.now(),
      })

      // Create Custom Section (example)
      const customSection = await ctx.db.insert("landingPageSections", {
        schoolId,
        type: "custom",
        title: "Our Philosophy",
        subtitle: "The principles that guide our educational approach",
        content:
          "<p>At our school, we believe that education is not just about academic achievement, but about developing the whole person. Our philosophy is centered around these core principles:</p><ul><li><strong>Respect:</strong> We foster mutual respect among students, teachers, and staff.</li><li><strong>Excellence:</strong> We strive for excellence in all aspects of education.</li><li><strong>Innovation:</strong> We embrace innovative teaching methods and technologies.</li><li><strong>Community:</strong> We build a strong sense of community and belonging.</li></ul>",
        order: 11,
        isActive: true,
        backgroundType: "color",
        backgroundColor: "#f9fafb",
        customFields: {
          layout: "centered",
          htmlContent:
            "<div class='text-center'><p class='mb-4'>At our school, we believe that education is not just about academic achievement, but about developing the whole person. Our philosophy is centered around these core principles:</p><div class='grid grid-cols-2 md:grid-cols-4 gap-4 mt-8'><div class='p-4 bg-white/20 backdrop-blur-sm rounded-lg'><h3 class='font-bold text-lg mb-2'>Respect</h3><p>We foster mutual respect among students, teachers, and staff.</p></div><div class='p-4 bg-white/20 backdrop-blur-sm rounded-lg'><h3 class='font-bold text-lg mb-2'>Excellence</h3><p>We strive for excellence in all aspects of education.</p></div><div class='p-4 bg-white/20 backdrop-blur-sm rounded-lg'><h3 class='font-bold text-lg mb-2'>Innovation</h3><p>We embrace innovative teaching methods and technologies.</p></div><div class='p-4 bg-white/20 backdrop-blur-sm rounded-lg'><h3 class='font-bold text-lg mb-2'>Community</h3><p>We build a strong sense of community and belonging.</p></div></div></div>",
        },
        lastUpdated: Date.now(),
      })
    }

    return { success: true, message: "Default landing page initialized successfully" }
  },
})
