'use client'

export default function DebugEnv() {
  if (process.env.NODE_ENV !== 'development') {
    return null // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs z-50">
      <div>Site Key: {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? '✅ Set' : '❌ Missing'}</div>
      <div>Secret Key: {process.env.RECAPTCHA_SECRET_KEY ? '✅ Set' : '❌ Missing'}</div>
    </div>
  )
}
