import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    console.log('Testing signup for email:', email)
    
    // Intentar registrar usuario de prueba
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: 'test123456',
      email_confirm: false // Para que requiera confirmación
    })
    
    if (error) {
      console.error('Supabase auth error:', error)
      return NextResponse.json({ 
        error: error.message,
        details: error 
      }, { status: 400 })
    }
    
    console.log('User created:', data)
    
    // Enviar email de confirmación
    const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: 'https://foliomesh.com/auth/callback'
    })
    
    if (inviteError) {
      console.error('Invite error:', inviteError)
      return NextResponse.json({ 
        error: inviteError.message,
        details: inviteError 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Email enviado exitosamente',
      user: data.user?.id 
    })
    
  } catch (error: any) {
    console.error('Test signup error:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error.message 
    }, { status: 500 })
  }
}