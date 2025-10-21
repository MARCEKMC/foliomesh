"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ProjectsBlock, Project } from '@/types/portfolio'
import { FolderOpen, Plus, Trash2, GripVertical, ExternalLink, Star } from 'lucide-react'
import { nanoid } from 'nanoid'

interface ProjectsEditorProps {
  content: ProjectsBlock
  onChange: (content: ProjectsBlock) => void
}

export function ProjectsEditor({ content, onChange }: ProjectsEditorProps) {
  const [data, setData] = useState<ProjectsBlock>({
    title: content.title || 'Mis proyectos',
    description: content.description || 'Estos son algunos de mis trabajos destacados',
    projects: content.projects || []
  })

  const handleChange = (field: 'title' | 'description', value: string) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    onChange(newData)
  }

  const addProject = () => {
    const newProject: Project = {
      id: nanoid(),
      title: '',
      description: '',
      url: '',
      image: '',
      technologies: [],
      featured: false
    }
    
    const newData = {
      ...data,
      projects: [...data.projects, newProject]
    }
    setData(newData)
    onChange(newData)
  }

  const updateProject = (id: string, field: keyof Project, value: any) => {
    const newProjects = data.projects.map(project =>
      project.id === id ? { ...project, [field]: value } : project
    )
    
    const newData = { ...data, projects: newProjects }
    setData(newData)
    onChange(newData)
  }

  const removeProject = (id: string) => {
    const newProjects = data.projects.filter(project => project.id !== id)
    const newData = { ...data, projects: newProjects }
    setData(newData)
    onChange(newData)
  }

  const updateTechnologies = (id: string, techString: string) => {
    const technologies = techString.split(',').map(tech => tech.trim()).filter(Boolean)
    updateProject(id, 'technologies', technologies)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <FolderOpen className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Proyectos</h3>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="projects-title">Título de la sección</Label>
          <Input
            id="projects-title"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Mis proyectos"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="projects-description">Descripción</Label>
          <Textarea
            id="projects-description"
            value={data.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Estos son algunos de mis trabajos destacados"
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-4">
        {data.projects.map((project, index) => (
          <div key={project.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Proyecto {index + 1}</span>
                {project.featured && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(project.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre del proyecto</Label>
                <Input
                  value={project.title}
                  onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                  placeholder="Mi proyecto genial"
                />
              </div>

              <div className="space-y-2">
                <Label>URL/Enlace</Label>
                <div className="flex gap-2">
                  <Input
                    value={project.url}
                    onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                    placeholder="https://mi-proyecto.com"
                  />
                  {project.url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Descripción</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  placeholder="Describe qué hace el proyecto, qué problema resuelve..."
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Tecnologías utilizadas</Label>
                <Input
                  value={project.technologies.join(', ')}
                  onChange={(e) => updateTechnologies(project.id, e.target.value)}
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                />
                <p className="text-xs text-gray-500">
                  Separa las tecnologías con comas
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Imagen del proyecto</Label>
                <Input
                  value={project.image || ''}
                  onChange={(e) => updateProject(project.id, 'image', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg o sube una imagen"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={project.featured}
                    onChange={(e) => updateProject(project.id, 'featured', e.target.checked)}
                  />
                  <span className="text-sm">Proyecto destacado</span>
                  <Star className="w-4 h-4 text-yellow-500" />
                </label>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addProject}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar proyecto
        </Button>
      </div>
    </div>
  )
}