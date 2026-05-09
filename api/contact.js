import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kahyousei@gmail.com',
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: '"みんなの日中交流会" <kahyousei@gmail.com>',
      to: 'kahyousei@gmail.com',
      replyTo: email,
      subject: `=?UTF-8?B?${Buffer.from(subject ? `【お問い合わせ】${subject}` : '【お問い合わせ】（件名なし）').toString('base64')}?=`,
      text: `お名前：${name}\nメール：${email}\n\n${message}`,
      html: `
        <meta charset="UTF-8">
        <p><strong>お名前：</strong>${name}</p>
        <p><strong>メール：</strong>${email}</p>
        <hr>
        <p style="white-space:pre-wrap;">${message}</p>
      `,
      encoding: 'base64',
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Mail error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
