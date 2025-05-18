const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let savedWebhook = ''; // Armazena webhook no servidor (pode ser em arquivo ou DB, aqui só em memória)

// Endpoint pra salvar webhook no servidor
app.post('/api/webhook', (req, res) => {
  const { webhookUrl } = req.body;
  if (!webhookUrl || !webhookUrl.startsWith('https://')) {
    return res.status(400).json({ error: 'Webhook inválido' });
  }
  savedWebhook = webhookUrl;
  res.json({ message: 'Webhook salvo com sucesso' });
});

// Endpoint pra pegar webhook salvo
app.get('/api/webhook', (req, res) => {
  if (!savedWebhook) return res.status(404).json({ error: 'Nenhum webhook salvo' });
  res.json({ webhookUrl: savedWebhook });
});

// Endpoint para enviar logs para o webhook
app.post('/api/sendlogs', async (req, res) => {
  const { logs } = req.body;
  if (!logs || typeof logs !== 'string' || logs.trim() === '') {
    return res.status(400).json({ error: 'Logs inválidos' });
  }
  if (!savedWebhook) return res.status(400).json({ error: 'Webhook não configurado' });

  try {
    const response = await fetch(savedWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `Logs recebidos:\n${logs}` }),
    });
    if (!response.ok) {
      throw new Error(`Erro ao enviar webhook: ${response.statusText}`);
    }
    res.json({ message: 'Logs enviados com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
