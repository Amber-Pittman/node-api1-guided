const shortid = require('shortid') // The shortid library is used for generating very unique IDs

// single table in this fake db
// dogs table
// the dog is the ID, whereas everything after are just attrs for the dog
let dogs = [
  { id: shortid.generate(), name: 'Captain', weight: 25, adopter_id: null }, // row or record
  { id: shortid.generate(), name: 'Doggo', weight: 13, adopter_id: null }, // row or record
]

// THIS IS OPTIONAL TO WRITE; FOR INSTRUCTIONAL PURPOSES TO COINCIDE WITH THE DOGS TABLE
//adopters table
let adopters = [
  { id: shortid.generate(), name: "Pedro", dog_id: null }, // row or record
  { id: shortid.generate(), name: "Amber", dog_id: null }, // row or record
]

module.exports = {
  findAll() {
    // SELECT * FROM dogs;
    return Promise.resolve(dogs)
  },

  findById(id) {
    // SELECT * FROM dogs WHERE id = 1;
    const dog = dogs.find(d => d.id === id)
    return Promise.resolve(dog)
  },

  create({ name, weight }) {
    // INSERT INTO dogs (id, name, weight, adopter_id) VALUES ('xyz', 'Foo', 10, NULL);
    const newDog = { id: shortid.generate(), name, weight, adopter_id: null }
    dogs.push(newDog)
    return Promise.resolve(newDog)
  },

  update(id, changes) {
    // UPDATE dogs SET name = 'Foo', weight = 9, adopter_id = 'abc' WHERE id = 1;
    const dog = dogs.find(dog => dog.id === id)
    if (!dog) return Promise.resolve(null)

    const updatedDog = { ...changes, id }
    dogs = dogs.map(d => (d.id === id) ? updatedDog : d)
    return Promise.resolve(updatedDog)
  },

  delete(id) {
    // DELETE FROM dogs WHERE id = 1;
    const dog = dogs.find(dog => dog.id === id)
    if (!dog) return Promise.resolve(null)

    dogs = dogs.filter(d => d.id !== id)
    return Promise.resolve(dog)
  }
}
