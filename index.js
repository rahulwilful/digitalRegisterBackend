const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectToMongo = require('./config/db.js');
const multer = require('multer');

connectToMongo();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5001;

app.get('/api', (req, res) => {
  return res.status(200).send('Welcome To Back-End');
});

app.use('/api/role', require('./routes/role_type.js'));
app.use('/api/user', require('./routes/user.js'));
app.use('/api/register', require('./routes/wareHouseRegister.js'));
app.use('/api/storage/location', require('./routes/storageLocation.js'));
app.use('/api/item', require('./routes/item.js'));
app.use('/api/quantity_unit', require('./routes/quantityUnit.js'));
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
