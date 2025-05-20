import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'

const app = express()
app.use(cors())
app.use(express.json())

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

app.post('/send-form', async (req, res) => {
  const { name, phone, email, type, country, comment } = req.body

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    subject: 'Новая заявка с сайта',
    html: `
      <h3>Новая заявка с сайта</h3>
      <p><strong>Имя:</strong> ${name}</p>
      <p><strong>Телефон:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Интересует:</strong> ${type}</p>
      <p><strong>Страна:</strong> ${country}</p>
      <p><strong>Комментарий:</strong> ${comment}</p>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Ошибка при отправке' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Сервер запущен на ${PORT}`))