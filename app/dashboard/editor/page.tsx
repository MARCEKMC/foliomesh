"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import { Block, BlockType, Portfolio } from '@/types/portfolio'
import { useAutosave } from '@/hooks/use-autosave'

// Importar editores de bloques
import { IntroEditor } from '@/components/editor/intro-editor'
import { ExperienceEditor } from '@/components/editor/experience-editor'
import { ProjectsEditor } from '@/components/editor/projects-editor'
import { CertificatesEditor } from '@/components/editor/certificates-editor'
import { ContactEditor } from '@/components/editor/contact-editor'

import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Settings,
  User,
  Briefcase,
  FolderOpen,
  Award,
  Mail
} from 'lucide-react'

const blockIcons = {
  INTRO: User,
  EXPERIENCE: Briefcase,
  PROJECTS: FolderOpen,
  CERTIFICATES: Award,
  CONTACT: Mail
}

const blockNames = {
  INTRO: 'Presentación',
  EXPERIENCE: 'Experiencia',
  PROJECTS: 'Proyectos',
  CERTIFICATES: 'Certificados',
  CONTACT: 'Contacto'
}

export default function EditorPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [activeBlock, setActiveBlock] = useState<BlockType>('INTRO')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // Cargar datos del portfolio
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/')
          return
        }

        // Obtener portfolio del usuario
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: session.user })
        })

        if (!response.ok) throw new Error('Error al cargar portfolio')

        const data = await response.json()
        setPortfolio(data.portfolio)

        // Cargar bloques
        if (data.portfolio?.id) {
          const blocksResponse = await fetch(`/api/portfolios/${data.portfolio.id}/blocks`)
          
          if (blocksResponse.ok) {
            const blocksData = await blocksResponse.json()
            setBlocks(blocksData.blocks || [])
          }
        }

      } catch (error: any) {
        console.error('Error loading portfolio:', error)
        toast.error('Error al cargar el portfolio: ' + error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadPortfolio()
  }, [router])

  // Función para guardar un bloque
  const saveBlock = async (blockType: BlockType, content: any) => {
    if (!portfolio?.id) return

    try {
      setIsSaving(true)
      
      const block = blocks.find(b => b.type === blockType)
      if (!block) throw new Error('Bloque no encontrado')

      const response = await fetch(`/api/portfolios/${portfolio.id}/blocks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockId: block.id,
          content
        })
      })

      if (!response.ok) throw new Error('Error al guardar')

      // Actualizar estado local
      setBlocks(blocks.map(b => 
        b.type === blockType 
          ? { ...b, content, updatedAt: new Date() }
          : b
      ))

    } catch (error: any) {
      console.error('Error saving block:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  // Autosave para el bloque activo
  const activeBlockData = blocks.find(b => b.type === activeBlock)
  const { forceSave } = useAutosave({
    data: activeBlockData?.content,
    onSave: (content) => saveBlock(activeBlock, content),
    delay: 2000,
    enabled: !!activeBlockData
  })

  const handleBlockChange = (content: any) => {
    if (!activeBlockData) return

    setBlocks(blocks.map(b => 
      b.type === activeBlock 
        ? { ...b, content }
        : b
    ))
  }

  const renderBlockEditor = () => {
    const blockData = activeBlockData?.content || {}

    switch (activeBlock) {
      case 'INTRO':
        return (
          <IntroEditor
            content={blockData}
            onChange={handleBlockChange}
          />
        )
      case 'EXPERIENCE':
        return (
          <ExperienceEditor
            content={blockData}
            onChange={handleBlockChange}
          />
        )
      case 'PROJECTS':
        return (
          <ProjectsEditor
            content={blockData}
            onChange={handleBlockChange}
          />
        )
      case 'CERTIFICATES':
        return (
          <CertificatesEditor
            content={blockData}
            onChange={handleBlockChange}
          />
        )
      case 'CONTACT':
        return (
          <ContactEditor
            content={blockData}
            onChange={handleBlockChange}
          />
        )
      default:
        return <div>Selecciona un bloque para editar</div>
    }
  }

  const getPortfolioUrl = () => {
    if (!portfolio) return ''
    
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? `${portfolio.subdomainSlug}.foliomesh.local:3000`
      : `${portfolio.subdomainSlug}.foliomesh.com`
    
    if (portfolio.visibility === 'PRIVATE' && portfolio.privateToken) {
      return `${baseUrl}/${portfolio.privateToken}`
    }
    
    return baseUrl
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Editor de Portfolio
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {portfolio?.subdomainSlug}.foliomesh.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isSaving && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  Guardando...
                </div>
              )}
              
              <Button variant="outline" size="sm" onClick={forceSave}>
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
              
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                </Link>
              </Button>
              
              <Button size="sm" asChild>
                <a 
                  href={`http://${getPortfolioUrl()}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Previsualizar
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Sidebar - Lista de bloques */}
          <div className="col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Secciones del portfolio</h3>
              </div>
              
              <nav className="p-2">
                {(Object.keys(blockNames) as BlockType[]).map((blockType) => {
                  const Icon = blockIcons[blockType]
                  const isActive = activeBlock === blockType
                  
                  return (
                    <button
                      key={blockType}
                      onClick={() => setActiveBlock(blockType)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {blockNames[blockType]}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Editor Principal */}
          <div className="col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                {renderBlockEditor()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}