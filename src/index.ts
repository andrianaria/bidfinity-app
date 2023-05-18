import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

db.authenticate()
  .then(() => {
    console.log('Connected to database!');
    app.get('/', (req, res) => {
      res.send('Server is on!');
    });
   
    require("./routes/routes")(app);

    app.listen(3000, () => {
      console.log('Server started on port 3000!');
    });
  })
  .catch((err: any) => {
    console.log('Unable to connect to the database:', err);
  });


