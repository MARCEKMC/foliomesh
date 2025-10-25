"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'

export default function AuthCallback() {
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Procesar el hash URL para obtener el token
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        
        if (accessToken && refreshToken) {
          // Establecer la sesión con los tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (error) {
            console.error('Error setting session:', error)
            throw error
          }
          
          if (data.session?.user) {
            console.log('Session established successfully:', data.session.user.email)
            toast.success(`¡Bienvenido a Foliomesh, ${data.session.user.email}!`)
            
            // Dar tiempo para que la sesión se establezca completamente
            setTimeout(() => {
              router.push('/dashboard')
            }, 1000)
            return
          }
        }
        
        // Fallback: verificar sesión existente
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          throw sessionError
        }

        if (sessionData.session?.user) {
          console.log('Existing session found:', sessionData.session.user.email)
          toast.success(`¡Bienvenido de vuelta, ${sessionData.session.user.email}!`)
          
          setTimeout(() => {
            router.push('/dashboard')
          }, 1000)
        } else {
          console.log('No valid session found')
          toast.error('No se pudo completar la autenticación')
          router.push('/')
        }
      } catch (error: any) {
        console.error('Error in auth callback:', error)
        toast.error('Error de autenticación: ' + error.message)
        router.push('/')
      }
    }

    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 text-lg">Completando autenticación...</p>
        <p className="mt-2 text-gray-400 text-sm">Te redirigiremos al dashboard en un momento</p>
      </div>
    </div>
  )
}