import { createClient } from '@supabase/supabase-js'

// ORG_ID fixo para verificação
const ORG_ID = '2a1c7014-83a1-48ce-b34e-45861ef12f8c'

// Função auxiliar para verificar se o usuário logado é um admin
async function isAdmin(supabase: any, token: string): Promise<boolean> {
  if (!token) return false
  
  // 1. Obter o usuário a partir do token
  const { data: userResponse, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userResponse.user) {
    console.error('Erro ao obter usuário pelo token:', userError?.message)
    return false
  }
  const uid = userResponse.user.id

  // 2. Verificar a role e organization_id na tabela profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, organization_id')
    .eq('id', uid)
    .maybeSingle()

  if (profileError || !profile) {
    console.error('Erro ao buscar perfil:', profileError?.message)
    return false
  }

  // 3. Checar se é admin e se pertence à organização correta
  return profile.role === 'admin' && profile.organization_id === ORG_ID
}

export default async function handler(req: any, res: any) {
  // 1. Obter o token de autenticação do cabeçalho
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1] // Espera-se 'Bearer [token]'

  // 2. Verificar se o usuário que está fazendo a requisição é um admin
  const supabaseClient = createClient(url, key)
  const isAuthorized = await isAdmin(supabaseClient, token)
  
  if (!isAuthorized) {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores autenticados podem redefinir senhas.' })
  }

  // O restante do código da função original...
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')
  const url = process.env.SUPABASE_URL as string
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  if (!url || !key) return res.status(500).json({ error: 'Missing Supabase admin credentials' })
  const { userId, newPassword } = req.body || {}
  if (!userId || !newPassword) return res.status(400).json({ error: 'Missing userId or newPassword' })
  
  // O restante do código da função original...
  if (String(newPassword).length < 6) return res.status(400).json({ error: 'Password too short' })
  try {
    const supabase = createClient(url, key)
    const resp = await supabase.auth.admin.updateUserById(String(userId), { password: String(newPassword) })
    if (resp.error) return res.status(400).json({ error: resp.error.message })
    return res.status(200).json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Unexpected error' })
  }
}
