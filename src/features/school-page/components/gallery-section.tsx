/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'

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
  media?: Array<{
    id: string;
    fileId?: string;
    caption?: string;
    description?: string;
    type: string;
  }>;
}

export default function GallerySection({ section }: { section: Section }) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [selectedImage, setSelectedImage] = useState(null)
  
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
  
  // Get gallery images
  const galleryImages = section.media?.filter(m => m.type === "image") ?? []
  
  // Default placeholder images if no images are provided
  const placeholderImages = [
    { id: "placeholder1", fileId: null, caption: "Campus View" },
    { id: "placeholder2", fileId: null, caption: "Library" },
    { id: "placeholder3", fileId: null, caption: "Science Lab" },
    { id: "placeholder4", fileId: null, caption: "Sports Field" },
    { id: "placeholder5", fileId: null, caption: "Auditorium" },
    { id: "placeholder6", fileId: null, caption: "Cafeteria" },
  ]
  
  const images = galleryImages.length > 0 ? galleryImages : placeholderImages
  
  return (
    <>
      <section
        id="gallery"
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
              {section.title ?? "Our Campus Gallery"}
            </h2>
            <p className={cn(
              "text-lg opacity-80",
              section.textColor && `text-[${section.textColor}]`
            )}>
              {section.subtitle ?? "Take a visual tour of our facilities and campus life."}
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate={controls}
            variants={containerVariants}
          >
            {images.map((image, index) => (
              <motion.div 
                key={image.id ?? index}
                className="relative group overflow-hidden rounded-xl cursor-pointer"
                variants={itemVariants}
                // @ts-expect-error
                onClick={() => setSelectedImage(image)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <img 
                  src={image.fileId ? `/api/convex/storage/${image.fileId}` : `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(image.caption ?? 'Gallery Image')}`}
                  alt={image.caption ?? `Gallery Image ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="w-full">
                    <p className="text-white font-medium">{image.caption ?? `Gallery Image ${index + 1}`}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-white/70">description goes here</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="bg-white/20 hover:bg-white/40 text-white"
                      >
                        <Expand className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            
            <div className="relative max-w-4xl w-full">
              <img 
               // @ts-expect-error
                src={selectedImage.fileId ? `/api/convex/storage/${selectedImage.fileId}` : `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(selectedImage.caption ?? 'Gallery Image')}`}
                 // @ts-expect-error
                alt={selectedImage.caption ?? "Gallery Image"}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
               {/* @ts-expect-error */}
                <h3 className="text-white text-xl font-medium">{selectedImage.caption ?? "Gallery Image"}</h3>
                {/* @ts-expect-error */}
                <p className="text-white/70">{selectedImage.description ?? ""}</p>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1/2 left-4 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={() => {
                {/* @ts-expect-error */}
                  const currentIndex = images.findIndex(img => img.id === selectedImage?.id);
                  const prevIndex = (currentIndex - 1 + images.length) % images.length;
                  // @ts-expect-error
                  setSelectedImage(images[prevIndex]);
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1/2 right-4 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={() => {
                {/* @ts-expect-error */}
                  const currentIndex = images.findIndex(img => img.id === selectedImage.id);
                  const nextIndex = (currentIndex + 1) % images.length;
                  {/* @ts-expect-error */}
                  setSelectedImage(images[nextIndex]);
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
