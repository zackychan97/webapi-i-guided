// import express from 'express'; // ES Modules, 
// in Node.js we'll import files using this syntax
const express = require('express'); //CommonJS Modules

const db = require('./data/hubs-model.js'); // 1. import the database file
//this creates our server
const server = express();

server.use(express.json()); // NEEDED to parse JSON from the body

//telling our server we want to handle get requests
//then we tell it, as a string, which url to use get requests for
//then a function that gets the request and response

//always req first and then res. you cant respond if you dont have the request first
server.get('/', (req, res) =>{
    res.send({ api: 'up and running... and changing...' })
})

// I want to see a list of hubs GET /hubs 
server.get('/hubs', (req, res) => {
    //get the list of hubs from the database
    db.find()
        .then(hubs => {
            res.status(200).json(hubs);
        })
        .catch(error => {
            console.log('error on GET /hubs', error);
            res
                .status(500)
                .json( {errorMessage: 'error getting list of hubs from database'})
        })
})

// want a way to add a hub
server.post('/hubs', (req, res) => {
    //get the data the client sent
    const hubData = req.body; // express does not know how to parse JSON, we need to teach it by adding middleware

    //call the database and add the hub
    db.add(hubData)
        .then(hub => {
            res.status(201).json(hub);
    })
    .catch(error => {
        console.log('error on the POST /hubs', error);
        res.status(500).json({ errorMessage: 'error adding the hub' });
    });
});

// way to remove a hub by it's id
server.delete('/hubs/:id', (req, res) => {
    const id = req.params.id;

    db.remove(id)
    .then(removed => {
        if(removed){
            res.status(200).json({ message: 'hubs removed successfully'})
        } else {
            res.status(404).json({ message: 'hubs not found'})

        }

    })
    .catch(error => {
        console.log('error on the delete /hubs/:id', error);
        res.status(500).json({ errorMessage: 'error removing the hub'})
    })
        
})

// way to update a hub, passing the id and the changes

const port = 4000;
server.listen(port, () => 
    console.log(`\n API running on port ${port} and changing and updating \n`)
)