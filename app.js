/* eslint-disable no-unused-vars */
const { request, response} = require('express')
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require("path");
const { Todo } = require("./models")

app.use(bodyParser.json());

app.set("view engine","ejs");

app.get("/", async (request, response) => {
    const allTodos = await Todo.getTodos();
    if ( request.accepts("html")){
        response.render('index',{
            allTodos
        });
     } else{
response.json({
    allTodos
})
        }

});

app.use(express.static(path.join(__dirname, 'public')));

app.get("/todos",(request, response) => {
    console.log("Todo List", request.body);
});

app.post("/todos", async (request, response) => {
    console.log("Creating a todo", request.body)

    try{
        const todo = await Todo.addTodo({title: request.body.title, dueDate: request.body.dueDate, completed: false})
        return response.json(todo)
    } catch (error) {
        console.log(error)
        return response.status(422).json(error)

    }
    
})

app.put("/todos/:id/markAsCompleted", async (request, response) => {
    console.log("we have to update a todo with ID:",request.params.id)
    const todo = await Todo.findPk(request.params.id)
    try{
        const updatedTodo = await todo.markAsCompleted()
        return response.json(updatedTodo)
    }
    catch (error){
        console.log(error)
        return response.status(422).json(error)

    }
})

app.delete("/todos/:id",(request, response) => {
    console.log("Delete a todo by ID:",request.params.id)
})

module.exports = app;
