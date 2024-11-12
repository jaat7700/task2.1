// server.js
const express = require('express');
const bodyParser = require('body-parser');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const app = express();
app.use(bodyParser.json()); // Parses JSON data
app.use(express.static('public')); // Serves static files from the 'public' folder

const mg = mailgun.client({
  username: 'api',
  key: 'a0280cff5634e1cb4ace1cd31745d69d-79295dd0-95bd2ae0', // Replace with actual API key
});

const domain = 'sandboxb6543c465fbf4700a4844c7c492a7753.mailgun.org'; // Replace with actual Mailgun domain

// Endpoint to handle subscription
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: 'Email is required' });
  }

  const data = {
    from: 'DEV@Deakin <mailgun@sandboxb6543c465fbf4700a4844c7c492a7753.mailgun.org>',
    to: email,
    subject: 'Welcome to DEV@Deakin',
    text: 'Thank you for subscribing to DEV@Deakin!',
    html: '<h1>Welcome to DEV@Deakin!</h1><p>Thank you for subscribing to our platform.</p>',
  };

  try {
    const message = await mg.messages.create(domain, data);
    console.log('Email sent:', message);
    res.json({ success: true, message: 'Welcome email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.json({ success: false, message: 'Failed to send welcome email.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
