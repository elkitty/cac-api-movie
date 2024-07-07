const db = require("../db/db");

// Obtener todas las películas
const getAllMovies = (req, res) => {
  const sql = `
    SELECT
      Movies.id AS movie_id,
      Movies.title,
      Movies.release_date,
      Movies.rating,
      Movies.poster_path,
      Directors.name AS director,
      GROUP_CONCAT(DISTINCT Genres.name) AS genres,
      GROUP_CONCAT(DISTINCT Actors.name) AS actors
    FROM Movies
    LEFT JOIN Directors ON Movies.director_id = Directors.id
    LEFT JOIN MovieGenres ON Movies.id = MovieGenres.movie_id
    LEFT JOIN Genres ON MovieGenres.genre_id = Genres.id
    LEFT JOIN MovieActors ON Movies.id = MovieActors.movie_id
    LEFT JOIN Actors ON MovieActors.actor_id = Actors.id
    GROUP BY Movies.id, Directors.name;
  `;

  db.query(sql, (err, results) => {
    if (err) throw err;

    const formattedResults = results.map((movie) => ({
      movie_id: movie.movie_id,
      title: movie.title,
      release_date: movie.release_date,
      rating: movie.rating,
      poster_path: movie.poster_path,
      director: movie.director,
      genres: movie.genres ? movie.genres.split(",") : [],
      actors: movie.actors ? movie.actors.split(",") : [],
    }));

    res.json(formattedResults);
  });
};

// Ruta para obtener una película por su ID
const getMovieById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT
      Movies.id AS movie_id,
      Movies.title,
      Movies.release_date,
      Movies.rating,
      Movies.poster_path,
      Directors.name AS director,
      Genres.name AS genre,
      Actors.name AS actor
    FROM Movies
    LEFT JOIN Directors ON Movies.director_id = Directors.id
    LEFT JOIN MovieGenres ON Movies.id = MovieGenres.movie_id
    LEFT JOIN Genres ON MovieGenres.genre_id = Genres.id
    LEFT JOIN MovieActors ON Movies.id = MovieActors.movie_id
    LEFT JOIN Actors ON MovieActors.actor_id = Actors.id
    WHERE Movies.id = ?;
  `;

  db.query(sql, [id], (err, results) => {
    if (err) throw err;

    console.log("Query Results: ", results); // Log para depuración

    if (results.length === 0) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    const movie = {
      movie_id: results[0].movie_id,
      title: results[0].title,
      release_date: results[0].release_date,
      rating: results[0].rating,
      poster_path: results[0].poster_path,
      director: results[0].director,
      genres: [],
      actors: [],
    };

    results.forEach((row) => {
      if (row.genre && !movie.genres.includes(row.genre)) {
        movie.genres.push(row.genre);
      }
      if (row.actor && !movie.actors.includes(row.actor)) {
        movie.actors.push(row.actor);
      }
    });

    console.log("Formatted Movie: ", movie); // Log para depuración

    res.json(movie);
  });
};

const createMovie = (req, res) => {
  const { title, release_date, rating, poster_path, director, genres, actors } =
    req.body;

  db.beginTransaction((err) => {
    if (err) throw err;

    // Insertar el director si no existe
    const insertDirectorSql = `
      INSERT INTO Directors (name, birthdate)
      VALUES (?, '1970-01-01')
      ON DUPLICATE KEY UPDATE name = VALUES(name);
    `;
    db.query(insertDirectorSql, [director], (err, result) => {
      if (err)
        return db.rollback(() => {
          throw err;
        });

      // Insertar nueva película
      const insertMovieSql = `
        INSERT INTO Movies (title, release_date, rating, poster_path, director_id)
        VALUES (?, ?, ?, ?, (SELECT id FROM Directors WHERE name = ? LIMIT 1));
      `;
      db.query(
        insertMovieSql,
        [title, release_date.split("T")[0], rating, poster_path, director],
        (err, result) => {
          if (err)
            return db.rollback(() => {
              throw err;
            });
          const movieId = result.insertId;

          // Verificar e insertar géneros
          const insertGenreSql = `
            INSERT INTO Genres (name)
            VALUES (?)
            ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);
          `;
          const genreQueries = genres.map(
            (genre) =>
              new Promise((resolve, reject) => {
                db.query(insertGenreSql, [genre], (err, result) => {
                  if (err) return reject(err);

                  const insertMovieGenreSql = `
                    INSERT INTO MovieGenres (movie_id, genre_id)
                    VALUES (?, (SELECT id FROM Genres WHERE name = ? LIMIT 1));
                  `;
                  db.query(
                    insertMovieGenreSql,
                    [movieId, genre],
                    (err, result) => {
                      if (err) return reject(err);
                      resolve(result);
                    }
                  );
                });
              })
          );

          // Verificar e insertar actores
          const insertActorSql = `
            INSERT INTO Actors (name, birthdate)
            VALUES (?, '1970-01-01')
            ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);
          `;
          const actorQueries = actors.map(
            (actor) =>
              new Promise((resolve, reject) => {
                db.query(insertActorSql, [actor], (err, result) => {
                  if (err) return reject(err);

                  const insertMovieActorSql = `
                    INSERT INTO MovieActors (movie_id, actor_id)
                    VALUES (?, (SELECT id FROM Actors WHERE name = ? LIMIT 1));
                  `;
                  db.query(
                    insertMovieActorSql,
                    [movieId, actor],
                    (err, result) => {
                      if (err) return reject(err);
                      resolve(result);
                    }
                  );
                });
              })
          );

          Promise.all([...genreQueries, ...actorQueries])
            .then(() => {
              db.commit((err) => {
                if (err)
                  return db.rollback(() => {
                    throw err;
                  });
                res.status(201).json({
                  message: "Película agregada correctamente",
                  movieId,
                });
              });
            })
            .catch((err) => {
              db.rollback(() => {
                throw err;
              });
            });
        }
      );
    });
  });
};

const updateMovie = (req, res) => {
  const { id } = req.params;
  const { title, release_date, rating, poster_path, director, genres, actors } =
    req.body;

  db.beginTransaction((err) => {
    if (err) throw err;

    // Insertar el director si no existe
    const insertDirectorSql = `
      INSERT INTO Directors (name, birthdate)
      VALUES (?, '1970-01-01')
      ON DUPLICATE KEY UPDATE name = VALUES(name);
    `;
    db.query(insertDirectorSql, [director], (err, result) => {
      if (err)
        return db.rollback(() => {
          throw err;
        });

      // Obtener el director_id
      const getDirectorIdSql = `SELECT id FROM Directors WHERE name = ? LIMIT 1;`;
      db.query(getDirectorIdSql, [director], (err, results) => {
        if (err)
          return db.rollback(() => {
            throw err;
          });

        const directorId = results[0].id;

        // Actualizar la película
        const updateMovieSql = `
          UPDATE Movies
          SET title = ?, release_date = ?, rating = ?, poster_path = ?, director_id = ?
          WHERE id = ?;
        `;
        db.query(
          updateMovieSql,
          [
            title,
            release_date.split("T")[0],
            rating,
            poster_path,
            directorId,
            id,
          ],
          (err, result) => {
            if (err)
              return db.rollback(() => {
                throw err;
              });

            // Eliminar géneros y actores existentes para la película
            const deleteGenresSql = `DELETE FROM MovieGenres WHERE movie_id = ?;`;
            const deleteActorsSql = `DELETE FROM MovieActors WHERE movie_id = ?;`;

            db.query(deleteGenresSql, [id], (err, result) => {
              if (err)
                return db.rollback(() => {
                  throw err;
                });

              db.query(deleteActorsSql, [id], (err, result) => {
                if (err)
                  return db.rollback(() => {
                    throw err;
                  });

                // Insertar géneros actualizados
                const insertGenreSql = `
                  INSERT INTO Genres (name)
                  VALUES (?)
                  ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);
                `;
                const insertMovieGenreSql = `
                  INSERT INTO MovieGenres (movie_id, genre_id)
                  VALUES (?, (SELECT id FROM Genres WHERE name = ? LIMIT 1));
                `;
                const genrePromises = genres.map((genre) => {
                  return new Promise((resolve, reject) => {
                    db.query(insertGenreSql, [genre], (err, result) => {
                      if (err) return reject(err);

                      db.query(
                        insertMovieGenreSql,
                        [id, genre],
                        (err, result) => {
                          if (err) return reject(err);
                          resolve(result);
                        }
                      );
                    });
                  });
                });

                // Insertar actores actualizados
                const insertActorSql = `
                  INSERT INTO Actors (name, birthdate)
                  VALUES (?, '1970-01-01')
                  ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);
                `;
                const insertMovieActorSql = `
                  INSERT INTO MovieActors (movie_id, actor_id)
                  VALUES (?, (SELECT id FROM Actors WHERE name = ? LIMIT 1));
                `;
                const insertActorPromises = actors.map((actor) => {
                  return new Promise((resolve, reject) => {
                    db.query(insertActorSql, [actor], (err, result) => {
                      if (err) return reject(err);

                      db.query(
                        insertMovieActorSql,
                        [id, actor],
                        (err, result) => {
                          if (err) return reject(err);
                          resolve(result);
                        }
                      );
                    });
                  });
                });

                Promise.all([...genrePromises, ...insertActorPromises])
                  .then(() => {
                    db.commit((err) => {
                      if (err)
                        return db.rollback(() => {
                          throw err;
                        });
                      res
                        .status(200)
                        .json({
                          message: "Película actualizada correctamente",
                        });
                    });
                  })
                  .catch((err) => {
                    db.rollback(() => {
                      throw err;
                    });
                  });
              });
            });
          }
        );
      });
    });
  });
};

// Ruta para borrar una película por ID
const deleteMovie = (req, res) => {
  const { id } = req.params;

  db.beginTransaction((err) => {
    if (err) throw err;

    // Eliminar géneros asociados a la película
    const deleteGenresSql = `DELETE FROM MovieGenres WHERE movie_id = ?;`;
    db.query(deleteGenresSql, [id], (err, result) => {
      if (err)
        return db.rollback(() => {
          throw err;
        });

      // Eliminar actores asociados a la película
      const deleteActorsSql = `DELETE FROM MovieActors WHERE movie_id = ?;`;
      db.query(deleteActorsSql, [id], (err, result) => {
        if (err)
          return db.rollback(() => {
            throw err;
          });

        // Eliminar la película
        const deleteMovieSql = `DELETE FROM Movies WHERE id = ?;`;
        db.query(deleteMovieSql, [id], (err, result) => {
          if (err)
            return db.rollback(() => {
              throw err;
            });

          db.commit((err) => {
            if (err)
              return db.rollback(() => {
                throw err;
              });
            res
              .status(200)
              .json({ message: "Película eliminada correctamente" });
          });
        });
      });
    });
  });
};

// Ruta para obtener todos los géneros de una película por su ID
const getMovieGenresById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT Genres.name FROM MovieGenres
    JOIN Genres ON MovieGenres.genre_id = Genres.id
    WHERE MovieGenres.movie_id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

// Ruta para obtener todos los actores de una película por su ID
const getMovieActorsById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT Actors.name FROM MovieActors
    JOIN Actors ON MovieActors.actor_id = Actors.id
    WHERE MovieActors.movie_id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieGenresById,
  getMovieActorsById,
};
