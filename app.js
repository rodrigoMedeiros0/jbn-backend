const express = require("express");
const bodyParser = require("body-parser"); 
const app = express();
const cors = require("cors");

const fs = require('fs');
const path = require('path');

const buildingRouter = require("./routes/buildingRoutes");
const userRouter = require("./routes/userRoutes");

require("dotenv").config();
require("./db");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

const port = process.env.PORT || 5000;

app.use("/building", buildingRouter);

app.use("/auth", userRouter);

app.use((error, req, res, next) => {
    if (req.file) {
      fs.unlink(req.file.path, err => {
        console.log(err);
      });
    }
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'Erro inesperado!' });
  });

app.listen(port, () => {
    console.log(`O servidor está rodando na porta ${port}`)
})