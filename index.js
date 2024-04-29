const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(express.json());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "harrypotter",
    password: "ds564",
    port: 5432,
});

app.get("/", async (req, res) => {
    res.status(200).send({ mensagem: "Servidor backend rodando com sucesso🚀" });
});

app.get("/wizard", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM wizard");
        res.status(200).send({
            total: rows.length,
            magos: rows,
        });
    }
    catch (error) {
        console.error("Erro ao buscar magos", error);
        res.status(500).send("Erro ao buscar magos");
    }
});

app.post("/wizard", async (req, res) => {
    const { name, age, house, special_ability, blood_status, patronus, wand_id } = req.body;
  
    try {
        const house = verificaHouse(req.body.house);
        const blood_status = verificaBloodStatus(req.body.blood_status);

      const result = await pool.query(
        'INSERT INTO wizard (name, age, house, special_ability, blood_status, patronus, wand_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, age, house, special_ability, blood_status, patronus, wand_id]
      );
  
      res.status(201).json({
        message: 'Bruxo inserido com sucesso',
        bruxo: result.rows[0],
      });
    } catch (err) {
      console.error('Erro ao inserir novo bruxo:', err);
      res.status(500).send('Erro ao inserir novo bruxo');
    }
  });


app.put("/wizard/:id", async (req, res) => {
        const { id } = req.params;
        const { name, age, special_ability, patronus, wand_id } = req.body;
        const house = verificaHouse(req.body.house);
        const blood_status = verificaBloodStatus(req.body.blood_status);
      
        try {
          const result = await pool.query(
            'UPDATE wizard SET name = $1, age = $2, house = $3, special_ability = $4, blood_status = $5, patronus = $6, wand_id = $7 WHERE id = $8 RETURNING *',
            [name, age, house, special_ability, blood_status, patronus, wand_id, id]
          );
      
          res.status(200).json({
            message: 'Bruxo atualizado com sucesso',
            bruxo: result.rows[0],
          });
        } catch (err) {
          console.error('Erro ao atualizar bruxo:', err);
          res.status(500).send('Erro ao atualizar bruxo');
        }
});

app.delete("/wizard/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM wizard WHERE id = $1', [id]);
  
      if (result.rowCount === 0) {
        res.status(404).send('Bruxo não encontrado');
        return;
      }
  
      res.status(200).send('Bruxo excluído com sucesso');
    } catch (err) {
      console.error('Erro ao excluir bruxo:', err);
      res.status(500).send('Erro ao excluir bruxo');
    }
  });

app.get("/wand", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM wand");
        res.status(200).send({
            total: rows.length,
            varinhas: rows,
        });
    }
    catch (error) {
        console.error("Erro ao buscar varinhas", error);
        res.status(500).send("Erro ao buscar varinhas");
    }
});

app.post("/wand", async (req, res) => {
    const { date_of_creation, core, length } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO wand (date_of_creation, core, length) VALUES ($1, $2, $3) RETURNING *',
        [date_of_creation, core, length]
      );
  
      res.status(201).json({
        message: 'Varinha inserida com sucesso',
        varinha: result.rows[0],
      });
    } catch (err) {
      console.error('Erro ao inserir nova varinha:', err);
      res.status(500).send('Erro ao inserir nova varinha');
    }
  });

app.put("/wand/:id", async (req, res) => {
    const { id } = req.params;
    const { date_of_creation, core, length } = req.body;
  
    try {
      const result = await pool.query(
        'UPDATE wand SET date_of_creation = $1, core = $2, length = $3 WHERE id = $4 RETURNING *',
        [date_of_creation, core, length, id]
      );
  
      res.status(200).json({
        message: 'Varinha atualizada com sucesso',
        varinha: result.rows[0],
      });
    } catch (err) {
      console.error('Erro ao atualizar varinha:', err);
      res.status(500).send('Erro ao atualizar varinha');
    }
});

app.delete("/wand/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM wand WHERE id = $1', [id]);
  
      if (result.rowCount === 0) {
        res.status(404).send('Varinha não encontrada');
        return;
      }
  
      res.status(200).send('Varinha excluída com sucesso');
    } catch (err) {
      console.error('Erro ao excluir varinha:', err);
      res.status(500).send('Erro ao excluir varinha');
    }
  });
  
app.get('/wizardmorewand', async (req, res) => {
  
    try {
      const { rows } = await pool.query(
        'SELECT w.*, b.* FROM wand w INNER JOIN wizard b ON w.id = b.wand_id'
      );
  
      if (rows.length === 0) {
        res.status(404).send('Bruxos e varinhas não encontrados');
        return;
      }
  
      res.status(200).send({
        bruxo: rows,  
      });
    } catch (err) {
      console.error('Erro ao buscar bruxo e varinha:', err);
      res.status(500).send('Erro ao buscar bruxo e varinha');
    }
  });


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} 🚀🚀`);
});

const verificaHouse = (house) => {
    if (house === "Gryffindor" || house === "Slytherin" || house === "Ravenclaw" || house === "Hufflepuff") {
        return house;
    } else {
        return null;
    }
};

const verificaBloodStatus = (blood_status) => {
    if (blood_status === "Half-blood" || blood_status === "Muggle-born" || blood_status === "Pure-blood") {
        return blood_status;
    } else {
        return null;
    }
};
