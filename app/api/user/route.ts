import { NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase'
import { upsertUser, createInitialPortfolio, generateSlug, findAvailableSlug } from '@/lib/user'

export async function POST(request: Request) {
  try {
    const { user: supabaseUser } = await request.json()
    
    if (!supabaseUser) {
      return NextResponse.json({ error: 'Usuario no proporcionado' }, { status: 400 })
    }
    
    // Extraer información del usuario de Google
    const givenName = supabaseUser.user_metadata?.given_name || supabaseUser.user_metadata?.name?.split(' ')[0] || 'Usuario'
    const familyName = supabaseUser.user_metadata?.family_name || supabaseUser.user_metadata?.name?.split(' ').slice(1).join(' ') || 'Apellido'
    
    // Separar apellidos si vienen juntos
    const familyNames = familyName.split(' ')
    const familyName1 = familyNames[0] || 'Apellido'
    const familyName2 = familyNames[1] || undefined
    
    // Crear o actualizar usuario
    const userData = {
      supabaseUserId: supabaseUser.id,
      email: supabaseUser.email,
      givenName,
      familyName1,
      familyName2,
      avatarUrl: supabaseUser.user_metadata?.avatar_url
    }
    
    const user = await upsertUser(userData)
    
    // Verificar si ya tiene portfolio
    const serviceSupabase = createServiceSupabase()
    const { data: existingPortfolio } = await serviceSupabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    let portfolio = existingPortfolio
    
    if (!portfolio) {
      // Generar slug único
      const baseSlug = generateSlug(givenName, familyName1, familyName2)
      const availableSlug = await findAvailableSlug(baseSlug)
      
      // Crear portfolio inicial
      portfolio = await createInitialPortfolio(user.id, availableSlug)
    }
    
    return NextResponse.json({ 
      user,
      portfolio,
      message: 'Usuario procesado exitosamente' 
    })
    
  } catch (error: any) {
    console.error('Error en /api/user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}