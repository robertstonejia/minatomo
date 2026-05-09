const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'kahyousei@gmail.com',
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailText =
`みんなの日中交流会 お問い合わせフォーム

お名前: ${name}
メール: ${email}
件名: ${subject || '（なし）'}

メッセージ:
${message}
`;

  try {
    await transporter.sendMail({
      from: 'みんなの日中交流会 <kahyousei@gmail.com>',
      to: 'kahyousei@gmail.com',
      replyTo: email,
      subject: `[お問い合わせ] ${subject || '（件名なし）'}`,
      text: mailText,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
