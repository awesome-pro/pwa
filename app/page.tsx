/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
 
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function CareseptHome() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  const routers = useRouter()
 
  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )
 
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    // Hnadle the beforeInstallPrompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
    }
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }
  }, [])
 
  if (isStandalone) {
    return null // Don't show install button if already installed
  }
 
  return (
    <main className='w-screen min-h-screen flex items-center justfy-center '>
            <h1>
                Welcome to Caresept
            </h1>
            <p>
                World&apos;s first decentralized healthcare platform
            </p>
            <div>
                <button type="button" className='' onClick={() => {
                    routers.push('/auth/sign-in')
                }}>
                    Sign In
                </button>
                <button type="button" className='' onClick={() => {
                    routers.push('/dashboard')
                }}>
                    Dashboard
                </button>
            </div>
    </main>
  );
}

export default CareseptHome