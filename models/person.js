const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const databaseUrl = process.env.MONGODB_URI

mongoose
  .connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(result => {
    console.log('Connected')
  })
  .catch(error => {
    console.log('There was an error...', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject._v
  }
})

module.exports = mongoose.model('Person', personSchema)