import { useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'

interface UseAutosaveOptions {
  data: any
  onSave: (data: any) => Promise<void>
  delay?: number
  enabled?: boolean
}

export function useAutosave({ data, onSave, delay = 1000, enabled = true }: UseAutosaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastSavedRef = useRef<string>()
  const isSavingRef = useRef(false)

  const save = useCallback(async () => {
    if (isSavingRef.current) return
    
    try {
      isSavingRef.current = true
      await onSave(data)
      lastSavedRef.current = JSON.stringify(data)
      // toast.success('Guardado automáticamente', { duration: 1000 })
    } catch (error: any) {
      console.error('Error en autosave:', error)
      toast.error('Error al guardar: ' + error.message)
    } finally {
      isSavingRef.current = false
    }
  }, [data, onSave])

  useEffect(() => {
    if (!enabled) return

    const currentDataString = JSON.stringify(data)
    
    // No guardar si no hay cambios
    if (currentDataString === lastSavedRef.current) return
    
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Programar nuevo guardado
    timeoutRef.current = setTimeout(save, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, save, delay, enabled])

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    save()
  }, [save])

  return { forceSave, isSaving: isSavingRef.current }
}