"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ContactBlock } from '@/types/portfolio'
import { Mail, Phone, MapPin, Github, Linkedin, Globe } from 'lucide-react'

interface ContactEditorProps {
  content: ContactBlock
  onChange: (content: ContactBlock) => void
}

export function ContactEditor({ content, onChange }: ContactEditorProps) {
  const [data, setData] = useState<ContactBlock>({
    title: content.title || 'Contacto',
    description: content.description || 'Conectemos y trabajemos juntos',
    email: content.email || '',
    phone: content.phone || '',
    location: content.location || '',
    linkedin: content.linkedin || '',
    github: content.github || '',
    website: content.website || ''
  })

  const handleChange = (field: keyof ContactBlock, value: string) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    onChange(newData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Información de contacto</h3>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact-title">Título de la sección</Label>
          <Input
            id="contact-title"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Contacto"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-description">Descripción</Label>
          <Textarea
            id="contact-description"
            value={data.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Conectemos y trabajemos juntos"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact-email">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </Label>
            <Input
              id="contact-email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="tu@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone">
              <Phone className="w-4 h-4 inline mr-2" />
              Teléfono
            </Label>
            <Input
              id="contact-phone"
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-location">
              <MapPin className="w-4 h-4 inline mr-2" />
              Ubicación
            </Label>
            <Input
              id="contact-location"
              value={data.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Ciudad, País"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-website">
              <Globe className="w-4 h-4 inline mr-2" />
              Sitio web
            </Label>
            <Input
              id="contact-website"
              value={data.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://tusitioweb.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-linkedin">
              <Linkedin className="w-4 h-4 inline mr-2" />
              LinkedIn
            </Label>
            <Input
              id="contact-linkedin"
              value={data.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/tu-perfil"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-github">
              <Github className="w-4 h-4 inline mr-2" />
              GitHub
            </Label>
            <Input
              id="contact-github"
              value={data.github}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="https://github.com/tu-usuario"
            />
          </div>
        </div>
      </div>
    </div>
  )
}