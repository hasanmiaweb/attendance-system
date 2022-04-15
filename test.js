const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/test',{
    serverSelectionTimeoutMS:1000,
}).then(async()=>{
    console.log('Database  Connected');
    await createUser({name:"Hasan", email:"hasan@gmail.com"})
    await createUser({name:"Test", email:"test@gmail.com"});
    mongoose.connection.close(true)
}).catch((e) => {
    console.log(e);
})


const Schema = new mongoose.Schema({
    name:String,
    email:String
})

const User = mongoose.model('User', Schema);

async function createUser(data){
    const user = await new User({...data});
    await user.save()
    return user
}