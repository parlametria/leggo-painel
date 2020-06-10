const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')

const app = express()

app.use(serveStatic(path.join(__dirname, 'dist/leggo-painel')))

app.use(express.static('src'));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'src', 'index.html'));
});

const port = process.env.PORT || 8080

app.listen(port, () => console.log(`Server running on ${port}`))
