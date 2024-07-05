const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../movies.json");

// Función para leer el archivo JSON
const readMoviesFromFile = () => {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

// Función para escribir en el archivo JSON
const writeMoviesToFile = (movies) => {
  fs.writeFileSync(filePath, JSON.stringify(movies, null, 2));
};

// Ruta para obtener todas las películas
router.get("/", (req, res) => {
  try {
    const movies = readMoviesFromFile();
    res.json(movies);
  } catch (err) {
    console.error("Error al leer el archivo:", err);
    res.status(500).send("Error al leer el archivo");
  }
});

// Ruta para obtener una película por su ID
router.get("/:id", (req, res) => {
  try {
    const movies = readMoviesFromFile();
    const movieId = parseInt(req.params.id);
    const movie = movies.find((m) => m.id === movieId);

    if (!movie) {
      return res.status(404).send("Película no encontrada");
    }

    res.json(movie);
  } catch (err) {
    console.error("Error al leer el archivo:", err);
    res.status(500).send("Error al leer el archivo");
  }
});

// Ruta para agregar una nueva película
router.post("/", (req, res) => {
  try {
    const movies = readMoviesFromFile();
    const newMovie = {
      id: movies.length + 1, // Genera un nuevo ID incrementando el tamaño del array
      titulo: req.body.titulo,
      resumen: req.body.resumen,
    };
    movies.push(newMovie);
    writeMoviesToFile(movies);
    res.status(201).json(newMovie); // Responde con la nueva película y el código de estado 201 (Created)
  } catch (err) {
    console.error("Error al escribir en el archivo:", err);
    res.status(500).send("Error al escribir en el archivo");
  }
});

// Ruta actualizar una película por ID
router.put("/:id", (req, res) => {
  try {
    const movies = readMoviesFromFile();
    const movieId = parseInt(req.params.id);
    const movie = movies.find((m) => m.id === movieId);
    if (!movie) {
      return res.status(404).send("movie not found");
    }
    // Actualiza los campos de la película con los valores proporcionados en la solicitud
    movie.titulo = req.body.titulo || movie.titulo;
    movie.posterPath = req.body.posterPath || movie.posterPath;
    movie.resumen = req.body.resumen || movie.resumen;

    // Escribe el array actualizado de películas en el archivo
    //movies.push(movie);
    writeMoviesToFile(movies);
    res.status(200).json(movie); // Responde con la película actualizada y el código de estado 200 (OK)
  } catch (err) {
    console.error("Error al escribir en el archivo:", err);
    res.status(500).send("Error al escribir en el archivo");
  }
});

// Ruta para borrar una película por ID
router.delete("/:id", (req, res) => {
    try {
      const movies = readMoviesFromFile();
      const movieId = parseInt(req.params.id);
      const movieIndex = movies.findIndex((m) => m.id === movieId);
  
      if (movieIndex === -1) {
        return res.status(404).send("Película no encontrada");
      }
  
      const deletedMovie = movies.splice(movieIndex, 1)[0];
      writeMoviesToFile(movies);
      res.status(200).json(deletedMovie);
    } catch (err) {
      console.error("Error al escribir en el archivo:", err);
      res.status(500).send("Error al escribir en el archivo");
    }
  });

module.exports = router;
