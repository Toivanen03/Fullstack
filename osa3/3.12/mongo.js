const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', contactSchema)

const password = process.argv[2]
const url =
    `mongodb+srv://simotoivanen:${password}@cluster0.nnfum.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)
.then(() => {
    let name;
    let number;
    if (process.argv.length === 2) {
        console.log('Give password as argument to retrieve list of contacts')
        process.exit(1)
    } else if (process.argv.length === 3) {
        console.log("Phonebook:")
        Person.find({})
        .then(result => {
            result.forEach(result => {
                console.log(result.name, result.number);
            });
            mongoose.connection.close();
        })
        .catch(err => {
            console.error("Error retrieving contacts:", err);
            mongoose.connection.close();
        })
    } else if (process.argv.length === 4) {
        console.log("Give number as argument")
        mongoose.connection.close()
    } else if (process.argv.length === 5) {
        name = process.argv[3]
        number = process.argv[4]
    } else if (process.argv.length === 6) {
        name = process.argv[3] + " " + process.argv[4]
        number = process.argv[5]
    }
    if (name && number) {
        const person = new Person({
            name: name,
            number: number,
        })

        person.save()
            .then(result => {
                console.log('Contact saved!')
                mongoose.connection.close()
        })
    } else if (process.argv.length > 6) {
        console.log("Enter password, name and number as arguments to add a new contact")
        process.exit(1)
    }
})