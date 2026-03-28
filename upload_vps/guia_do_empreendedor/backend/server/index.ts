import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import createMpPreference from '../api/create-mp-preference'
import mercadopagoWebhook from '../api/webhooks/mercadopago'
import resetPassword from '../api/admin/reset-password'

const app = new Hono()

// Middleware para CORS
app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (c.req.method === 'OPTIONS') {
    return c.text('', 204)
  }

  await next()
})

// Wrapper para adaptar funções Vercel para Hono
const wrapVercelHandler = (handler: any) => {
  return async (c: any) => {
    const body = await c.req.json().catch(() => ({}))

    const req = {
      method: c.req.method,
      body,
      query: Object.fromEntries(new URL(c.req.url).searchParams),
    }

    const res = {
      status: (code: number) => ({
        json: (data: any) => c.json(data, code),
        send: (text: string) => c.text(text, code),
      }),
    }

    return await handler(req, res)
  }
}

// Rotas da API
app.post('/api/create-mp-preference', wrapVercelHandler(createMpPreference))
app.post('/api/webhooks/mercadopago', wrapVercelHandler(mercadopagoWebhook))
app.post('/api/admin/reset-password', wrapVercelHandler(resetPassword))

// Rota de health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', message: 'API Server is running' })
})

// Porta do servidor
const port = parseInt(process.env.API_PORT || '5000', 10)

console.log(`🚀 API Server rodando em http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
  // Não especificar hostname permite que o Node.js decida a melhor forma de bind
})
