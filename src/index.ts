import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import jwt from 'jsonwebtoken'

import gameRouter from './routes/game.js'
import playerRouter from './routes/player.js'
import chatRouter from './routes/chat.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))

// Middleware decode JWT từ Supabase
app.use((req: any, _res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (token) {
    try {
      const payload: any = jwt.decode(token)
      if (payload && payload.sub) {
        req.userId = payload.sub
      }
    } catch {
      // ignore
    }
  }
  next()
})

app.use('/api/game', gameRouter)
app.use('/api/player', playerRouter)
app.use('/api/chat', chatRouter)

const port = Number(process.env.PORT || 8080)
app.listen(port, () => {
  console.log(`API listening on :${port}`)
})
