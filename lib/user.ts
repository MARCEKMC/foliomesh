import { supabase, createServiceSupabase } from './supabase'

export interface User {
  id: string
  email: string
  supabaseUserId: string
  givenName: string
  familyName1: string
  familyName2?: string
  middleName?: string
  avatarUrl?: string
  localePref?: string
  preferredSlug?: string
  createdAt: Date
  updatedAt: Date
}

export interface Portfolio {
  id: string
  userId: string
  subdomainSlug: string
  visibility: 'PUBLIC' | 'PRIVATE'
  privateToken?: string
  theme: any
  createdAt: Date
  updatedAt: Date
}

// Función para generar slug único basado en nombre
export function generateSlug(givenName: string, familyName1: string, familyName2?: string, middleName?: string): string {
  // Normalizar y limpiar nombres
  const normalize = (str: string) => str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9]/g, '') // Solo letras y números

  let baseSlug = normalize(givenName) + normalize(familyName1)
  
  // Si el slug es muy corto, usar nombres adicionales
  if (baseSlug.length < 3) {
    if (familyName2) baseSlug += normalize(familyName2)
    if (middleName && baseSlug.length < 6) baseSlug += normalize(middleName)
  }
  
  return baseSlug
}

// Función para encontrar slug disponible
export async function findAvailableSlug(baseSlug: string): Promise<string> {
  const serviceSupabase = createServiceSupabase()
  
  // Verificar si el slug base está disponible
  const { data: existing } = await serviceSupabase
    .from('portfolios')
    .select('subdomain_slug')
    .eq('subdomain_slug', baseSlug)
    .single()
  
  if (!existing) {
    return baseSlug
  }
  
  // Si no está disponible, probar variaciones
  let counter = 2
  while (counter < 100) {
    const candidateSlug = `${baseSlug}${counter}`
    
    const { data: existingVariant } = await serviceSupabase
      .from('portfolios')
      .select('subdomain_slug')
      .eq('subdomain_slug', candidateSlug)
      .single()
    
    if (!existingVariant) {
      return candidateSlug
    }
    
    counter++
  }
  
  // Fallback con timestamp
  return `${baseSlug}${Date.now().toString().slice(-4)}`
}

// Función para crear o actualizar usuario
export async function upsertUser(userData: {
  supabaseUserId: string
  email: string
  givenName: string
  familyName1: string
  familyName2?: string
  middleName?: string
  avatarUrl?: string
}): Promise<User> {
  const serviceSupabase = createServiceSupabase()
  
  // Buscar usuario existente
  const { data: existingUser } = await serviceSupabase
    .from('users')
    .select('*')
    .eq('supabase_user_id', userData.supabaseUserId)
    .single()
  
  if (existingUser) {
    // Actualizar usuario existente
    const { data: updatedUser, error } = await serviceSupabase
      .from('users')
      .update({
        email: userData.email,
        avatar_url: userData.avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('supabase_user_id', userData.supabaseUserId)
      .select()
      .single()
    
    if (error) throw error
    return updatedUser
  } else {
    // Crear nuevo usuario
    const { data: newUser, error } = await serviceSupabase
      .from('users')
      .insert({
        supabase_user_id: userData.supabaseUserId,
        email: userData.email,
        given_name: userData.givenName,
        family_name1: userData.familyName1,
        family_name2: userData.familyName2,
        middle_name: userData.middleName,
        avatar_url: userData.avatarUrl,
        locale_pref: 'es'
      })
      .select()
      .single()
    
    if (error) throw error
    return newUser
  }
}

// Función para crear portfolio inicial
export async function createInitialPortfolio(userId: string, slug: string): Promise<Portfolio> {
  const serviceSupabase = createServiceSupabase()
  
  // Generar token para portfolio privado
  const privateToken = generatePrivateToken()
  
  // Crear portfolio
  const { data: portfolio, error } = await serviceSupabase
    .from('portfolios')
    .insert({
      user_id: userId,
      subdomain_slug: slug,
      visibility: 'PRIVATE',
      private_token: privateToken,
      theme: {
        palette: 'blue',
        font: 'inter',
        background: 'gradient'
      }
    })
    .select()
    .single()
  
  if (error) throw error
  
  // Crear bloques iniciales
  const defaultBlocks = [
    { type: 'INTRO', order: 1, content: { title: '¡Hola! Soy...', description: 'Presenta quién eres y qué haces' } },
    { type: 'EXPERIENCE', order: 2, content: { title: 'Mi experiencia', items: [] } },
    { type: 'PROJECTS', order: 3, content: { title: 'Mis proyectos', description: 'Estos son algunos de mis trabajos destacados' } },
    { type: 'CERTIFICATES', order: 4, content: { title: 'Certificados y premios', items: [] } },
    { type: 'CONTACT', order: 5, content: { title: 'Contacto', description: 'Conectemos y trabajemos juntos' } }
  ]
  
  for (const block of defaultBlocks) {
    await serviceSupabase
      .from('blocks')
      .insert({
        portfolio_id: portfolio.id,
        type: block.type,
        order: block.order,
        content: block.content
      })
  }
  
  return portfolio
}

// Función para generar token privado
export function generatePrivateToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  // Generar 3 números y 3 letras en orden aleatorio
  const numbers = Array(3).fill(0).map(() => Math.floor(Math.random() * 10))
  const letters = Array(3).fill(0).map(() => chars[Math.floor(Math.random() * 26)])
  
  // Combinar y mezclar
  const combined = [...numbers, ...letters]
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]]
  }
  
  return combined.join('')
}