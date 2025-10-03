"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, MapPin, Clock, Users, DollarSign, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"
import { getAllStatesFromDatabase } from "@/lib/supabase"
import { submitPendingListing, updatePendingListing, getPendingListingById, PendingListingData } from "@/lib/pending-listings"
import { getCitiesByState, getZipCodesByCity, CityOption, ZipCodeOption } from "@/lib/location-data"
import { uploadMultipleImages, validateImageFile } from "@/lib/image-upload"
import { useAuth } from "@/components/auth/AuthProvider"
import Link from "next/link"

export default function AddListingPage() {
  const { user, loading } = useAuth()
  
  // All state declarations must be at the top, before any conditional returns
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [states, setStates] = useState<string[]>([])
  const [cities, setCities] = useState<CityOption[]>([])
  const [zipCodes, setZipCodes] = useState<ZipCodeOption[]>([])
  const [loadingStates, setLoadingStates] = useState(true)
  const [loadingCities, setLoadingCities] = useState(false)
  const [loadingZipCodes, setLoadingZipCodes] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [isLoadingListing, setIsLoadingListing] = useState(false)
  
  // Form state - moved to top with other state declarations
  const [formData, setFormData] = useState({
    escape_room_name: '',
    business_name: '',
    website: '',
    description: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    duration_minutes: 60,
    min_players: 2,
    max_players: 6,
    difficulty_level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    price_per_person: 35,
    phone_number: '',
    email: ''
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth'
    }
  }, [user, loading])

  // All useEffect hooks must be at the top, before any conditional returns
  useEffect(() => {
    const loadStates = async () => {
      try {
        const { data } = await getAllStatesFromDatabase()
        setStates(data || [])
      } catch (error) {
        console.error('Error loading states:', error)
      } finally {
        setLoadingStates(false)
      }
    }
    loadStates()
  }, [])


  const loadCitiesByState = async (state: string) => {
    setLoadingCities(true)
    try {
      const result = await getCitiesByState(state)
      if (result.success && result.cities) {
        setCities(result.cities)
      }
    } catch (error) {
      console.error('Error loading cities:', error)
    } finally {
      setLoadingCities(false)
    }
  }

  const loadZipCodesByCity = async (city: string, state: string) => {
    setLoadingZipCodes(true)
    try {
      const result = await getZipCodesByCity(city, state)
      if (result.success && result.zipCodes) {
        setZipCodes(result.zipCodes)
      }
    } catch (error) {
      console.error('Error loading zip codes:', error)
    } finally {
      setLoadingZipCodes(false)
    }
  }

  // Load cities when state changes
  useEffect(() => {
    if (formData.state) {
      loadCitiesByState(formData.state)
    } else {
      setCities([])
    }
  }, [formData.state])

  // Load zip codes when city changes
  useEffect(() => {
    if (formData.city && formData.state) {
      loadZipCodesByCity(formData.city, formData.state)
    } else {
      setZipCodes([])
    }
  }, [formData.city, formData.state])

  const loadListingForEdit = useCallback(async (id: string) => {
    setIsLoadingListing(true)
    setSubmitMessage(null)
    
    try {
      const result = await getPendingListingById(id)
      
      if (result.success && result.listing) {
        const listing = result.listing
        
        // Populate form data
        setFormData({
          escape_room_name: listing.escape_room_name,
          business_name: listing.business_name || '',
          website: listing.website || '',
          description: listing.description,
          street_address: listing.street_address,
          city: listing.city,
          state: listing.state,
          zip_code: listing.zip_code,
          duration_minutes: listing.duration_minutes,
          min_players: listing.min_players,
          max_players: listing.max_players,
          difficulty_level: listing.difficulty_level,
          price_per_person: listing.price_per_person,
          phone_number: listing.phone_number,
          email: listing.email
        })
        
        // Set themes
        setSelectedThemes(listing.themes || [])
        
        // Set images
        setImages(listing.images || [])
        
        // Load cities and zip codes for the selected state
        if (listing.state) {
          await loadCitiesByState(listing.state)
          if (listing.city) {
            await loadZipCodesByCity(listing.city, listing.state)
          }
        }
        
        setSubmitMessage({ 
          type: 'success', 
          text: `Edit mode activated! You can now modify your listing "${listing.escape_room_name}".` 
        })
      } else {
        setSubmitMessage({ 
          type: 'error', 
          text: result.error || 'Failed to load listing for editing' 
        })
      }
    } catch (error) {
      console.error('Error loading listing for edit:', error)
      setSubmitMessage({ 
        type: 'error', 
        text: 'An error occurred while loading the listing for editing' 
      })
    } finally {
      setIsLoadingListing(false)
    }
  }, [])

  // Handle edit mode - check for edit parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const editIdParam = urlParams.get('edit')
    
    if (editIdParam && user) {
      setIsEditMode(true)
      setEditId(editIdParam)
      loadListingForEdit(editIdParam)
    }
  }, [user, loadListingForEdit])

  // Show loading while checking authentication or loading listing for edit
  if (loading || isLoadingListing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-escape-red mx-auto mb-4"></div>
          <p className="text-gray-600">{isLoadingListing ? 'Loading listing for editing...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Login Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">You need to be logged in to add a listing.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth">
                <Button className="bg-escape-red hover:bg-escape-red-700">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="outline" className="border-escape-red text-escape-red hover:bg-escape-red hover:text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }


  const themes = [
    "Horror",
    "Mystery",
    "Adventure",
    "Sci-Fi",
    "Fantasy",
    "Historical",
    "Crime",
    "Zombie",
    "Prison Break",
    "Heist",
    "Detective",
    "Pirate",
  ]

  const addTheme = (theme: string) => {
    if (!selectedThemes.includes(theme)) {
      setSelectedThemes([...selectedThemes, theme])
    }
  }

  const removeTheme = (theme: string) => {
    setSelectedThemes(selectedThemes.filter((t) => t !== theme))
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploadingImages(true)
    setUploadProgress(0)
    setSubmitMessage(null)

    try {
      // Validate files
      const validFiles: File[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const validation = validateImageFile(file)
        if (validation.valid) {
          validFiles.push(file)
        } else {
          setSubmitMessage({ type: 'error', text: validation.error || 'Invalid file format' })
          return
        }
      }

      if (validFiles.length === 0) {
        setSubmitMessage({ type: 'error', text: 'No valid images selected' })
        return
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // Upload images
      const result = await uploadMultipleImages(validFiles)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      if (result.success && result.urls) {
        console.log('Upload successful, URLs received:', result.urls)
        setImages(prev => {
          const newImages = [...prev, ...result.urls!]
          console.log('Updated images array:', newImages)
          return newImages
        })
        setSubmitMessage({ type: 'success', text: `Successfully uploaded ${result.urls.length} image(s)` })
        
        // Reset progress after a short delay
        setTimeout(() => {
          setUploadProgress(0)
        }, 2000)
      } else {
        console.log('Upload failed:', result.error)
        setSubmitMessage({ type: 'error', text: result.error || 'Failed to upload images' })
        setUploadProgress(0)
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      setSubmitMessage({ type: 'error', text: 'An unexpected error occurred while uploading images' })
      setUploadProgress(0)
    } finally {
      setIsUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const listingData: PendingListingData = {
        escape_room_name: formData.escape_room_name,
        business_name: formData.business_name || undefined,
        website: formData.website || undefined,
        description: formData.description,
        street_address: formData.street_address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        duration_minutes: formData.duration_minutes,
        min_players: formData.min_players,
        max_players: formData.max_players,
        difficulty_level: formData.difficulty_level,
        price_per_person: formData.price_per_person,
        themes: selectedThemes,
        phone_number: formData.phone_number,
        email: formData.email,
        images: images
      }

      console.log('Submitting listing with data:', listingData)
      console.log('Images array:', images)

      let result
      if (isEditMode && editId) {
        // Update existing listing
        result = await updatePendingListing(editId, listingData)
        if (result.success) {
          setSubmitMessage({ 
            type: 'success', 
            text: 'Listing updated successfully! Your changes have been saved.' 
          })
        } else {
          setSubmitMessage({ 
            type: 'error', 
            text: result.error || 'Failed to update listing' 
          })
        }
      } else {
        // Create new listing
        result = await submitPendingListing(listingData)
        if (result.success) {
          setSubmitMessage({ 
            type: 'success', 
            text: 'Your listing has been submitted for review! We\'ll notify you once it\'s approved and published.' 
          })
          // Reset form only for new listings
          setFormData({
            escape_room_name: '',
            business_name: '',
            website: '',
            description: '',
            street_address: '',
            city: '',
            state: '',
            zip_code: '',
            duration_minutes: 60,
            min_players: 2,
            max_players: 6,
            difficulty_level: 'intermediate',
            price_per_person: 35,
            phone_number: '',
            email: ''
          })
          setSelectedThemes([])
          setImages([])
        } else {
          setSubmitMessage({ type: 'error', text: result.error || 'Failed to submit listing' })
        }
      }
    } catch (error) {
      console.error('Error submitting listing:', error)
      setSubmitMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 md:py-32">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpeg"
            alt="Add your escape room"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        {/* Enhanced atmospheric elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-escape-red rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-escape-red-700 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
        
        {/* Enhanced floating mystery elements */}
        <div className="absolute inset-0 opacity-20 -z-10">
          <div className="absolute top-1/4 left-1/6 text-6xl animate-mystery-float pointer-events-none drop-shadow-2xl">🏢</div>
          <div className="absolute top-3/4 right-1/5 text-5xl animate-mystery-float delay-1000 pointer-events-none drop-shadow-2xl">📝</div>
          <div className="absolute top-1/2 right-1/4 text-4xl animate-mystery-float delay-500 pointer-events-none drop-shadow-2xl">⭐</div>
          <div className="absolute bottom-1/4 left-1/4 text-5xl animate-mystery-float delay-1500 pointer-events-none drop-shadow-2xl">🎯</div>
          <div className="absolute top-1/3 right-1/6 text-3xl animate-mystery-float delay-2000 pointer-events-none drop-shadow-2xl">💼</div>
          <div className="absolute bottom-1/3 left-1/5 text-4xl animate-mystery-float delay-2500 pointer-events-none drop-shadow-2xl">🚀</div>
        </div>

        {/* Additional geometric background elements */}
        <div className="absolute inset-0 opacity-10 -z-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-escape-red/30 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-escape-red-600/30 rounded-full animate-spin-slow delay-1000"></div>
          <div className="absolute top-1/2 right-1/6 w-16 h-16 border-2 border-escape-red-700/30 rounded-full animate-spin-slow delay-500"></div>
          <div className="absolute bottom-1/3 left-1/5 w-20 h-20 border-2 border-escape-red-500/30 rounded-full animate-spin-slow delay-1500"></div>
        </div>

        {/* Glowing accent lines */}
        <div className="absolute inset-0 opacity-15 -z-10">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-escape-red/50 to-transparent"></div>
          <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-escape-red-600/50 to-transparent"></div>
          <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-escape-red-700/50 to-transparent"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-escape-red-500/50 to-transparent"></div>
        </div>
        
        {/* Glowing particles effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-escape-red rounded-full animate-ping"></div>
          <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-escape-red-400 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-escape-red-600 rounded-full animate-ping delay-500"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            {isEditMode ? (
              <>
                <span className="text-escape-red">Edit</span> Your Escape Room
              </>
            ) : (
              <>
                <span className="text-escape-red">List</span> Your Escape Room
              </>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Join thousands of escape room owners and reach millions of potential customers. It&apos;s free to get started!
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 relative">
        {/* Additional atmospheric elements for main content */}
        <div className="absolute inset-0 opacity-5 -z-10">
          <div className="absolute top-20 left-10 w-24 h-24 bg-escape-red rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-escape-red-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-escape-red-700 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
        
        {/* Floating geometric elements */}
        <div className="absolute inset-0 opacity-10 -z-10">
          <div className="absolute top-32 left-20 w-8 h-8 border-2 border-escape-red/30 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-32 right-20 w-6 h-6 border-2 border-escape-red-600/30 rounded-full animate-spin-slow delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-4 h-4 border-2 border-escape-red-700/30 rounded-full animate-spin-slow delay-500"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {submitMessage && (
                <Alert className={`mb-6 ${submitMessage.type === 'error' ? 'border-escape-red/50 bg-red-50' : 'border-green-500/50 bg-green-50'}`}>
                  <div className="flex items-center gap-2">
                    {submitMessage.type === 'error' ? (
                      <AlertCircle className="h-5 w-5 text-escape-red" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <AlertDescription className={submitMessage.type === 'error' ? 'text-escape-red font-medium' : 'text-green-700 font-medium'}>
                      {submitMessage.text}
                    </AlertDescription>
                  </div>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <Card className="relative overflow-hidden escape-card-hover">
                  {/* Atmospheric background elements */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-escape-red rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-escape-red-600 rounded-full blur-xl"></div>
                  </div>
                  
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-2xl font-bold text-gray-800">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 relative z-10">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Escape Room Name *</label>
                      <Input 
                        placeholder="Enter the name of your escape room" 
                        value={formData.escape_room_name}
                        onChange={(e) => handleInputChange('escape_room_name', e.target.value)}
                        required
                        className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
                        style={{ 
                          WebkitUserSelect: 'text',
                          userSelect: 'text',
                          WebkitTouchCallout: 'default'
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Business Name</label>
                        <Input 
                          placeholder="Your business name" 
                          className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
                          style={{ 
                            WebkitUserSelect: 'text',
                            userSelect: 'text',
                            WebkitTouchCallout: 'default'
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Website</label>
                        <Input 
                          placeholder="https://yourwebsite.com" 
                          className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
                          style={{ 
                            WebkitUserSelect: 'text',
                            userSelect: 'text',
                            WebkitTouchCallout: 'default'
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Description *</label>
                      <Textarea
                        placeholder="Describe your escape room experience, storyline, and what makes it unique..."
                        rows={4}
                        className="focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red resize-none"
                        style={{ 
                          WebkitUserSelect: 'text',
                          userSelect: 'text',
                          WebkitTouchCallout: 'default'
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card className="relative overflow-hidden escape-card-hover">
                  {/* Atmospheric background elements */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-24 h-24 bg-escape-red-600 rounded-full blur-lg"></div>
                    <div className="absolute bottom-0 right-0 w-20 h-20 bg-escape-red rounded-full blur-md"></div>
                  </div>
                  
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                      <MapPin className="h-6 w-6 text-escape-red" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 relative z-10">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Street Address *</label>
                      <Input 
                        placeholder="123 Main Street" 
                        className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
                        style={{ 
                          WebkitUserSelect: 'text',
                          userSelect: 'text',
                          WebkitTouchCallout: 'default'
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">City *</label>
                        <Select 
                          value={formData.city} 
                          onValueChange={(value) => {
                            handleInputChange('city', value)
                            handleInputChange('zip_code', '') // Reset zip code when city changes
                          }}
                        >
                          <SelectTrigger className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50">
                            <SelectValue placeholder={loadingCities ? "Loading cities..." : "Select city"} />
                          </SelectTrigger>
                          <SelectContent>
                            {loadingCities ? (
                              <SelectItem value="loading" disabled>Loading cities...</SelectItem>
                            ) : cities.length === 0 ? (
                              <SelectItem value="no-cities" disabled>Select state first</SelectItem>
                            ) : (
                              cities.map((city) => (
                                <SelectItem key={`${city.city}-${city.state}`} value={city.city}>
                                  {city.city} ({city.count} rooms)
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">State *</label>
                        <Select 
                          value={formData.state} 
                          onValueChange={(value) => {
                            handleInputChange('state', value)
                            handleInputChange('city', '') // Reset city when state changes
                            handleInputChange('zip_code', '') // Reset zip code when state changes
                          }}
                        >
                          <SelectTrigger className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50">
                            <SelectValue placeholder={loadingStates ? "Loading states..." : "Select state"} />
                          </SelectTrigger>
                          <SelectContent>
                            {loadingStates ? (
                              <SelectItem value="loading" disabled>Loading states...</SelectItem>
                            ) : (
                              states.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">ZIP Code *</label>
                        <Select 
                          value={formData.zip_code} 
                          onValueChange={(value) => handleInputChange('zip_code', value)}
                        >
                          <SelectTrigger className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50">
                            <SelectValue placeholder={loadingZipCodes ? "Loading zip codes..." : "Select ZIP code"} />
                          </SelectTrigger>
                          <SelectContent>
                            {loadingZipCodes ? (
                              <SelectItem value="loading" disabled>Loading zip codes...</SelectItem>
                            ) : zipCodes.length === 0 ? (
                              <SelectItem value="no-zipcodes" disabled>Select city first</SelectItem>
                            ) : (
                              zipCodes.map((zip) => (
                                <SelectItem key={zip.zip_code} value={zip.zip_code}>
                                  {zip.zip_code} - {zip.city}, {zip.state}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Game Details */}
                <Card className="relative overflow-hidden escape-card-hover">
                  {/* Atmospheric background elements */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-escape-red-700 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-escape-red-500 rounded-full blur-lg"></div>
                  </div>
                  
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-2xl font-bold text-gray-800">Game Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Clock className="h-5 w-5 text-escape-red" />
                          Duration (minutes) *
                        </label>
                        <Input 
                          type="number" 
                          placeholder="60" 
                          className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
                          style={{ 
                            WebkitUserSelect: 'text',
                            userSelect: 'text',
                            WebkitTouchCallout: 'default'
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Users className="h-5 w-5 text-escape-red" />
                          Min Players *
                        </label>
                        <Input 
                          type="number" 
                          placeholder="2" 
                          className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
                          style={{ 
                            WebkitUserSelect: 'text',
                            userSelect: 'text',
                            WebkitTouchCallout: 'default'
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Users className="h-5 w-5 text-escape-red" />
                          Max Players *
                        </label>
                        <Input 
                          type="number" 
                          placeholder="6" 
                          className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
                          style={{ 
                            WebkitUserSelect: 'text',
                            userSelect: 'text',
                            WebkitTouchCallout: 'default'
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Difficulty Level *</label>
                        <Select>
                          <SelectTrigger className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-escape-red" />
                          Price per Person *
                        </label>
                        <Input 
                          type="number" 
                          placeholder="35" 
                          className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
                          style={{ 
                            WebkitUserSelect: 'text',
                            userSelect: 'text',
                            WebkitTouchCallout: 'default'
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">Themes</label>
                      <div className="flex flex-wrap gap-3">
                        {themes.map((theme) => (
                          <Badge
                            key={theme}
                            variant={selectedThemes.includes(theme) ? "default" : "outline"}
                            className={`cursor-pointer transition-all duration-300 px-4 py-2 text-sm ${
                              selectedThemes.includes(theme) 
                                ? "bg-gradient-to-r from-escape-red to-escape-red-700 text-white hover:from-escape-red-700 hover:to-escape-red shadow-lg" 
                                : "border-escape-red text-escape-red hover:bg-escape-red hover:text-white hover:shadow-md"
                            }`}
                            onClick={() => (selectedThemes.includes(theme) ? removeTheme(theme) : addTheme(theme))}
                          >
                            {theme}
                            {selectedThemes.includes(theme) && <X className="h-4 w-4 ml-2" />}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Images */}
                <Card className="relative overflow-hidden escape-card-hover">
                  {/* Atmospheric background elements */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-20 h-20 bg-escape-red-500 rounded-full blur-lg"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-escape-red-600 rounded-full blur-md"></div>
                  </div>
                  
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                      <Upload className="h-6 w-6 text-escape-red" />
                      Photos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-6">
                      <div className="border-2 border-dashed border-escape-red/30 rounded-lg p-8 text-center hover:border-escape-red/50 transition-all duration-300">
                        <Upload className="h-12 w-12 text-escape-red mx-auto mb-4" />
                        <p className="text-gray-700 mb-2 font-medium">Drag and drop your images here, or click to browse</p>
                        <p className="text-sm text-gray-500 mb-4">Upload up to 10 high-quality photos of your escape room</p>
                        
                        {/* Progress Bar */}
                        {isUploadingImages && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>Uploading images...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-escape-red to-escape-red-700 h-2 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files)}
                          className="hidden"
                          id="image-upload"
                          disabled={isUploadingImages}
                        />
                        <Button 
                          type="button"
                          variant="outline" 
                          className="h-12 px-6 border-escape-red text-escape-red hover:bg-escape-red hover:text-white transition-all duration-300 disabled:opacity-50"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          disabled={isUploadingImages}
                        >
                          {isUploadingImages ? 'Uploading...' : 'Choose Files'}
                      </Button>
                      </div>
                      
                      {/* Debug Info */}
                      <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                        Debug: Images array length: {images.length}
                        {images.length > 0 && (
                          <div className="mt-1">
                            URLs: {images.join(', ')}
                          </div>
                        )}
                      </div>

                      {/* Image Previews */}
                      {images.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-gray-700">Uploaded Images ({images.length}/10)</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images.map((imageUrl, index) => (
                              <div key={index} className="relative group">
                                <Image
                                  src={imageUrl}
                                  alt={`Upload ${index + 1}`}
                                  width={96}
                                  height={96}
                                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                  onError={async (event) => {
                                    console.error('Image failed to load:', imageUrl)
                                    
                                    // Try to convert signed URL to public URL
                                    if (imageUrl.includes('ik-t=') || imageUrl.includes('ik-s=')) {
                                      try {
                                        const filePath = imageUrl.split('ik.imagekit.io/6wjcics7s')[1].split('?')[0]
                                        const publicUrl = `https://ik.imagekit.io/6wjcics7s${filePath}`
                                        console.log('Trying public URL:', publicUrl)
                                        event.currentTarget.src = publicUrl
                                        return
                                      } catch (conversionError) {
                                        console.error('Failed to convert to public URL:', conversionError)
                                      }
                                    }
                                    
                                    // Try to refresh the URL if it's still a signed URL
                                    if (imageUrl.includes('ik-signature')) {
                                      try {
                                        const filePath = imageUrl.split('ik.imagekit.io/6wjcics7s')[1].split('?')[0]
                                        const response = await fetch('/api/imagekit/refresh-url', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ filePath })
                                        })
                                        
                                        if (response.ok) {
                                          const { url } = await response.json()
                                          event.currentTarget.src = url
                                          return
                                        }
                                      } catch (refreshError) {
                                        console.error('Failed to refresh URL:', refreshError)
                                      }
                                    }
                                    
                                    event.currentTarget.style.display = 'none'
                                  }}
                                  onLoad={() => {
                                    console.log('Image loaded successfully:', imageUrl)
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-escape-red text-white rounded-full flex items-center justify-center text-xs hover:bg-escape-red-700 transition-colors duration-200"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="relative overflow-hidden escape-card-hover">
                  {/* Atmospheric background elements */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-escape-red-600 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-18 h-18 bg-escape-red rounded-full blur-lg"></div>
                  </div>
                  
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-2xl font-bold text-gray-800">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Phone Number *</label>
                        <Input 
                          placeholder="(555) 123-4567" 
                          className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
                          style={{ 
                            WebkitUserSelect: 'text',
                            userSelect: 'text',
                            WebkitTouchCallout: 'default'
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Email *</label>
                        <Input 
                          type="email" 
                          placeholder="contact@yourbusiness.com" 
                          className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
                          style={{ 
                            WebkitUserSelect: 'text',
                            userSelect: 'text',
                            WebkitTouchCallout: 'default'
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-6">
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="flex-1 h-14 bg-gradient-to-r from-escape-red to-escape-red-700 hover:from-escape-red-700 hover:to-escape-red text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update Listing' : 'Submit Listing')}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="lg" 
                    className="h-14 px-8 border-escape-red text-escape-red hover:bg-escape-red hover:text-white transition-all duration-300"
                    onClick={() => {
                      setSubmitMessage({ type: 'success', text: 'Draft saved! You can continue editing later.' })
                    }}
                  >
                    Save Draft
                  </Button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="relative overflow-hidden escape-card-hover">
                {/* Atmospheric background elements */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-escape-red rounded-full blur-xl"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-escape-red-600 rounded-full blur-lg"></div>
                </div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="text-xl font-bold text-gray-800">Why List With Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 bg-escape-red/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-escape-red/20 transition-all duration-300">
                      <span className="text-escape-red font-bold text-lg">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 group-hover:text-escape-red transition-colors duration-300">Free to List</h4>
                      <p className="text-sm text-gray-600">No upfront costs or hidden fees</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 bg-escape-red/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-escape-red/20 transition-all duration-300">
                      <span className="text-escape-red font-bold text-lg">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 group-hover:text-escape-red transition-colors duration-300">Reach Millions</h4>
                      <p className="text-sm text-gray-600">Connect with escape room enthusiasts nationwide</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 bg-escape-red/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-escape-red/20 transition-all duration-300">
                      <span className="text-escape-red font-bold text-lg">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 group-hover:text-escape-red transition-colors duration-300">Easy Management</h4>
                      <p className="text-sm text-gray-600">Update your listing anytime with our dashboard</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden escape-card-hover">
                {/* Atmospheric background elements */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-16 h-16 bg-escape-red-600 rounded-full blur-lg"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 bg-escape-red rounded-full blur-md"></div>
                </div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="text-xl font-bold text-gray-800">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm text-gray-600 mb-6">Our team is here to help you create the perfect listing.</p>
                  <Link href="/contact">
                    <Button className="w-full h-12 bg-gradient-to-r from-escape-red to-escape-red-700 hover:from-escape-red-700 hover:to-escape-red text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                    Contact Support
                  </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
