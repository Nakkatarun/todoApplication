const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
module.exports = app;

app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// 1. GET API

// status

app.get("/todos/", async (request, response) => {
  const { status } = request.query;

  const query = `
    SELECT * 
    FROM 
    todo 
    WHERE 
    status LIKE "%${status}%";`;

  const res = await db.all(query);
  response.send(res);
});

// priority
app.get("/todos/", async (request, response) => {
  const { priority } = request.query;

  const query = `
    SELECT * 
    FROM 
    todo 
    WHERE 
    priority LIKE "%${priority}%";`;

  const res = await db.all(query);
  response.send(res);
});

// priority & status
app.get("/todos/", async (request, response) => {
  const { priority, status } = request.query;

  const query = `
    SELECT * 
    FROM 
    todo 
    WHERE 
    priority LIKE "%${priority}%" AND status LIKE "${status}";`;

  const res = await db.get(query);
  response.send(res);
});

// search_q

app.get("/todos/", (request, response) => {
  const { search_q } = request.query;
  console.log(search_q);
});

// 2. GET BY TODOS ID

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query = `
    SELECT * 
    FROM todo 
    WHERE 
    id = ${todoId};`;
  const res = await db.get(query);
  response.send(res);
});

// POST
app.post("/todos/", async (request, response) => {
  const details = request.body;
  const { id, todo, priority, status } = details;
  const query = `
    INSERT INTO 
    todo(id, todo, priority, status)
    VALUES (
        ${id},
        "${todo}",
        "${priority}",
        "${status}"
    );`;
  await db.run(query);
  response.send("Todo Successfully Added");
});

// PUT
//status
app.put("/todos/:todoId/", async (request, response) => {
  const details = request.body;
  const { todoId } = request.params;
  const { status } = details;

  const query = `
    UPDATE
       Todo 
    SET 
       status = "${status}"
    WHERE 
       id = ${todoId};`;
  await db.run(query);
  response.send("Status Updated");
});

//priority
app.put("/todos/:todoId/", async (request, response) => {
  const details = request.body;
  const { todoId } = request.params;
  const { priority } = details;

  const query = `
    UPDATE
       Todo 
    SET 
       priority = "${priority}"
    WHERE 
       id = ${todoId};`;
  await db.run(query);
  response.send("Priority Updated");
});

// DELETE
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query = `
    DELETE FROM 
    Todo 
    WHERE 
    id = ${todoId};`;
  await db.run(query);
  response.send("Todo Deleted");
});
