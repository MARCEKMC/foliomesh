'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Portfolio, Block } from '@/types/portfolio'

interface PortfolioData {
  portfolio: Portfolio
  blocks: Block[]
  user: {
    given_name: string
    family_name1: string
    family_name2?: string
    avatar_url?: string
  }
}

export default function PortfolioPage() {
  const params = useParams()
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPortfolio()
  }, [params])

  const loadPortfolio = async () => {
    try {
      // Extraer subdomain del host actual
      const host = window.location.host
      const subdomain = host.split('.')[0]
      
      // Extraer token privado de la URL si existe
      const pathSegments = Array.isArray(params.portfolio) ? params.portfolio : [params.portfolio]
      const privateToken = pathSegments[0]

      console.log('Loading portfolio:', { subdomain, privateToken })

      // Buscar portfolio por subdomain
      const { data: portfolio, error: portfolioError } = await supabase
        .from('portfolios')
        .select(`
          *,
          users (
            given_name,
            family_name1,
            family_name2,
            avatar_url
          )
        `)
        .eq('subdomain_slug', subdomain)
        .single()

      if (portfolioError) {
        console.error('Portfolio error:', portfolioError)
        setError('Portfolio no encontrado')
        return
      }

      // Verificar acceso
      if (portfolio.visibility === 'PRIVATE') {
        if (!privateToken || portfolio.private_token !== privateToken) {
          setError('Acceso denegado - Token inválido')
          return
        }
      }

      // Cargar bloques
      const { data: blocks, error: blocksError } = await supabase
        .from('blocks')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .order('order')

      if (blocksError) {
        console.error('Blocks error:', blocksError)
        setError('Error cargando contenido')
        return
      }

      setPortfolioData({
        portfolio,
        blocks: blocks || [],
        user: portfolio.users
      })

    } catch (error) {
      console.error('Error loading portfolio:', error)
      setError('Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando portfolio...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Portfolio no encontrado</h1>
          <p className="text-gray-600">Este portfolio no existe o no está disponible.</p>
        </div>
      </div>
    )
  }

  const { portfolio, blocks, user } = portfolioData

  // Renderizar bloques según su tipo
  const renderBlock = (block: Block) => {
    const content = block.content as any

    switch (block.type) {
      case 'INTRO':
        return (
          <section key={block.id} className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-4xl mx-auto px-6 text-center">
              {user.avatar_url && (
                <img
                  src={user.avatar_url}
                  alt={`${user.given_name} ${user.family_name1}`}
                  className="w-32 h-32 rounded-full mx-auto mb-8 shadow-lg"
                />
              )}
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                {user.given_name} {user.family_name1} {user.family_name2}
              </h1>
              {content.title && (
                <h2 className="text-2xl text-blue-600 mb-6">{content.title}</h2>
              )}
              {content.description && (
                <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  {content.description}
                </p>
              )}
            </div>
          </section>
        )

      case 'EXPERIENCE':
        return (
          <section key={block.id} className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">💼 Experiencia</h2>
              <div className="space-y-8">
                {content.experiences?.map((exp: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-semibold">{exp.position}</h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                    <p className="text-gray-500 text-sm">{exp.period}</p>
                    {exp.description && (
                      <p className="text-gray-600 mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'PROJECTS':
        return (
          <section key={block.id} className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">🚀 Proyectos</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.projects?.map((project: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      {project.description && (
                        <p className="text-gray-600 mb-4">{project.description}</p>
                      )}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Ver proyecto →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'CERTIFICATES':
        return (
          <section key={block.id} className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">🏆 Certificados</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {content.certificates?.map((cert: any, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold">{cert.title}</h3>
                    <p className="text-blue-600">{cert.issuer}</p>
                    <p className="text-gray-500 text-sm">{cert.date}</p>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                      >
                        Ver certificado →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'CONTACT':
        return (
          <section key={block.id} className="py-16 bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-8">📧 Contacto</h2>
              <div className="space-y-4">
                {content.email && (
                  <p>
                    <span className="font-medium">Email:</span>{' '}
                    <a href={`mailto:${content.email}`} className="text-blue-300 hover:text-blue-100">
                      {content.email}
                    </a>
                  </p>
                )}
                {content.phone && (
                  <p>
                    <span className="font-medium">Teléfono:</span> {content.phone}
                  </p>
                )}
                {content.linkedin && (
                  <p>
                    <a
                      href={content.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-100"
                    >
                      LinkedIn →
                    </a>
                  </p>
                )}
                {content.github && (
                  <p>
                    <a
                      href={content.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-100"
                    >
                      GitHub →
                    </a>
                  </p>
                )}
              </div>
            </div>
          </section>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      {/* Renderizar todos los bloques en orden */}
      {blocks.map(renderBlock)}
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            Portfolio creado con{' '}
            <span className="text-blue-400 font-medium">Foliomesh</span>
          </p>
        </div>
      </footer>
    </div>
  )
}