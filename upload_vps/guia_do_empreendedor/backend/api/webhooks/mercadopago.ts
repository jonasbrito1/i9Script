export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')
  const body = req.body
  const topic = body.topic || body.type
  const id = body?.data?.id || body?.id
  if (topic !== 'payment' || !id) return res.status(200).json({ ok: true })

  const token = process.env.MP_ACCESS_TOKEN as string
  const supaUrl = process.env.SUPABASE_URL as string
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  if (!token || !supaUrl || !supaKey) return res.status(500).send('Missing env')

  const payResp = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const pay = await payResp.json()
  if (pay.status === 'approved') {
    let ref: any = null
    try { ref = JSON.parse(pay.external_reference) } catch {}
    if (ref?.user_id && ref?.organization_id) {
      await fetch(`${supaUrl}/rest/v1/affiliates?organization_id=eq.${ref.organization_id}&user_id=eq.${ref.user_id}`, {
        method: 'PATCH',
        headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ payment_status: 'active' }),
      })
      await fetch(`${supaUrl}/rest/v1/commissions?organization_id=eq.${ref.organization_id}&status=eq.pending&affiliate_id=eq.${ref.affiliate_id ?? ''}`, {
        method: 'PATCH',
        headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ status: 'available' }),
      })
      await fetch(`${supaUrl}/rest/v1/orders?organization_id=eq.${ref.organization_id}&user_id=eq.${ref.user_id}&status=neq.paid`, {
        method: 'PATCH',
        headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ status: 'paid' }),
      })
    }
  }
  return res.status(200).json({ ok: true })
}

