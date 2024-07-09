// src/app.js
const express = require("express");
const moviesRouter = require("./routes/movieRouter");
const authRouter = require("./routes/authRouter");

require("dotenv").config();

const app = express();

// Middleware para parsear el cuerpo de las peticiones como JSON
app.use(express.json());

app.use("/auth", authRouter);
// Usa el router de películas en la ruta /movies
app.use("/movies", moviesRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
