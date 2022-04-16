const express = require("express");
const app = express();
const port = 4000;
const connectDB = require("./db");
const User = require("./models/User");
app.use(express.json())
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

app.post('/register', async (req, res, next) => {
  const {name, email, password} = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message:"Something was Wrong"
    })
  }

  try {
    let user = await User.findOne({email:email});

    if (user) {
      return res.status(400).json({
        message:"User already Exist"
      })
    }
  
    user = new User({name, email, password})
  
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);
    user.password = hash
    await user.save()
  
    return res.status(201).json({
      message:"User Created Successfully", user
    })
  } catch (e) {
    next(e)
  }


});

app.post('/login', async (req, res, next) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({email});

    if (!user) {
      return res.status(400).json({
        message:"Invalid credentials"
      })
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(400).json({
        message:"Invalid credentials"
      })
    }
    delete user._doc.password

    const token = jwt.sign(user._doc, 'secret-key', {expiresIn:'2h'})

    return res.status(200).json({
      message:"Login Successfully",token
    })

  } catch (e) {
    next(e)
  }
});   

app.get('/public', (req, res) => {
  res.status(200).json("PUBLIC ROUTE")
});


app.get('/private', async (req, res) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({message:"Unauthorized"})
  }
  
  try {
    token = token.split(' ')[1]
    const decoded = jwt.verify(token, 'secret-key');
    console.log(decoded);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(400).json({message:"Unauthorized"})
    }
    
    return res.status(200).json({
      message:"WELLCOME PRIVATE ROUTER"
    })

  } catch (e) {
    return res.status(400).json({message:"Invalid token"})
  }

});




app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((err, req, res, next)=>{
  console.log(err)
  res.status(500).json({
    message:"Server ERROR"
  })
})


connectDB("mongodb://127.0.0.1:27017/attendance-db")
  .then(() => {
    console.log("Database Connected")
    app.listen(port, () => {
      console.log(`I am listening on port ${port}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
