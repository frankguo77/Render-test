const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
 
console.log('connect to', url) 
mongoose.connect(url)
.then(result => {
    console.log('connected to MongDB')
})
.catch(error => {
    console.log('error connecting to MongoDB', error.message)
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique:true
  },
  number: {
    type: String,
    //minLength: 8,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{2, 3}-\d+/.test(v)
      },
      messgage: props => `${props.value} is not a valid phone number!`
    }
  }
})

personSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})


module.exports = mongoose.model('Person', personSchema)
