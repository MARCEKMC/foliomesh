'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClientComponentClient()

  // Slides del carrusel con frases y descripciones
  const slides = [
    {
      image: '/portfolio-1.jpg',
      title: 'Crea un portafolio con un estilo único que refleja tu imagen',
      description: 'Diseña tu presencia profesional con herramientas intuitivas'
    },
    {
      image: '/portfolio-2.jpg', 
      title: 'Conéctate con GitHub y muestra tus proyectos',
      description: 'Integra automáticamente tu trabajo de desarrollo'
    },
    {
      image: '/portfolio-3.jpg',
      title: 'Comparte tu experiencia profesional',
      description: 'Destaca tus logros y habilidades de manera elegante'
    },
    {
      image: '/portfolio-4.jpg',
      title: 'Presenta tus certificaciones y educación',
      description: 'Valida tu expertise con credenciales verificables'
    },
    {
      image: '/portfolio-5.jpg',
      title: 'Conecta con oportunidades globales',
      description: 'Tu talento visible para empresas de todo el mundo'
    },
    {
      image: '/portfolio-6.jpg',
      title: 'Analiza el rendimiento de tu portafolio',
      description: 'Métricas detalladas sobre visitas e interacciones'
    },
    {
      image: '/portfolio-7.jpg',
      title: 'Exporta y personaliza tu dominio',
      description: 'Tu portafolio, tu marca, tu propio dominio profesional'
    }
  ]

  const partners = [
    'Facebook', 'X', 'Instagram', 'LinkedIn', 'Twitter', 'UNMSM'
  ]

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error: any) {
      toast.error('Error al iniciar sesión con Google')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
      toast.success('Te hemos enviado un enlace de acceso a tu email')
      setShowLogin(false)
    } catch (error: any) {
      toast.error('Error al enviar el enlace de acceso')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailRegister = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
      toast.success('Te hemos enviado un enlace de verificación a tu email')
      setShowRegister(false)
    } catch (error: any) {
      toast.error('Error al crear la cuenta')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-cambio de slides cada 10 segundos
  useState(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 10000)
    return () => clearInterval(interval)
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">Foliomesh</span>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                Contactar con ventas
              </button>
              <Button 
                variant="outline" 
                onClick={() => setShowRegister(true)}
                className="border-gray-300 hover:border-gray-400"
              >
                Registrarse
              </Button>
              <Button 
                onClick={() => setShowLogin(true)}
                className="bg-gray-900 hover:bg-gray-800"
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section con Carrusel */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide 
                  ? 'opacity-100 scale-100' 
                  : Math.abs(index - currentSlide) === 1 
                    ? 'opacity-60 scale-95'
                    : 'opacity-30 scale-90'
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/api/placeholder/1200/800')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: `translateX(${(index - currentSlide) * 20}%)`,
              }}
            />
          ))}
        </div>

        {/* Overlay de contenido */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-12 max-w-3xl mx-4 text-center shadow-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {slides[currentSlide].description}
            </p>
            <Button 
              size="lg" 
              onClick={() => setShowRegister(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
            >
              Comenzar gratis
            </Button>
          </div>
        </div>

        {/* Indicadores de slides */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Todo lo que necesitas para destacar profesionalmente
          </h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            Foliomesh te permite crear, personalizar y compartir tu portafolio profesional 
            con herramientas intuitivas y características avanzadas.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-blue-600 text-xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Diseño Profesional</h3>
              <p className="text-gray-600">Plantillas elegantes y personalizables que reflejan tu marca personal.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-green-600 text-xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Integración GitHub</h3>
              <p className="text-gray-600">Conecta automáticamente tus repositorios y proyectos de desarrollo.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-purple-600 text-xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics Avanzados</h3>
              <p className="text-gray-600">Métricas detalladas sobre visitas, interacciones y rendimiento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Band */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 mb-8">Conecta con las plataformas que usas</p>
          <div className="overflow-hidden">
            <div className="flex animate-scroll space-x-12 items-center">
              {[...partners, ...partners].map((partner, index) => (
                <div key={index} className="flex-shrink-0 text-gray-400 font-semibold text-lg">
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">
              Bienvenido de vuelta
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            <Button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-12 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </Button>

            <div className="text-center text-gray-500">o</div>

            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
            </div>

            <Button 
              onClick={handleEmailLogin}
              disabled={loading}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800"
            >
              {loading ? 'Enviando...' : 'Iniciar sesión'}
            </Button>

            <div className="text-center space-y-2">
              <button className="text-blue-600 hover:underline text-sm">
                ¿Olvidaste tu contraseña?
              </button>
              <p className="text-gray-600 text-sm">
                ¿No tienes una cuenta?{' '}
                <button 
                  onClick={() => {
                    setShowLogin(false)
                    setShowRegister(true)
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Crea una
                </button>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">
              Te damos la bienvenida a Foliomesh
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            <p className="text-sm text-gray-600 text-center">
              Al crear una cuenta aceptas los{' '}
              <a href="#" className="text-blue-600 hover:underline">Términos del Servicio</a>{' '}
              de Foliomesh y la{' '}
              <a href="#" className="text-blue-600 hover:underline">Política de privacidad</a>.
            </p>

            <Button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-12 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </Button>

            <div className="text-center text-gray-500">o</div>

            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
            </div>

            <Button 
              onClick={handleEmailRegister}
              disabled={loading}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>

            <p className="text-center text-gray-600 text-sm">
              ¿Ya tienes una cuenta?{' '}
              <button 
                onClick={() => {
                  setShowRegister(false)
                  setShowLogin(true)
                }}
                className="text-blue-600 hover:underline"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  )
}