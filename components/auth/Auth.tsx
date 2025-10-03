'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import ReCaptcha from '@/components/ui/recaptcha'
import { Loader2 } from 'lucide-react'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [recaptchaError, setRecaptchaError] = useState(false)

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!recaptchaToken) {
      setRecaptchaError(true)
      setMessage({ type: 'error', text: 'Please complete the reCAPTCHA verification.' })
      setLoading(false)
      return
    }

    try {
      // Verify reCAPTCHA first
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      setMessage({ type: 'success', text: 'Successfully signed in! Redirecting to dashboard...' })
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!recaptchaToken) {
      setRecaptchaError(true)
      setMessage({ type: 'error', text: 'Please complete the reCAPTCHA verification.' })
      setLoading(false)
      return
    }

    try {
      // Verify reCAPTCHA first
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error
      
      setMessage({ 
        type: 'success', 
        text: 'Check your email for the confirmation link!' 
      })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
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
        <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to <span className="text-escape-red">Escape Rooms Finder</span>
        </CardTitle>
        <CardDescription className="text-gray-600 text-lg">
          Sign in to your account or create a new one
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger 
              value="signin" 
              className="data-[state=active]:bg-escape-red data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="data-[state=active]:bg-escape-red data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="mt-8">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-sm font-semibold text-gray-700">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
                  style={{ 
                    WebkitUserSelect: 'text',
                    userSelect: 'text',
                    WebkitTouchCallout: 'default'
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-sm font-semibold text-gray-700">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
                  style={{ 
                    WebkitUserSelect: 'text',
                    userSelect: 'text',
                    WebkitTouchCallout: 'default'
                  }}
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
                className="w-full h-12 bg-gradient-to-r from-escape-red to-escape-red-700 hover:from-escape-red-700 hover:to-escape-red text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                disabled={loading || !recaptchaToken}
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Sign In
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="mt-8">
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-sm font-semibold text-gray-700">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
                  style={{ 
                    WebkitUserSelect: 'text',
                    userSelect: 'text',
                    WebkitTouchCallout: 'default'
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-sm font-semibold text-gray-700">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
                  style={{ 
                    WebkitUserSelect: 'text',
                    userSelect: 'text',
                    WebkitTouchCallout: 'default'
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-sm font-semibold text-gray-700">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Choose a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12 focus:ring-2 focus:ring-escape-red focus:border-escape-red border-gray-300 transition-all duration-300 hover:border-escape-red/50 text-gray-800 selection:bg-escape-red/20 selection:text-escape-red"
                  style={{ 
                    WebkitUserSelect: 'text',
                    userSelect: 'text',
                    WebkitTouchCallout: 'default'
                  }}
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
                className="w-full h-12 bg-gradient-to-r from-escape-red to-escape-red-700 hover:from-escape-red-700 hover:to-escape-red text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                disabled={loading || !recaptchaToken}
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Sign Up
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        {message && (
          <Alert className={`mt-6 ${message.type === 'error' ? 'border-escape-red/50 bg-red-50' : 'border-green-500/50 bg-green-50'}`}>
            <AlertDescription className={message.type === 'error' ? 'text-escape-red font-medium' : 'text-green-700 font-medium'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}