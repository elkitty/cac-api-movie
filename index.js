const express = require("express");
const app = express();

const path = require("path");

app.get("/", (req, res) => {
  res.send("Hola desde Express!!!");
});

app.use(express.static(path.join(__dirname, "public")));

app.use(express.static('public'))





app.get("/factura", (req, res) => {
  // Login
  res.sendFile(path.join(__dirname, "private", "factura.html"));
});

app.get("/frutas", (req, res) => {
  console.log(req.query);
  res.sendFile(path.join(__dirname, "frutas.json"));
});

app.get("/productos/:id", (req, res) => {
  console.log(req.params.id);
  res.send("Producto: " + req.params.id);
});

const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
