const express = require("express");
const db = require("./dbconnection.js");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin");
  res.header(
    "Access-Control-Methods",
    "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});
app.use(cors());
app.get("/", (req, res) => {
  res.send("Backend is working fine");
});


app.get("/mobiles", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM mob`);

    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/mobiles/brand/:brand", async (req, res) => {
  try {
    const Brand = req.params.brand;

    const sql = `SELECT * FROM mob WHERE "brand" = $1`;
    
    const value = [Brand];

    const result = await db.query(sql, value);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `No mobiles found with brand ${Brand}` });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/mobiles/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const sql = `SELECT * FROM mob WHERE "id" = $1`;
    
    const value = [id];

    const result = await db.query(sql, value);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `No mobiles found with id ${id}` });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/mobiles/ram/:ram", async (req, res) => {
  try {
    const Ram = req.params.ram;

    const sql = `SELECT * FROM mob WHERE "ram" = $1`;
    
    const value = [Ram];

    const result = await db.query(sql, value);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `No mobiles found with ram ${Ram}` });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/mobiles/rom/:rom", async (req, res) => {
  try {
    const Rom = req.params.rom;

    const sql = `SELECT * FROM mob WHERE "rom" = $1`;
    
    const value = [Rom];

    const result = await db.query(sql, value);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `No mobiles found with rom ${Ram}` });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/mobiles/os/:os", async (req, res) => {
  try {
    const Os = req.params.os;

    const sql = `SELECT * FROM mob WHERE "os" = $1`;
    
    const value = [Os];

    const result = await db.query(sql, value);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `No mobiles found with os ${Ram}` });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.put("/mobiles/:id", async (req, res) => {
  try {
    const id = +req.params.id;
    const { name, price,brand,ram,rom,os } = req.body;

    const sql = `
      UPDATE mob
      SET
        name = $1,
        price= $2,
        brand = $3,
        ram = $4,
        rom = $5,
        os = $6
      WHERE "id" = $7
    `;

    const values = [name,price,brand,ram,rom,os,id];

    await db.query(sql, values);

    res.json({ message: `Mobile with id ${id} updated` });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/mobiles", async (req, res) => {
  try {
    const { name, price,brand,ram,rom,os } = req.body;


    const insertQuery = `
      INSERT INTO mob ( name, price,brand,ram,rom,os)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const values = [ name, price,brand,ram,rom,os];

    await db.query(insertQuery, values);

    res.json({ message: `New mobile created` });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/mobile/resetData", async (req, res) => {
  try {
    await db.query("TRUNCATE table mob");

    let { mobiles } = require("./testData");
    let values = mobiles.map((p) => [
      p.name,
      p.price,
      p.brand,
      p.RAM,
      p.ROM,
      p.OS,
    ]);

    const placeholders = values.map(
      (_, index) =>
        `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${
          index * 6 + 4
        }, $${index * 6 + 5}, $${index * 6 + 6})`
    );
    const sql = `
    INSERT INTO mob ( name, price,brand,ram,rom,os) 
      VALUES 
        ${placeholders.join(", ")}
    `;

    const flattenedValues = [].concat(...values);
    await db.query(sql, flattenedValues);

    res.json({ message: `Data reset ${values.length} rows inserted` });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/mobile/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const checkExistingQuery = 'SELECT * FROM mob WHERE "id" = $1';
    const existingMob = await db.query(checkExistingQuery, [id]);

    if (existingMob.rowCount === 0) {
      return res
        .status(404)
        .json({ error: `Mobile with id ${id} not found` });
    }

    const deleteQuery = 'DELETE FROM mob WHERE "id" = $1';
    await db.query(deleteQuery, [id]);

    res.json({ message: `Mobile with id ${id} deleted` });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const port = process.env.PORT || 2410;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
