"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

interface User {
  id: string
  email: string
  given_name: string
  family_name1: string
}

interface Portfolio {
  id: string
  subdomain_slug: string
  visibility: 'PUBLIC' | 'PRIVATE'
  private_token?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Verificar sesión de Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          router.push('/auth/signin')
          return
        }

        // Procesar usuario en el backend
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: session.user })
        })

        if (!response.ok) {
          throw new Error('Error al procesar usuario')
        }

        const data = await response.json()
        setUser(data.user)
        setPortfolio(data.portfolio)

      } catch (error: any) {
        console.error('Error initializing user:', error)
        toast.error('Error al cargar el dashboard: ' + error.message)
      } finally {
        setIsLoading(false)
      }
    }

    initializeUser()
  }, [router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
      toast.success('Sesión cerrada exitosamente')
    } catch (error: any) {
      toast.error('Error al cerrar sesión: ' + error.message)
    }
  }

  const getPortfolioUrl = () => {
    if (!portfolio) return ''
    
    if (portfolio.visibility === 'PUBLIC') {
      return `${portfolio.subdomain_slug}.${process.env.NODE_ENV === 'development' ? 'foliomesh.local:3000' : 'foliomesh.com'}`
    } else {
      return `${portfolio.subdomain_slug}.${process.env.NODE_ENV === 'development' ? 'foliomesh.local:3000' : 'foliomesh.com'}/${portfolio.private_token || 'preview'}`
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Folio<span className="text-blue-600">mesh</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user?.given_name} {user?.family_name1}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Portfolio Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Mi Portfolio</h3>
            
            {portfolio && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    URL del portfolio:
                  </p>
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                    {getPortfolioUrl()}
                  </code>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Estado: <span className="font-medium">
                      {portfolio.visibility === 'PUBLIC' ? 'Público' : 'Privado'}
                    </span>
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link href={`/dashboard/editor`}>
                      Editar
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`http://${getPortfolioUrl()}`} target="_blank" rel="noopener noreferrer">
                      Ver portfolio
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Acciones rápidas</h3>
            
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/dashboard/editor">
                  ✏️ Editar portfolio
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/settings">
                  ⚙️ Configuración
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/integrations">
                  🔗 Integraciones
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Visitas:</span>
                <span className="font-medium">0</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Proyectos:</span>
                <span className="font-medium">0</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Última actualización:</span>
                <span className="font-medium text-sm">Hoy</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Getting Started */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            🚀 ¡Bienvenido a Foliomesh!
          </h3>
          
          <p className="text-blue-800 dark:text-blue-200 mb-4">
            Tu portfolio está listo para ser personalizado. Aquí te dejamos algunos pasos para empezar:
          </p>
          
          <div className="space-y-2 text-blue-800 dark:text-blue-200">
            <p>1. ✏️ <strong>Edita tu portfolio</strong> - Personaliza tus bloques de contenido</p>
            <p>2. 🎨 <strong>Elige tu tema</strong> - Colores, fuentes y estilo</p>
            <p>3. 🔗 <strong>Conecta GitHub</strong> - Muestra tus proyectos automáticamente</p>
            <p>4. 🌐 <strong>Publica</strong> - Hazlo público cuando esté listo</p>
          </div>
          
          <Button asChild className="mt-4">
            <Link href="/dashboard/editor">
              Empezar a editar
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}