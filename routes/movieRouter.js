const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

router.get("/", movieController.getAllMovies);
router.get("/:id", movieController.getMovieById);
router.post("/", movieController.createMovie);
router.put("/:id", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);
router.get("/:id/genres", movieController.getMovieGenresById);
router.get("/:id/actors", movieController.getMovieActorsById);

module.exports = router;
