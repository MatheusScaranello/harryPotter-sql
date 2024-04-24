CREATE TABLE wizard (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    house VARCHAR(255) NOT NULL,
    special_ability VARCHAR(255) NOT NULL,
    blood_status VARCHAR(255) NOT NULL,
    patronus VARCHAR(255),
    wand_id INT,
    FOREIGN KEY (wand_id) REFERENCES wand(id)
);

INSERT INTO wizard (name, age, house, special_ability, blood_status, patronus, wand_id) VALUES ('Harry Potter', 11, 'Gryffindor', 'Parseltongue', 'Half-blood', 'Stag', 1);

SELECT * FROM wizard;

SELECT w.*, b.* FROM wand w INNER JOIN wizard b ON w.id = b.wand_id;