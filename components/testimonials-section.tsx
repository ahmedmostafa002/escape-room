"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: "Mike Chen",
      location: "New York, NY",
      rating: 5,
      text: "I've used Escape Rooms Finder to book over 20 different escape rooms across the country. The variety and quality of rooms listed here is unmatched.",
      image: "/placeholder-user.jpg",
    },
    {
      name: "Emily Rodriguez",
      location: "Austin, TX",
      rating: 5,
      text: "As an escape room enthusiast, I love how easy it is to discover new rooms and read authentic reviews. This platform is a game-changer!",
      image: "/placeholder-user.jpg",
    },
    {
      name: "David Thompson",
      location: "Chicago, IL",
      rating: 5,
      text: "The detailed information and photos helped us choose the perfect difficulty level for our group. We had an amazing time and can't wait to book another!",
      image: "/placeholder-user.jpg",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-12 bg-gradient-to-br from-[#00d4aa]/5 to-[#1a1f2e]/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear from thousands of satisfied adventure seekers
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <Card className="overflow-hidden shadow-2xl border-0">
            <CardContent className="p-12">
              <div className="flex items-center justify-between mb-8">
                <Quote className="h-12 w-12 text-[#8E44AD]/50" />
                <div className="flex gap-1">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-[#FF9500] text-[#FF9500]" />
                  ))}
                </div>
              </div>

              <blockquote className="text-2xl md:text-3xl text-gray-700 leading-relaxed mb-8 font-light italic">
                &ldquo;{testimonials[currentIndex].text}&rdquo;
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={testimonials[currentIndex].image || "/placeholder.svg"}
                    alt={`${testimonials[currentIndex].name} - Escape Room Customer Review`}
                    fill
                    sizes="64px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="font-bold text-lg">{testimonials[currentIndex].name}</div>
                  <div className="text-gray-600">{testimonials[currentIndex].location}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={prevTestimonial}
              className="rounded-full w-14 h-14 p-0 bg-transparent"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? "bg-[#00d4aa] w-8" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={nextTestimonial}
              className="rounded-full w-14 h-14 p-0 bg-transparent"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
