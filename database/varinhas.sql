CREATE TABLE wand (
    id SERIAL PRIMARY KEY,
    length INT NOT NULL,
    core VARCHAR(255) NOT NULL,
    date_of_creation DATE NOT NULL
);

INSERT INTO wand (length, core, date_of_creation) VALUES (11, 'Phoenix feather', '1991-07-31');