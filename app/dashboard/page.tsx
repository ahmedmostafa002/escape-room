'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getPendingListings } from '@/lib/pending-listings'
import { PendingListing } from '@/lib/pending-listings'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [listings, setListings] = useState<PendingListing[]>([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (user) {
      loadListings()
    }
  }, [user])

  const loadListings = async () => {
    try {
      setLoadingListings(true)
      const result = await getPendingListings()
      if (result.success && result.listings) {
        setListings(result.listings)
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to load listings' })
      }
    } catch (error) {
      console.error('Error loading listings:', error)
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setLoadingListings(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-3 w-3" />
      case 'rejected':
        return <XCircle className="h-3 w-3" />
      case 'pending':
      default:
        return <ClockIcon className="h-3 w-3" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-escape-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-800">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">You need to be logged in to access the dashboard.</p>
            <Link href="/auth">
              <Button className="w-full bg-escape-red hover:bg-escape-red/90 text-white">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-escape-red text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back!</h1>
              <p className="text-escape-red-100 mt-2">Manage your escape room listings and profile</p>
            </div>
            <Link href="/add-listing">
              <Button className="bg-white text-escape-red hover:bg-gray-100">
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Button>
            </Link>
          </div>
        </div>
      </div>
  
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {message && (
          <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}
  
        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg mb-8">
            <TabsTrigger 
              value="listings" 
              className="data-[state=active]:bg-escape-red data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
            >
              My Listings ({listings.length})
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-escape-red data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Profile Settings
            </TabsTrigger>
          </TabsList>
  
          <TabsContent value="listings" className="mt-8">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-escape-red data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                >
                  All ({listings.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="pending"
                  className="data-[state=active]:bg-escape-red data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                >
                  Pending ({listings.filter(l => l.status === 'pending').length})
                </TabsTrigger>
                <TabsTrigger 
                  value="approved"
                  className="data-[state=active]:bg-escape-red data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                >
                  Approved ({listings.filter(l => l.status === 'approved').length})
                </TabsTrigger>
                <TabsTrigger 
                  value="rejected"
                  className="data-[state=active]:bg-escape-red data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                >
                  Rejected ({listings.filter(l => l.status === 'rejected').length})
                </TabsTrigger>
              </TabsList>
  
              <TabsContent value="all" className="mt-8">
                <ListingGrid listings={listings} loading={loadingListings} />
              </TabsContent>
              <TabsContent value="pending" className="mt-8">
                <ListingGrid listings={listings.filter(l => l.status === 'pending')} loading={loadingListings} />
              </TabsContent>
              <TabsContent value="approved" className="mt-8">
                <ListingGrid listings={listings.filter(l => l.status === 'approved')} loading={loadingListings} />
              </TabsContent>
              <TabsContent value="rejected" className="mt-8">
                <ListingGrid listings={listings.filter(l => l.status === 'rejected')} loading={loadingListings} />
              </TabsContent>
            </Tabs>
          </TabsContent>
  
          <TabsContent value="profile" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Name</Label>
                    <p className="text-gray-800">{user.user_metadata?.full_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Member Since</Label>
                    <p className="text-gray-800">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                  <Link href="/account">
                    <Button variant="outline" className="w-full border-escape-red text-escape-red hover:bg-escape-red hover:text-white">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ListingGrid({ listings, loading }: { listings: PendingListing[]; loading: boolean }) {
  const [deletingListing, setDeletingListing] = useState<string | null>(null)

  const handleEdit = (listing: PendingListing) => {
    // For now, redirect to add-listing page with the listing data
    // In the future, this could open a modal or redirect to an edit page
    window.location.href = `/add-listing?edit=${listing.id}`
  }

  const handleDelete = (listingId: string) => {
    setDeletingListing(listingId)
    // TODO: Implement actual deletion logic
    console.log('Delete listing:', listingId)
    // For now, just reset the deleting state
    setTimeout(() => setDeletingListing(null), 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-3 w-3" />
      case 'rejected':
        return <XCircle className="h-3 w-3" />
      case 'pending':
      default:
        return <ClockIcon className="h-3 w-3" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="relative overflow-hidden">
            <div className="aspect-video bg-gray-200 animate-pulse"></div>
            <CardContent className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Calendar className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No listings found</h3>
        <p className="text-gray-500 mb-4">You haven&apos;t created any escape room listings yet.</p>
        <Link href="/add-listing">
          <Button className="bg-escape-red hover:bg-escape-red/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Listing
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="relative overflow-hidden escape-card-hover">
            {/* Atmospheric background elements */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-20 h-20 bg-escape-red rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-escape-red-600 rounded-full blur-lg"></div>
            </div>
            
            <div className="relative z-10">
              {/* Image */}
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                  <Image
                    src={listing.images[0]}
                    alt={listing.escape_room_name}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                    onError={() => {
                      console.error('Image failed to load for listing:', listing.escape_room_name, 'Image URL:', listing.images[0])
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏠</div>
                      <div className="text-sm">No image</div>
                    </div>
                  </div>
                )}
              </div>
  
              <CardContent className="p-4">
                {/* Title and Status */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg leading-tight">{listing.escape_room_name}</h3>
                  <Badge className={`flex items-center gap-1 ${getStatusColor(listing.status)}`}>
                    {getStatusIcon(listing.status)}
                    {listing.status}
                  </Badge>
                </div>
  
                {/* Location */}
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {listing.city}, {listing.state}
                </div>
  
                {/* Game Details */}
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {listing.min_players}-{listing.max_players} players
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {listing.duration_minutes} min
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ${listing.price_per_person}/person
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {listing.difficulty_level}
                  </div>
                </div>
  
                {/* Created Date */}
                <div className="text-xs text-gray-500 mb-4">
                  <span>Created {formatDate(listing.created_at)}</span>
                </div>
  
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-escape-red text-escape-red hover:bg-escape-red hover:text-white"
                    onClick={() => handleEdit(listing)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(listing.id)}
                    disabled={deletingListing === listing.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}