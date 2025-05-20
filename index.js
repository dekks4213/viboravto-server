import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()
app.use(cors())
app.use(express.json())

// 🔐 Жестко зашитые значения (можно потом вынести в .env)
const TELEGRAM_BOT_TOKEN = '7771322160:AAFLyF3kPc5NdyRHz5pwFZhWJnr6T1tt-RM'
const TELEGRAM_CHAT_ID = '135146146'

app.post('/send-form', async (req, res) => {
  const { name, phone, email, vehicleType, country, comments } = req.body

  const message = `
🚗 Новая заявка с сайта:
👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email || 'не указано'}
🚘 Тип авто: ${vehicleType}
🌏 Страна: ${country}
📝 Комментарий: ${comments || 'нет'}
`

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    })

    res.json({ success: true })
  } catch (err) {
    console.error(err.response?.data || err.message)
    res.status(500).json({ success: false, message: 'Ошибка отправки в Telegram' })
  }
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`))
