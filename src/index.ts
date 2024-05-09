import express from "express";
// Get the client
import mysql, { ErrorPacketParams, ResultSetHeader } from "mysql2/promise";

// Create the connection to database
const connection = mysql
  .createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "user-auth-demo",
  })
  .then((conn) => {
    console.log("Connected to database");
    return conn;
  });

const app = express();

app.use(express.json());

app.get("/status", (req, res) => {
  res.send("API is Running.");
});

app.post("/register", async (req, res) => {
  console.log("register data", req.body);
  const conn = await connection;
  // TODO: Sanitize and Check the request data
  try {
    const createUserStatement = `INSERT INTO user (name, email, password) VALUES ('${req.body.name}', '${req.body.email}', '${req.body.password}');`;
    console.log("Create User Statement: ", createUserStatement);
    const [QueryResult, _] = await conn.query<ResultSetHeader>(
      createUserStatement
    );
    // TODO: handle the response and error if it fails
    if (QueryResult.affectedRows === 1) {
      res.status(201);
      res.send("User Created Successfully");
    } else {
      res.status(400);
      res.send("Failed to Create User");
    }
  } catch (error) {
      console.error(error);
      const err = error as ErrorPacketParams;
    res.status(400);
    res.send("Failed to Create User. Error: " + err.message);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
