const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: ['http://dev.api.leggo.org.br', 'http://api.leggo.org.br'],
  methods: "OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["authorization", ]
};
app.use(cors(corsOptions));

app.use(express.static("dist/leggo-painel"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "leggo-painel", "index.html"));
});

const port = process.env.PORT || 8080

app.listen(port, () => console.log(`Servidor web rodando em ${port}`))
