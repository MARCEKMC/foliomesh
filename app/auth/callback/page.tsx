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
        // Manejar el callback de autenticación
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          throw error
        }

        if (data.session?.user) {
          // Usuario autenticado exitosamente
          console.log('Usuario autenticado:', data.session.user.email)
          toast.success(`¡Bienvenido a Foliomesh, ${data.session.user.email}!`)
          
          // Redirigir al dashboard
          router.push('/dashboard')
        } else {
          // No hay sesión válida
          console.log('No session found, redirecting to home')
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
        <p className="mt-2 text-gray-400 text-sm">Te redirigiremos en un momento</p>
      </div>
    </div>
  )
}