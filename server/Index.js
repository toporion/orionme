const express = require('express');
const { scheduleJobs } = require("./cronJobs");
const app = express();
const cors = require('cors');
// const bodyParser=require('body-parser')
require('dotenv').config();
require('./models/db')
const UserRoute=require('./routes/UserRoute')
const BlogRoute=require('./routes/BlogRoute')
const Contactroute=require('./routes/ContactRoute')
const OfferRoute=require('./routes/OfferRoute')
const cron = require('node-cron');
const Offer = require('./models/OfferModel');
const MockUpRoute=require('./routes/MockupRoute')
const port = process.env.PORT || 8080;


// Initialize the scheduled jobs
scheduleJobs();

app.use(cors());
app.use(express.json());

app.use('/api',UserRoute)
app.use('/api/blog',BlogRoute)
app.use('/api/contact',Contactroute)
app.use('/api/offer',OfferRoute)
app.use('/api/mockUp',MockUpRoute)


// Schedule the cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
      const now = new Date();
      const expiredOffers = await Offer.updateMany(
          { endDate: { $lt: now }, isActive: true },
          { $set: { isActive: false } }
      );

      console.log(`${expiredOffers.modifiedCount} offers expired and deactivated.`);
  } catch (error) {
      console.error('Error deactivating expired offers:', error.message);
  }
});

console.log("Cron job for offer expiration set up!");


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})