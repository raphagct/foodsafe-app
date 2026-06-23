import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

type RiskLevel = 'Unsafe' | 'Suspected'

export async function createReport(
  file: File,
  productName: string,
  riskLevel: RiskLevel,
  description: string
) {
  const fileExt = file.name.split('.').pop() ?? 'jpg'
  const fileName = `${crypto.randomUUID()}.${fileExt}`
  const filePath = `reports/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('report-images')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Erreur upload image :', uploadError)
    return null
  }

  const { data } = supabase.storage
    .from('report-images')
    .getPublicUrl(filePath)

  const imageUrl = data.publicUrl

  const { data: reportData, error: insertError } = await supabase
    .from('report')
    .insert({
      product_name: productName,
      risk_level: riskLevel,
      description,
      image_url: imageUrl,
    })
    .select()

  if (insertError) {
    console.error('Erreur insertion BDD :', insertError)
    return null
  }

  console.log('Report ajouté :', reportData)
  return reportData?.[0] ?? null
}