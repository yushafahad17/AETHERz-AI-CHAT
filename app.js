const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const chatController = require('./src/controllers/chatController');
const chatRoutes = require('./src/routes/chatRoutes');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());

app.use('/', chatRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
