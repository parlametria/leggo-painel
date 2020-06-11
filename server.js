const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')

const app = express()

app.use(serveStatic('dist/leggo-painel'))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'legoo-painel', 'index.html'));
});

const port = process.env.PORT || 8080

app.listen(port, () => console.log(`Servidor web rodando em ${port}`))
