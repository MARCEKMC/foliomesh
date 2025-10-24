'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const sendTestEmail = async () => {
    if (!email) {
      toast.error('Por favor ingresa un email')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('¡Email enviado exitosamente! 🎉')
        console.log('Resultado:', data)
      } else {
        toast.error(`Error: ${data.error}`)
        console.error('Error:', data)
      }
    } catch (error) {
      toast.error('Error conectando con el servidor')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            🧪 Test Email Foliomesh
          </h1>
          <p className="text-gray-600 mt-2">
            Prueba la configuración de Resend
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de prueba:
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu-email@example.com"
              className="w-full"
            />
          </div>

          <Button 
            onClick={sendTestEmail}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Enviando...' : 'Enviar Email de Prueba'}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">ℹ️ Información:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Email desde: support@foliomesh.com</li>
            <li>• Servicio: Resend</li>
            <li>• Estado: Configuración de prueba</li>
          </ul>
        </div>
      </div>
    </div>
  )
}