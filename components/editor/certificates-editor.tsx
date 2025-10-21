"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CertificatesBlock, Certificate } from '@/types/portfolio'
import { Award, Plus, Trash2, GripVertical, ExternalLink } from 'lucide-react'
import { nanoid } from 'nanoid'

interface CertificatesEditorProps {
  content: CertificatesBlock
  onChange: (content: CertificatesBlock) => void
}

export function CertificatesEditor({ content, onChange }: CertificatesEditorProps) {
  const [data, setData] = useState<CertificatesBlock>({
    title: content.title || 'Certificados y premios',
    certificates: content.certificates || []
  })

  const handleTitleChange = (title: string) => {
    const newData = { ...data, title }
    setData(newData)
    onChange(newData)
  }

  const addCertificate = () => {
    const newCertificate: Certificate = {
      id: nanoid(),
      title: '',
      issuer: '',
      date: '',
      url: '',
      image: ''
    }
    
    const newData = {
      ...data,
      certificates: [...data.certificates, newCertificate]
    }
    setData(newData)
    onChange(newData)
  }

  const updateCertificate = (id: string, field: keyof Certificate, value: string) => {
    const newCertificates = data.certificates.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    )
    
    const newData = { ...data, certificates: newCertificates }
    setData(newData)
    onChange(newData)
  }

  const removeCertificate = (id: string) => {
    const newCertificates = data.certificates.filter(cert => cert.id !== id)
    const newData = { ...data, certificates: newCertificates }
    setData(newData)
    onChange(newData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Award className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Certificados y premios</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="certificates-title">Título de la sección</Label>
        <Input
          id="certificates-title"
          value={data.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Certificados y premios"
        />
      </div>

      <div className="space-y-4">
        {data.certificates.map((certificate, index) => (
          <div key={certificate.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Certificado {index + 1}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCertificate(certificate.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre del certificado</Label>
                <Input
                  value={certificate.title}
                  onChange={(e) => updateCertificate(certificate.id, 'title', e.target.value)}
                  placeholder="Certificación en React.js"
                />
              </div>

              <div className="space-y-2">
                <Label>Institución emisora</Label>
                <Input
                  value={certificate.issuer}
                  onChange={(e) => updateCertificate(certificate.id, 'issuer', e.target.value)}
                  placeholder="Meta / Facebook"
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha de obtención</Label>
                <Input
                  type="month"
                  value={certificate.date}
                  onChange={(e) => updateCertificate(certificate.id, 'date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Enlace de verificación</Label>
                <div className="flex gap-2">
                  <Input
                    value={certificate.url || ''}
                    onChange={(e) => updateCertificate(certificate.id, 'url', e.target.value)}
                    placeholder="https://verify.certification.com"
                  />
                  {certificate.url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={certificate.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Imagen del certificado</Label>
                <Input
                  value={certificate.image || ''}
                  onChange={(e) => updateCertificate(certificate.id, 'image', e.target.value)}
                  placeholder="https://ejemplo.com/certificado.jpg"
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addCertificate}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar certificado
        </Button>
      </div>
    </div>
  )
}