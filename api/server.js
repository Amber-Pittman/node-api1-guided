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

// Dog.findById(id)
//         .then(dogs => {
//             console.log(dogs.id)
//             res.status(200).json({
//                     message: "getting by ID",
//                     dogs
//                 })
//         })
//         .catch(err => {
//             res.status(500).json({
//                 message: err.message
//             })
//         })

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

// [PUT] /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)

// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)

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