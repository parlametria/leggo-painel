const express = require("express");
const path = require("path");
const forceSsl = require("force-ssl-heroku");
const compression = require('compression');

const app = express();

app.use(forceSsl);
app.use(compression());

app.use(express.static("dist/leggo-painel"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "leggo-painel", "index.html"));
});

const port = process.env.PORT || 8080

app.listen(port, () => console.log(`Servidor web rodando em ${port}`))
