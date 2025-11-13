import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/lekcja', async (req, res) => {
  res.json({ status: 'ok', message: 'Serwer działa, lekcja będzie za chwilę' });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
