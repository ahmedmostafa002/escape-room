'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import ReCaptcha from "@/components/ui/recaptcha"
import { toast } from "@/hooks/use-toast"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [recaptchaError, setRecaptchaError] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token)
    setRecaptchaError(false)
  }

  const handleRecaptchaExpire = () => {
    setRecaptchaToken(null)
    setRecaptchaError(true)
  }

  const handleRecaptchaError = () => {
    setRecaptchaToken(null)
    setRecaptchaError(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!recaptchaToken) {
      setRecaptchaError(true)
      toast({
        title: "reCAPTCHA Required",
        description: "Please complete the reCAPTCHA verification.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // First verify reCAPTCHA
      const recaptchaResponse = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: recaptchaToken }),
      })

      const recaptchaResult = await recaptchaResponse.json()

      if (!recaptchaResult.success) {
        throw new Error('reCAPTCHA verification failed')
      }

      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      setRecaptchaToken(null)
      setRecaptchaError(false)

    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your name" 
            className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50" 
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Input 
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com" 
            className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50" 
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <Input 
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder="How can we help?" 
          className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50" 
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <Textarea 
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Describe your question or issue..." 
          rows={5} 
          className="focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 resize-none" 
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-center">
          <ReCaptcha
            onVerify={handleRecaptchaVerify}
            onExpire={handleRecaptchaExpire}
            onError={handleRecaptchaError}
            theme="light"
            size="normal"
            className="recaptcha-container"
          />
        </div>
        {recaptchaError && (
          <p className="text-sm text-red-500 text-center">
            Please complete the reCAPTCHA verification
          </p>
        )}
      </div>

      <Button 
        type="submit"
        disabled={isSubmitting || !recaptchaToken}
        className="w-full h-14 bg-gradient-to-r from-escape-red to-escape-red-700 hover:from-escape-red-700 hover:to-escape-red text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
