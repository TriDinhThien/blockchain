const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser'); // Cài thêm: npm install body-parser

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data

// Fake users với roles (thay đổi tùy ý)
const users = {
  'manufacturer': { password: 'pass123', role: 'manufacturer' },
  'distributor': { password: 'pass123', role: 'distributor' },
  'consumer': { password: 'pass123', role: 'consumer' }
};

// Route cho trang login (mặc định)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
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
  res.sendFile(__dirname + '/public/manufacturer.html');
});

app.get('/distributor', (req, res) => {
  res.sendFile(__dirname + '/public/distributor.html');
});

app.get('/consumer', (req, res) => {
  res.sendFile(__dirname + '/public/consumer.html');
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));