const mongoose = require("mongoose");

require("dotenv").config();

async function main() {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterjbn.4aopisj.mongodb.net/?retryWrites=true&w=majority`
  );

  console.log("Conectado com sucesso!")
}

main().catch((err) => console.log(err))

module.exports=main;