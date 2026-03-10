require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fileUpload = require('express-fileupload');
const app = express();
const port = 3000;
const bodyParser = require('body-parser'); // Cài thêm: npm install body-parser

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data

// Fake users với roles (thay đổi tùy ý)
const users = {
  'manufacturer': { password: 'pass123', role: 'manufacturer' },
  'distributor': { password: 'pass123', role: 'distributor' },
  'consumer': { password: 'pass123', role: 'consumer' }
};

// Route cho trang login (mặc định)
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'login.html'));
});

// Xử lý form login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (user && user.password === password) {
    // Redirect dựa trên role
    res.redirect(`/${user.role}`);
  } else {
    res.send('Đăng nhập thất bại! <a href="/">Thử lại</a>');
  }
});

// Routes cho các trang dựa trên role
app.get('/manufacturer', (req, res) => {
  res.sendFile(path.join(publicDir, 'manufacturer.html'));
});

app.get('/distributor', (req, res) => {
  res.sendFile(path.join(publicDir, 'distributor.html'));
});

app.get('/consumer', (req, res) => {
  res.sendFile(path.join(publicDir, 'consumer.html'));
});

// Allow direct QR links like /verify.html?id=5
app.get('/verify.html', (req, res) => {
  res.sendFile(path.join(publicDir, 'verify.html'));
});

// Upload file to IPFS via Pinata
app.post('/api/upload', async (req, res) => {
  try {
    if (!process.env.PINATA_JWT) {
      return res.status(500).json({ error: 'Missing PINATA_JWT' });
    }
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file;
    const data = new FormData();
    data.append('file', file.data, { filename: file.name, contentType: file.mimetype });

    const pinataRes = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      data,
      {
        maxBodyLength: Infinity,
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          ...data.getHeaders()
        }
      }
    );

    return res.json({ cid: pinataRes.data.IpfsHash });
  } catch (err) {
    const msg = err.response?.data || err.message || String(err);
    return res.status(500).json({ error: msg });
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

