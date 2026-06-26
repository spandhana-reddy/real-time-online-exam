require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session({
    secret: 'onlineexamsecret',
    resave: false,
    saveUninitialized: true
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(require('./routes/student'));
app.use(require('./routes/admin'));
app.use(require('./routes/exam'));
app.use(require('./routes/result'));

// Default route
app.get('/', (req, res) => {
    res.redirect('/login');
});

// 404 Page
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});