import express, { request } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT

})
db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email=req.body.username;
  const password=req.body.password;
try{
  const checkResult=await db.query("select * from users where email=$1",[email]);
 if(checkResult.rows.length>0){
  res.send("User already exists.Try loggin in");
 }else{
  const result = await db.query("insert into users (email,password) values ($1,$2)",[email,password]);
  console.log(result);
  res.render("secrets.ejs");

 }
}
 catch(err){
  console.log(err);
}

});

app.post("/login", async (req, res) => {
  const email=req.body.username;
  const password=req.body.password;
  try{
    const result=await db.query("select * from users where email=$1 ",[email]);
    if(result.rows.length>0){
      const user = result.rows[0];
      console.log(user);
      const storedPassword = user.password;
      if(storedPassword===password){
        res.render("secrets.ejs");
      }else{
        res.send("Invalid Password");
      }
    }else{
      res.send("User does not exist");
    }
  }
  catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
