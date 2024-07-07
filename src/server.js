// src/app.js
const express = require("express");
const moviesRouter = require("../routes/movieRouter");

require("dotenv").config();

const app = express();

// Middleware para parsear el cuerpo de las peticiones como JSON
app.use(express.json());
// Usa el router de películas en la ruta /movies
app.use("/movies", moviesRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
