const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

//Load env variables
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

//Route Files
const bootcamps = require('./routes/bootcamps');
const app = express();

//Body parser 
app.use(express.json());
//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);

//get the prot form config file or 5000 as default
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}!`.yellow.bold);
});

//Handle unhandled promise rejictions
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //close server & exit process
  server.close(() => process.exit(1));
});