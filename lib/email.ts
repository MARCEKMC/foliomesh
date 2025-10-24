import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const data = await resend.emails.send({
      from: `Foliomesh <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject,
      html,
      text: text || subject
    })

    console.log('Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error }
  }
}

// Template para verificación de cuenta
export function getVerificationEmailTemplate(verificationUrl: string, userEmail: string) {
  return {
    subject: '¡Verifica tu cuenta en Foliomesh!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verifica tu cuenta</title>
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
            .content { padding: 40px 20px; background: #ffffff; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 ¡Bienvenido a Foliomesh!</h1>
              <p>Crea portfolios profesionales sin código</p>
            </div>
            <div class="content">
              <h2>¡Hola!</h2>
              <p>Gracias por registrarte en <strong>Foliomesh</strong>. Para completar tu registro, necesitamos verificar tu dirección de email.</p>
              
              <p>Haz clic en el botón de abajo para verificar tu cuenta:</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" class="button">Verificar mi cuenta</a>
              </p>
              
              <p><strong>¿Por qué verificar?</strong></p>
              <ul>
                <li>✅ Acceso completo a todas las funciones</li>
                <li>✅ Seguridad de tu cuenta</li>
                <li>✅ Notificaciones importantes</li>
              </ul>
              
              <p>Si no puedes hacer clic en el botón, copia y pega esta URL en tu navegador:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              
              <p>Este enlace expira en <strong>24 horas</strong>.</p>
            </div>
            <div class="footer">
              <p>Si no te registraste en Foliomesh, puedes ignorar este email.</p>
              <p>© 2025 Foliomesh. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
¡Bienvenido a Foliomesh!

Gracias por registrarte. Para completar tu registro, verifica tu email haciendo clic en este enlace:

${verificationUrl}

Este enlace expira en 24 horas.

Si no te registraste en Foliomesh, puedes ignorar este email.

© 2025 Foliomesh
    `
  }
}

// Template para magic link de login
export function getMagicLinkEmailTemplate(magicUrl: string, userEmail: string) {
  return {
    subject: '🔐 Tu enlace de acceso a Foliomesh',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Accede a tu cuenta</title>
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
            .content { padding: 40px 20px; background: #ffffff; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Acceso a Foliomesh</h1>
            </div>
            <div class="content">
              <h2>¡Hola!</h2>
              <p>Recibimos una solicitud para acceder a tu cuenta de Foliomesh desde <strong>${userEmail}</strong>.</p>
              
              <p>Haz clic en el botón de abajo para acceder de forma segura:</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${magicUrl}" class="button">Acceder a mi cuenta</a>
              </p>
              
              <p>Si no puedes hacer clic en el botón, copia y pega esta URL en tu navegador:</p>
              <p style="word-break: break-all; color: #667eea;">${magicUrl}</p>
              
              <p>Este enlace expira en <strong>15 minutos</strong> por seguridad.</p>
              
              <p>Si no solicitaste este acceso, puedes ignorar este email de forma segura.</p>
            </div>
            <div class="footer">
              <p>© 2025 Foliomesh. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Acceso a Foliomesh

Haz clic en este enlace para acceder a tu cuenta:

${magicUrl}

Este enlace expira en 15 minutos.

Si no solicitaste este acceso, puedes ignorar este email.

© 2025 Foliomesh
    `
  }
}