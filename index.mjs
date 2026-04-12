import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
//for Express to get values using the POST method
app.use(express.urlencoded({extended:true}));
//setting up database connection pool, replace values in red
const pool = mysql.createPool({
    host: "zy4wtsaw3sjejnud.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "lgrsjoyevw4f7rjp",
    connectionLimit: 10,
    waitForConnections: true
});
//routes
app.get('/', async (req, res) => {
    let sql = `SELECT authorId, firstName, lastName
                FROM authors
                ORDER BY lastName`;
    let sql2 = `SELECT DISTINCT category FROM quotes ORDER BY category`;
    const [authors] = await pool.query(sql);
    const [category] = await pool.query(sql2);
   res.render('home.ejs', {authors, category});
});

app.get('/searchByAuthor', async (req, res) => {
    let authorId = req.query.authorId;
    let sql = `SELECT quote, authors.authorId, firstName, lastName 
               FROM quotes
               NATURAL JOIN authors
               WHERE authorId = ?`;
    let sqlParams = [authorId];
    const [rows] = await pool.query(sql, sqlParams);
   res.render('quotes.ejs', {rows});
});

app.get('/searchByCategory', async (req, res) => {
    let category = req.query.category;
    let sql = `SELECT quote, authors.authorId, firstName, lastName
               FROM quotes 
               NATURAL JOIN authors
               WHERE category = ?`;
    let sqlParams = [category];
    const [rows] = await pool.query(sql, sqlParams);
   res.render('quotes.ejs', {rows});
});

//Seraching quotes by keyword
//NEVER have user input within the SQL statement!!
app.get("/searchByKeyword", async(req, res) => {
   try {
        let keyword = req.query.Keyword;
    let sql = `SELECT quote, authors.authorId, firstName, lastName 
                    FROM quotes
                    NATURAL JOIN authors
                    WHERE quote LIKE ? `;
        let sqlParams = [`%${keyword}%`];
        const [rows] = await pool.query(sql, sqlParams);
        res.render("quotes.ejs", {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//

app.get("/searchByMostLikes", async(req, res) => {
   try {
        // let keyword = req.query.Keyword;
    let sql = `SELECT quote, authors.authorId, firstName, lastName 
                    FROM quotes
                    NATURAL JOIN authors 
                    ORDER BY likes DESC`;

        const [rows] = await pool.query(sql);
        res.render("quotes.ejs", {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//

app.get("/searchByLeastLikes", async(req, res) => {
   try {
    let sql = `SELECT quote, authors.authorId, firstName, lastName 
                    FROM quotes
                    NATURAL JOIN authors 
                    ORDER BY likes`;
        const [rows] = await pool.query(sql);
        res.render("quotes.ejs", {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest
app.listen(3000, ()=>{
    console.log("Express server running")
})

//API to get author information based on an author id
app.get('/api/author/:authorId', async (req, res) => {
    let authorId = req.params.authorId;
    let sql = `SELECT *
                FROM authors
                WHERE authorId = ?`;
    const [authorInfo] = await pool.query(sql, [authorId]);
   res.send(authorInfo);// displays info in JSON format
});