import { NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { portfolioId: string } }
) {
  try {
    const serviceSupabase = createServiceSupabase()
    
    const { data: blocks, error } = await serviceSupabase
      .from('blocks')
      .select('*')
      .eq('portfolio_id', params.portfolioId)
      .order('order')
    
    if (error) throw error
    
    return NextResponse.json({ blocks })
  } catch (error: any) {
    console.error('Error fetching blocks:', error)
    return NextResponse.json(
      { error: 'Error al obtener bloques', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { portfolioId: string } }
) {
  try {
    const { blockId, content } = await request.json()
    const serviceSupabase = createServiceSupabase()
    
    const { data: updatedBlock, error } = await serviceSupabase
      .from('blocks')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', blockId)
      .eq('portfolio_id', params.portfolioId)
      .select()
      .single()
    
    if (error) throw error
    
    // También actualizar el portfolio
    await serviceSupabase
      .from('portfolios')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', params.portfolioId)
    
    return NextResponse.json({ 
      block: updatedBlock,
      message: 'Bloque actualizado exitosamente' 
    })
  } catch (error: any) {
    console.error('Error updating block:', error)
    return NextResponse.json(
      { error: 'Error al actualizar bloque', details: error.message },
      { status: 500 }
    )
  }
}