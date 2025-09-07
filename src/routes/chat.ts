import { Router } from 'express'
import { supabaseAnon } from '../supabase.js'

const router = Router()

function requireUser(req: any, res: any, next: any) {
  if (!req.userId) return res.status(401).json({ error: 'Missing or invalid token' })
  next()
}

// Lấy 100 tin nhắn cuối
router.get('/', async (_req, res) => {
  const { data, error } = await supabaseAnon
    .from('chat_messages')
    .select('id, username, message, timestamp')
    .order('timestamp', { ascending: true })
    .limit(100)
  if (error) return res.status(500).json({ error: error.message })
  return res.json({ messages: data })
})

// Thêm tin nhắn
router.post('/', requireUser, async (req: any, res) => {
  const userId = req.userId
  const { username, message } = req.body
  if (typeof username !== 'string' || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing username or message' })
  }
  const insert = { user_id: userId, username, message, timestamp: new Date().toISOString() }
  const { data, error } = await supabaseAnon
    .from('chat_messages')
    .insert([insert])
    .select()
  if (error) return res.status(500).json({ error: error.message })
  return res.json({ created: data })
})

export default router
