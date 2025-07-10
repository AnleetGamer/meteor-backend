
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const supabase = createClient(
  'https://your-supabase-url.supabase.co',
  'your-anon-key'
);

app.post('/log', async (req, res) => {
  const { type, message, user_agent } = req.body;
  const { error } = await supabase.from('logs').insert([{ type, message, user_agent, timestamp: new Date().toISOString() }]);
  if (error) return res.status(500).send(error);
  res.send('Log stored');
});

app.get('/get-logs', async (req, res) => {
  const { data, error } = await supabase.from('logs').select('*').order('timestamp', { ascending: false }).limit(50);
  if (error) return res.status(500).send(error);
  res.json(data);
});

app.listen(3000, () => console.log('Server running on port 3000'));
