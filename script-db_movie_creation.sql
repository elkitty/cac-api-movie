-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS db_movies;
USE db_movies;

-- Crear tablas
CREATE TABLE IF NOT EXISTS Directors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    birthdate DATE
);

CREATE TABLE IF NOT EXISTS Genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Actors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    birthdate DATE
);

CREATE TABLE IF NOT EXISTS Movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_date DATE,
    rating DECIMAL(3, 1),
    poster_path VARCHAR(255),
    director_id INT,
    genre_id INT,
    actor_id INT,
    FOREIGN KEY (director_id) REFERENCES Directors(id) ON DELETE SET NULL,
    FOREIGN KEY (genre_id) REFERENCES Genres(id) ON DELETE SET NULL,
    FOREIGN KEY (actor_id) REFERENCES Actors(id) ON DELETE SET NULL
);

-- Insertar datos en la tabla Directors
INSERT INTO Directors (name, birthdate) VALUES
('Francis Ford Coppola', '1939-04-07'),
('Frank Darabont', '1959-01-28'),
('Steven Spielberg', '1946-12-18'),
('Martin Scorsese', '1942-11-17'),
('Michael Curtiz', '1886-12-24'),
('Orson Welles', '1915-05-06'),
('Victor Fleming', '1889-02-23'),
('Milos Forman', '1932-02-18'),
('David Lean', '1908-03-25'),
('Alfred Hitchcock', '1899-08-13'),
('Robert Wise', '1914-09-10'),
('William Wyler', '1902-07-01'),
('Billy Wilder', '1906-06-22'),
('Robert Zemeckis', '1951-05-14'),
('Sidney Lumet', '1924-06-25'),
('Jerome Robbins', '1918-10-11');

-- Insertar datos en la tabla Genres
INSERT INTO Genres (name) VALUES
('Drama'),
('Crime'),
('Biography'),
('Action'),
('Comedy'),
('Romance'),
('Adventure'),
('Musical'),
('Mystery'),
('Thriller');

-- Insertar datos en la tabla Actors
INSERT INTO Actors (name, birthdate) VALUES
('Marlon Brando', '1924-04-03'),
('Al Pacino', '1940-04-25'),
('Morgan Freeman', '1937-06-01'),
('Robert De Niro', '1943-08-17'),
('Humphrey Bogart', '1899-12-25'),
('Ingrid Bergman', '1915-08-29'),
('Orson Welles', '1915-05-06'),
('Clark Gable', '1901-02-01'),
('Judy Garland', '1922-06-10'),
('Jack Nicholson', '1937-04-22'),
('Peter O\'Toole', '1932-08-02'),
('James Stewart', '1908-05-20'),
('Gene Kelly', '1912-08-23'),
('Tom Hanks', '1956-07-09'),
('Henry Fonda', '1905-05-16'),
('Anthony Perkins', '1932-04-04'),
('Julie Andrews', '1935-10-01'),
('Alec Guinness', '1914-04-02'),
('Natalie Wood', '1938-07-20'),
('Vivien Leigh', '1913-11-05'),
('Charlton Heston', '1923-10-04');

-- Insertar datos en la tabla Movies
INSERT INTO Movies (title, release_date, rating, poster_path, director_id, genre_id, actor_id) VALUES
('The Godfather', '1972-03-24', 9.2, 'godfather.jpg', 1, 2, 1),
('The Shawshank Redemption', '1994-09-22', 9.3, 'shawshank.jpg', 2, 1, 3),
('Schindler\'s List', '1993-12-15', 8.9, 'schindler.jpg', 3, 3, 4),
('Raging Bull', '1980-11-14', 8.2, 'raging_bull.jpg', 4, 1, 4),
('Casablanca', '1942-11-26', 8.5, 'casablanca.jpg', 5, 1, 5),
('Citizen Kane', '1941-05-01', 8.3, 'citizen_kane.jpg', 6, 1, 7),
('Gone with the Wind', '1939-12-15', 8.1, 'gone_with_the_wind.jpg', 7, 1, 21),
('The Wizard of Oz', '1939-08-25', 8.0, 'wizard_of_oz.jpg', 7, 7, 9),
('One Flew Over the Cuckoo\'s Nest', '1975-11-19', 8.7, 'cuckoos_nest.jpg', 8, 1, 10),
('Lawrence of Arabia', '1962-12-11', 8.3, 'lawrence.jpg', 9, 7, 11),
('Vertigo', '1958-05-09', 8.3, 'vertigo.jpg', 10, 9, 16),
('Psycho', '1960-09-08', 8.5, 'psycho.jpg', 10, 10, 16),
('The Sound of Music', '1965-03-02', 8.0, 'sound_of_music.jpg', 11, 1, 17),
('The Bridge on the River Kwai', '1957-10-02', 8.2, 'river_kwai.jpg', 9, 7, 18),
('Singin\' in the Rain', '1952-04-11', 8.3, 'singin_in_the_rain.jpg', 12, 8, 13),
('It\'s a Wonderful Life', '1946-12-20', 8.6, 'wonderful_life.jpg', 13, 1, 12),
('Sunset Boulevard', '1950-08-10', 8.4, 'sunset_boulevard.jpg', 13, 1, 6),
('Forrest Gump', '1994-07-06', 8.8, 'forrest_gump.jpg', 14, 1, 14),
('12 Angry Men', '1957-04-10', 8.9, '12_angry_men.jpg', 15, 1, 15),
('West Side Story', '1961-10-18', 7.5, 'west_side_story.jpg', 16, 6, 19);
