const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shop'
});

app.post('/shop', (req, res) => {
  const sql = "INSERT INTO product (`product_name`, `quantity`, `price`) VALUES (?)";
  const values = [
    req.body.product_name,
    req.body.quantity,
    req.body.price,
  ];

  db.query(sql, [values], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const productId = result.insertId;

    const fetchSql = "SELECT * FROM product WHERE id = ?";
    db.query(fetchSql, [productId], (fetchErr, product) => {
      if (fetchErr) return res.status(500).json({ error: fetchErr.message });

      return res.status(201).json(product[0]); // Return the new product
    });
  });
});

// Handle PUT request to update product
app.put('/shop/:id', (req, res) => {
  const productId = req.params.id;
  const { product_name, quantity, price } = req.body;

  const sql = "UPDATE product SET product_name = ?, quantity = ?, price = ? WHERE id = ?";
  const values = [product_name, quantity, price, productId];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    return res.status(200).json({ message: 'Product updated successfully' });
  });
});

app.listen(8081, () => {
  console.log("listening...."); 
});
