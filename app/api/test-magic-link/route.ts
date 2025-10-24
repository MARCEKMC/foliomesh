import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    console.log('Enviando magic link a:', email)

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://foliomesh.com'}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error al enviar magic link:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('Magic link enviado exitosamente:', data)
    return NextResponse.json({ 
      message: 'Magic link enviado correctamente',
      data 
    })

  } catch (error: any) {
    console.error('Error en endpoint:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error.message 
    }, { status: 500 })
  }
}