"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ExperienceBlock, ExperienceItem } from '@/types/portfolio'
import { Briefcase, Plus, Trash2, GripVertical } from 'lucide-react'
import { nanoid } from 'nanoid'

interface ExperienceEditorProps {
  content: ExperienceBlock
  onChange: (content: ExperienceBlock) => void
}

export function ExperienceEditor({ content, onChange }: ExperienceEditorProps) {
  const [data, setData] = useState<ExperienceBlock>({
    title: content.title || 'Mi experiencia',
    items: content.items || []
  })

  const handleTitleChange = (title: string) => {
    const newData = { ...data, title }
    setData(newData)
    onChange(newData)
  }

  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: nanoid(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: ''
    }
    
    const newData = {
      ...data,
      items: [...data.items, newItem]
    }
    setData(newData)
    onChange(newData)
  }

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    const newItems = data.items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    )
    
    const newData = { ...data, items: newItems }
    setData(newData)
    onChange(newData)
  }

  const removeExperience = (id: string) => {
    const newItems = data.items.filter(item => item.id !== id)
    const newData = { ...data, items: newItems }
    setData(newData)
    onChange(newData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Briefcase className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Experiencia laboral</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience-title">Título de la sección</Label>
        <Input
          id="experience-title"
          value={data.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Mi experiencia"
        />
      </div>

      <div className="space-y-4">
        {data.items.map((item, index) => (
          <div key={item.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Experiencia {index + 1}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(item.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Puesto de trabajo</Label>
                <Input
                  value={item.title}
                  onChange={(e) => updateExperience(item.id, 'title', e.target.value)}
                  placeholder="Desarrollador Frontend"
                />
              </div>

              <div className="space-y-2">
                <Label>Empresa</Label>
                <Input
                  value={item.company}
                  onChange={(e) => updateExperience(item.id, 'company', e.target.value)}
                  placeholder="Tech Company Inc."
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha de inicio</Label>
                <Input
                  type="month"
                  value={item.startDate}
                  onChange={(e) => updateExperience(item.id, 'startDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha de fin</Label>
                <div className="space-y-2">
                  <Input
                    type="month"
                    value={item.endDate}
                    onChange={(e) => updateExperience(item.id, 'endDate', e.target.value)}
                    disabled={item.current}
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.current}
                      onChange={(e) => updateExperience(item.id, 'current', e.target.checked)}
                    />
                    <span className="text-sm">Trabajo actual</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Ubicación</Label>
                <Input
                  value={item.location}
                  onChange={(e) => updateExperience(item.id, 'location', e.target.value)}
                  placeholder="Ciudad, País"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Descripción</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateExperience(item.id, 'description', e.target.value)}
                  placeholder="Describe tus responsabilidades y logros..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addExperience}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar experiencia
        </Button>
      </div>
    </div>
  )
}