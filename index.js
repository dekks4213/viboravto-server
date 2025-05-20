import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()
app.use(cors())
app.use(express.json())

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID

app.post('/send-form', async (req, res) => {
  const { name, phone, email, vehicleType, country, comments } = req.body

  const message = `
🚘 <b>Новая заявка с сайта</b>
👤 <b>Имя:</b> ${name}
📞 <b>Телефон:</b> ${phone}
📧 <b>Email:</b> ${email || '—'}
🚗 <b>Интересует:</b> ${vehicleType}
🌍 <b>Страна:</b> ${country}
📝 <b>Комментарий:</b> ${comments || '—'}
  `

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
    res.json({ success: true })
  } catch (err) {
    console.error('Ошибка Telegram:', err.response?.data || err.message)
    res.status(500).json({ success: false, message: 'Ошибка при отправке в Telegram' })
  }
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Сервер запущен на ${PORT}`))
