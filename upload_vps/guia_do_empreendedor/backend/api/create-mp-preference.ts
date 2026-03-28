export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')
  const body = req.body
  const token = process.env.MP_ACCESS_TOKEN as string
  const site = process.env.SITE_URL as string
  if (!token) return res.status(500).send('Missing MP_ACCESS_TOKEN')

  const parsePrice = (v: unknown): number => {
    if (typeof v === 'number') return v
    let s = String(v ?? '').trim()
    s = s.replace(/[R$\s]/gi, '')
    if (s.includes('.') && s.includes(',')) {
      s = s.replace(/\./g, '').replace(',', '.')
    } else {
      s = s.replace(',', '.')
    }
    const n = parseFloat(s)
    return isNaN(n) ? 0 : n
  }

  const payload = {
    items: [
      {
        title: body.title ?? body.item_title,
        unit_price: parsePrice(body.unit_price),
        quantity: Number(body.quantity ?? 1),
      },
    ],
    external_reference: JSON.stringify({ user_id: body.user_id, organization_id: body.organization_id, plan_type: body.plan_type }),
    payer: { email: body.email ?? body.payer_email },
    back_urls: {
      success: `${site}/payment-success?plan=${body.plan_type}`,
      failure: `${site}/`,
      pending: `${site}/`,
    },
    auto_return: 'approved',
  }

  const supaUrl = process.env.SUPABASE_URL as string
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  const orgId = body.organization_id as string
  const couponCode = (body.couponCode || '').toString().trim().toUpperCase()
  const dryRun = Boolean(body.dry_run)

  let finalPrice = payload.items[0].unit_price
  let couponRow: any = null
  if (couponCode && supaUrl && supaKey && orgId) {
    const cResp = await fetch(`${supaUrl}/rest/v1/coupons?select=id,code,type,value,valid_until,max_uses,used_count,status&organization_id=eq.${orgId}&code=eq.${couponCode}`, {
      headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}` }
    })
    const cData = await cResp.json()
    const c = Array.isArray(cData) ? cData[0] : null
    const nowIso = new Date().toISOString()
    const validDate = !c?.valid_until || (new Date(c.valid_until).toISOString() >= nowIso)
    const validUses = !c?.max_uses || (Number(c.used_count || 0) < Number(c.max_uses))
    const isActive = c?.status !== 'inactive'
    if (c && isActive && validDate && validUses) {
      couponRow = c
      if (c.type === 'percentage') {
        finalPrice = Math.max(0, Number(finalPrice) * (1 - Number(c.value) / 100))
      } else {
        finalPrice = Math.max(0, Number(finalPrice) - Number(c.value))
      }
    }
  }

  if (dryRun) {
    return res.status(200).json({ ok: true, new_price: finalPrice })
  }

  if (finalPrice <= 0 && supaUrl && supaKey && orgId) {
    try {
      await fetch(`${supaUrl}/rest/v1/affiliates?organization_id=eq.${orgId}&user_id=eq.${body.user_id}`, {
        method: 'PATCH',
        headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ payment_status: 'active' })
      })
      await fetch(`${supaUrl}/rest/v1/orders?organization_id=eq.${orgId}&user_id=eq.${body.user_id}&status=neq.paid`, {
        method: 'PATCH',
        headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ status: 'paid' })
      })
      if (couponRow?.id) {
        const nextUsed = Number(couponRow.used_count || 0) + 1
        await fetch(`${supaUrl}/rest/v1/coupons?id=eq.${couponRow.id}&organization_id=eq.${orgId}`, {
          method: 'PATCH',
          headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: JSON.stringify({ used_count: nextUsed })
        })
      }
    } catch (e: any) {
      console.error('Erro ao confirmar pedido gratuito:', e?.message || e)
    }
    const redirect_url = `${site}/payment-success?plan=${body.plan_type}`
    return res.status(200).json({ status: 'free_approved', redirect_url })
  }

  const mpPayload = { ...payload, items: [{ ...payload.items[0], unit_price: finalPrice }] }
  const resp = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mpPayload),
  })
  const data = await resp.json()
  if (!resp.ok) {
    console.error('ERRO MP DETALHADO:', JSON.stringify(data))
    return res.status(resp.status).json({ error: data?.message || 'Erro na API do Mercado Pago', details: data })
  }
  console.log('DEBUG MP NO SERVIDOR:', JSON.stringify(data))
  const init_point = data?.init_point || data?.body?.init_point || data?.response?.init_point || data?.sandbox_init_point || data?.point_of_interaction?.transaction_data?.ticket_url
  return res.status(200).json({ debug_mode: true, full_response: data, init_point })
}

