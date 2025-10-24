import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { to } = await req.json()
    
    if (!to) {
      return NextResponse.json(
        { error: 'Email destinatario requerido' },
        { status: 400 }
      )
    }

    const result = await sendEmail({
      to,
      subject: '🎉 ¡Test desde Foliomesh!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #667eea;">¡Funciona perfectamente! 🚀</h1>
          <p>Este es un email de prueba desde Foliomesh usando Resend.</p>
          <p>Tu configuración de email está lista para producción.</p>
          <hr>
          <p style="color: #666; font-size: 14px;">
            Enviado desde support@foliomesh.com
          </p>
        </div>
      `
    })

    if (result.success) {
      return NextResponse.json({
        message: 'Email enviado exitosamente',
        data: result.data
      })
    } else {
      return NextResponse.json(
        { error: 'Error enviando email', details: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error en test email:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}