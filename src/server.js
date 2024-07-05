// src/app.js
const express = require("express");
const moviesRouter = require("./routes/movies.router");

const app = express();

// Middleware para parsear el cuerpo de las peticiones como JSON
app.use(express.json());
// Usa el router de películas en la ruta /movies
app.use("/movies", moviesRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
