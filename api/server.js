// IMPORTS AT THE TOP
// IMPORTS AT THE TOP
// IMPORTS AT THE TOP
const express = require("express")

const Dog = require("./dog-model.js")
//const { findAll, findById } = require("./dog-model") 
// For this project, calling the entire model is better than listing each thing... Only list individual parts if you don't need all of them

// INSTANCE OF EXPRESS APP
// INSTANCE OF EXPRESS APP
// INSTANCE OF EXPRESS APP
const server = express()


// GLOBAL MIDDLEWARE
// GLOBAL MIDDLEWARE
// GLOBAL MIDDLEWARE
server.use(express.json()) // reads the payload of a request; teaches express to parse the bodies of reqs as JSON

// ENDPOINTS
// ENDPOINTS
// ENDPOINTS


// ***** NEED TO PUT THE CATCH ALL AT THE END TO PREVENT BLOCKAGE TO THE REAL PATHS *****
// // [GET] / (Hello World endpoint)
// // "CATCH ALL" 
// server.use("*", (req, res) => {
//     // here we do whatever with the request from the client
//     res.status(200).json({
//         message: "it's all good, man"
//     })
// })

// [GET] /api/dogs/:id (R of CRUD, fetch dog by :id)
server.get("/api/dogs/:id", (req, res) => {
    // ? where is the ID param coming from?
    const id = req.params.id // this id matches in with the url id -- :id
    //res.json(`you requested the data of dog id ${id}`)
    Dog.findById(id)
        .then(dog => {
            console.log("we are getting --->", dog)
            if (!dog) {
                res.status(404).json({
                    message: `Dog with id ${id} not in the database`
                })
            } else {
                res.json(dog)
            }            
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
})


// [GET] /api/dogs (R of CRUD, fetch all dogs)
server.get("/api/dogs", (req, res) => {
    // CAREFUL NEVER TO RESPOND MORE THAN ONCE ---> ERROR
    // res.status(200).json(`it works!!!!!!!`)
    Dog.findAll()
        .then(dogs => {
            console.log(dogs)
            res.status(200).json({
                message: "YAY",
                dogs
            })
        })
        .catch(err => {
            res.status(500).json({ message: err.message})
        })
})


// [POST] /api/dogs (C of CRUD, create new dog from JSON payload)
server.post("/api/dogs", (req, res) => {
    //payload ** pull any info you need from req
    const newDog = req.body
    //console.log(newDog)
    if(!newDog.name || !newDog.weight) { // validate req things if needed
        // send an appropriate response BUT ONLY ONCE
        res.status(422).json({
            message: "name and weight are required"
        })
    } else {
        Dog.create(newDog)
            .then(dog => {
                // send an appropriate response BUT ONLY ONCE
                //throw new Error("you done messed up A-A-Ron!")
                console.log(dog)
                res.status(201).json(dog)
            })
            .catch(err => {
                // send an appropriate response BUT ONLY ONCE
                res.status(500).json({ message: err.message})
            })
    }
})


// [PUT] /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
server.put("/api/dogs/:id", async (req, res) => {
    // destructure the id
    const { id } = req.params
    const changes = req.body

    try {
        if(!changes.name || !changes.weight) { 
            res.status(422).json({
                message: "name and weight are required"
            })
        } else {
            const updatedDog = await Dog.update(id, changes)
            console.log("Updated Dog: ", updatedDog)
            
            if (!updatedDog) {
                res.status(404).json({
                    message: "that dog does not exist in the database"
                })
            } else {
                res.status(200).json(updatedDog)
            }
        }
    } catch(err) {
        res.status(500).json({ message: err.message})
    }
})

/* HOW DO WE CONSTRUCT A PUT REQUEST??? 
1. Get the ID of the Dog
2. Add the ID to the end of the URL
    * For example: http://localhost:9000/api/dogs/q7Znk1llf
3. In the PUT request, switch to BODY
    * RAW
    * JSON
4. Add the params required (in our case, name and weight)
    * Name is customary with PUT requests
*/

// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)

server.delete("/api/dogs/:id", async (req, res) => {
    try {
        //throw new Error("Something died trying to delete")
        const deleted = await Dog.delete(req.params.id) // without req.params.id, it will be buggy because you need an id to delete the object
        if(!deleted) {
            res.status(404).json({
                message: "that dog does not exist in the database"
            })
        } else {
            res.status(204).json(deleted)
        }
    } catch(err) {
        res.status(500).json({ message: err.message})
    }
})

// // [GET] / (Hello World endpoint)
// // "CATCH ALL" 
server.use("*", (req, res) => {
    // here we do whatever with the request from the client
    res.status(404).json({
        message: "resource not found in this server"
    })
})

// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server