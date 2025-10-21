"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { IntroBlock } from '@/types/portfolio'
import { Upload, User } from 'lucide-react'

interface IntroEditorProps {
  content: IntroBlock
  onChange: (content: IntroBlock) => void
}

export function IntroEditor({ content, onChange }: IntroEditorProps) {
  const [data, setData] = useState<IntroBlock>({
    title: content.title || '¡Hola! Soy...',
    subtitle: content.subtitle || 'Tu profesión o título',
    description: content.description || 'Cuéntanos sobre ti, tu experiencia y qué te apasiona...',
    profileImage: content.profileImage
  })

  const handleChange = (field: keyof IntroBlock, value: string) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    onChange(newData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <User className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Presentación</h3>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="intro-title">Título principal</Label>
          <Input
            id="intro-title"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="¡Hola! Soy Kevin Mendoza"
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="intro-subtitle">Subtítulo/Profesión</Label>
          <Input
            id="intro-subtitle"
            value={data.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            placeholder="Desarrollador Full Stack"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="intro-description">Descripción</Label>
          <Textarea
            id="intro-description"
            value={data.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Cuéntanos sobre ti, tu experiencia, qué te motiva..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Foto de perfil</Label>
          <div className="flex items-center gap-4">
            {data.profileImage ? (
              <div className="relative">
                <img
                  src={data.profileImage}
                  alt="Perfil"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                  onClick={() => handleChange('profileImage', '')}
                >
                  ×
                </Button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Subir foto
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Recomendado: 400x400px, formato JPG o PNG
          </p>
        </div>
      </div>
    </div>
  )
}