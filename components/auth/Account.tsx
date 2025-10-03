'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, User as UserIcon, Mail, Calendar } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  full_name: string | null
  username: string | null
  website: string | null
  avatar_url: string | null
  updated_at: string | null
}

interface AccountProps {
  user: User
}

export default function Account({ user }: AccountProps) {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    id: user.id,
    full_name: '',
    username: '',
    website: '',
    avatar_url: '',
    updated_at: ''
  })
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    getProfile()
  }, [user.id])

  async function getProfile() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.warn('Error loading profile:', error)
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || '',
              updated_at: new Date().toISOString()
            })
          
          if (insertError) {
            throw insertError
          }
          
          // Try to get the profile again
          const { data: newData, error: newError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (newError) throw newError
          if (newData) setProfile(newData)
        } else {
          throw error
        }
      } else if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile() {
    try {
      setUpdating(true)
      const updates = {
        id: user.id,
        full_name: profile.full_name,
        username: profile.username,
        website: profile.website,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updates)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Profile updated successfully! Redirecting to dashboard...'
      })
      
      // Redirect to dashboard after successful update
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      })
    } finally {
      setUpdating(false)
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast({
        title: 'Success',
        description: 'Signed out successfully!'
      })
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm shadow-2xl border-0 relative overflow-hidden">
        {/* Atmospheric background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-escape-red rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-escape-red-600 rounded-full blur-xl"></div>
        </div>
        
        <CardHeader className="text-center pb-8 relative z-10">
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <UserIcon className="h-8 w-8 text-escape-red" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-escape-red" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm shadow-2xl border-0 relative overflow-hidden">
      {/* Atmospheric background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-escape-red rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-escape-red-600 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-escape-red-700 rounded-full blur-lg"></div>
      </div>
      
      <CardHeader className="text-center pb-8 relative z-10">
        <CardTitle className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <UserIcon className="h-8 w-8 text-escape-red" />
          Account
        </CardTitle>
        <CardDescription className="text-gray-600 text-lg">
          Manage your profile information
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        <Alert className="border-escape-red/20 bg-escape-red/5">
          <Mail className="h-5 w-5 text-escape-red" />
          <AlertDescription className="text-gray-700">
            <strong className="text-escape-red">Email:</strong> {user.email}
          </AlertDescription>
        </Alert>

        {profile.updated_at && (
          <Alert className="border-green-500/20 bg-green-50">
            <Calendar className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-gray-700">
              <strong className="text-green-700">Last updated:</strong> {new Date(profile.updated_at).toLocaleDateString()}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              placeholder="Enter your full name"
              className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
              style={{ 
                WebkitUserSelect: 'text',
                userSelect: 'text',
                WebkitTouchCallout: 'default'
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-semibold text-gray-700">Username</Label>
            <Input
              id="username"
              type="text"
              value={profile.username || ''}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              placeholder="Enter your username"
              className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
              style={{ 
                WebkitUserSelect: 'text',
                userSelect: 'text',
                WebkitTouchCallout: 'default'
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-semibold text-gray-700">Website</Label>
            <Input
              id="website"
              type="url"
              value={profile.website || ''}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              placeholder="https://escaperoomsfinder.com"
              className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
              style={{ 
                WebkitUserSelect: 'text',
                userSelect: 'text',
                WebkitTouchCallout: 'default'
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl" className="text-sm font-semibold text-gray-700">Avatar URL</Label>
            <Input
              id="avatarUrl"
              type="url"
              value={profile.avatar_url || ''}
              onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
              placeholder="https://escaperoomsfinder.com/avatar.jpg"
              className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
              style={{ 
                WebkitUserSelect: 'text',
                userSelect: 'text',
                WebkitTouchCallout: 'default'
              }}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <Button
            onClick={updateProfile}
            disabled={updating}
            className="flex-1 h-12 bg-gradient-to-r from-escape-red to-escape-red-700 hover:from-escape-red-700 hover:to-escape-red text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            {updating && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Update Profile
          </Button>
          
          <Button
            onClick={signOut}
            variant="outline"
            className="flex-1 h-12 border-escape-red text-escape-red hover:bg-escape-red hover:text-white transition-all duration-300"
          >
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}