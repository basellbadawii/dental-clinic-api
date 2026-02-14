import { supabase } from './supabase'

// Get clinic settings (always returns the first/only record)
export const getClinicSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('clinic_settings')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      // If no settings exist, create default settings
      if (error.code === 'PGRST116') {
        const { data: newData, error: insertError } = await supabase
          .from('clinic_settings')
          .insert({
            clinic_name: 'عيادة الأسنان',
            clinic_phone: '01000000000'
          })
          .select()
          .single()

        if (insertError) throw insertError
        return newData
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching clinic settings:', error)
    throw error
  }
}

// Update clinic settings
export const updateClinicSettings = async (settings) => {
  try {
    // Get the existing settings to get the ID
    const existing = await getClinicSettings()
    
    const { data, error } = await supabase
      .from('clinic_settings')
      .update(settings)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating clinic settings:', error)
    throw error
  }
}

// Update clinic info only
export const updateClinicInfo = async (info) => {
  try {
    const existing = await getClinicSettings()
    
    const { data, error } = await supabase
      .from('clinic_settings')
      .update({
        clinic_name: info.clinic_name,
        clinic_phone: info.clinic_phone,
        clinic_email: info.clinic_email,
        clinic_address: info.clinic_address
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating clinic info:', error)
    throw error
  }
}

// Update WhatsApp settings
export const updateWhatsAppSettings = async (whatsappSettings) => {
  try {
    const existing = await getClinicSettings()
    
    const { data, error } = await supabase
      .from('clinic_settings')
      .update({
        whatsapp_enabled: whatsappSettings.whatsapp_enabled,
        whatsapp_phone: whatsappSettings.whatsapp_phone,
        whatsapp_api_key: whatsappSettings.whatsapp_api_key
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating WhatsApp settings:', error)
    throw error
  }
}

// Update n8n settings
export const updateN8nSettings = async (n8nSettings) => {
  try {
    const existing = await getClinicSettings()
    
    const { data, error } = await supabase
      .from('clinic_settings')
      .update({
        n8n_enabled: n8nSettings.n8n_enabled,
        n8n_webhook_url: n8nSettings.n8n_webhook_url,
        n8n_api_key: n8nSettings.n8n_api_key
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating n8n settings:', error)
    throw error
  }
}

// Update working hours
export const updateWorkingHours = async (workingHours) => {
  try {
    const existing = await getClinicSettings()
    
    const { data, error } = await supabase
      .from('clinic_settings')
      .update({
        working_hours: workingHours
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating working hours:', error)
    throw error
  }
}
