/////////////////////////////////////////////////////////////
///Setup files and dependancies plus libraries
/////////////////////////////////////////////////////////////
const express = require("express")
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");


const app = express();
const PORT = 8080;

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

/////////////////////////////////////////////////////////////
///OUR URL Temporary Database
/////////////////////////////////////////////////////////////

// const urlDatabase = {
//   b2xVn2: "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com",
// };
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};


/////////////////////////////////////////////////////////////
///OUR URL Temporary USERS Database
/////////////////////////////////////////////////////////////

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur",10)
 
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk",10)
  }
  
};


/////////////////////////////////////////////////////////////
/// Aiding Functions
/////////////////////////////////////////////////////////////
/// Function which generates random Id
function generateRandomString() {
  const randomid = Math.random().toString(36).substring(2, 8); //gets randomly generated 6 characters and assign it to randomID
  return randomid; //
  
};

// Function which returns true if email is registered to users

function getUserByEmail(emailFromPost){
  
  for( let user in users ) {
    if(emailFromPost === users[user]["email"]) {
        return user
    }
  }
  return null;
}
// Function which returns true if email is registered to users

function getUserByEmailByPassword(emailFromPost,passwordFromPost){
  
  for( let user in users ) {
   
    if (bcrypt.compareSync(passwordFromPost, users[user]["password"])&& (emailFromPost === users[user]["email"])){
    
    return user

      }
  }
  return null;
}

// function which returns URLS where userID is equal to currently logged user




/////////////////////////////////////////////////////////////
///Get route renders Login page
/////////////////////////////////////////////////////////////

app.get("/login",(req,res) => {
  if(!req.cookies.user_id) {
    
    res.render("login",{user: users[req.cookies["user_id"]] });
  }
  
  return res.redirect("/urls")

  
  
});

//////////////////////////////////////////////////////////////////////////////////////
///POST route submits Registration values
///Implemented logic which checks empty strings  and if found returns 400 status code
///Implemented logic which checks for a registred email and returns 400 status code
//////////////////////////////////////////////////////////////////////////////////////

app.post("/register",(req,res) => {
  
  
  if(req.body.email === "" || req.body.password === ""){
    res.status(400).send("Please fill the email and password boxes!!!")
    return;
  }
  if(getUserByEmail(req.body.email)) {
    
    res.status(400).send("This Email already registered for another user.Please enter different email !!!!!!!")
    return;
  }
  
  const id = generateRandomString();
  const email = req.body.email;
  const password =bcrypt.hashSync(req.body.password,10);
 
  
  const newUser ={
    id : id,
    email: email,
    password: password
  }
  
  users[id] = newUser;
  
  res.cookie("user_id",`${id}`);
  
  
  
  res.redirect("/login");
  
});

/////////////////////////////////////////////////////////////
///Get route renders Registration page
/////////////////////////////////////////////////////////////

app.get("/register",(req,res) => {


     if (!req.cookies.user_id) { 
      console.log(users)
     
      res.render("register",{user: users[req.cookies["user_id"]]})
      
      return; // Add return to exit the function after redirecting
    } else{
      
      console.log("hi 2")
        // If the user is already logged in, redirect to /urls
        res.redirect("/urls");
        
      }
  });

  


/////////////////////////////////////////////////////////////
///POST route for LOGOUT 
/////////////////////////////////////////////////////////////

app.post("/logout",(req,res) => {
  
  res.clearCookie("user_id")
  
  res.redirect("/login");
  
});
/////////////////////////////////////////////////////////////
///POST route for Login  
/////////////////////////////////////////////////////////////

app.post("/login",(req,res) => {
  if(req.body.email === "" || req.body.password === ""){
    res.status(400).send("Please fill the email and password boxes!!!")
    return;
  }
  
  
  let userFoundByEmailPassword = getUserByEmailByPassword(req.body.email,req.body.password)
  
  if(userFoundByEmailPassword ){
    console.log("login pass check")
    res.cookie("user_id",users[userFoundByEmailPassword]["id"])
    res.redirect("/urls");
  }
  
  res.status(400).send("Loggin attempt was unsuccessful");
  
});
/////////////////////////////////////////////////////////////
///First route Hello Page 
/////////////////////////////////////////////////////////////

app.get("/",(req,res) => {
  res.send("Hello!!");
  
});
/////////////////////////////////////////////////////////////
/// Post Route that edits URL resource
/////////////////////////////////////////////////////////////
app.post("/urls/:id",(req,res) => {
  
 if (req.cookies.user_id) {
 
  const id = req.params.id;
  const longURL = req.body.longURL
  urlDatabase[id].longURL = longURL;
 
 res.redirect(`/urls`);
 }
 res.send ("Login to make changes")
});
/////////////////////////////////////////////////////////////
/// Post Route that removes URL resource
/////////////////////////////////////////////////////////////
app.post("/urls/:id/delete",(req,res) => {
  if (req.cookies.user_id) {

    const id = req.params.id;
    delete urlDatabase[id];
    
    res.redirect("/urls");
  }
  res.send ("Login to make changes")
});
/////////////////////////////////////////////////////////////
///Route to diplay all our urls 
/////////////////////////////////////////////////////////////
app.get("/urls",(req,res) => {
  if (req.cookies["user_id"]) {
    console.log(urlDatabase)
    const ids = Object.keys(urlDatabase)
    console.log(ids);
    for (let uid of ids ) {
      if(urlDatabase[uid].userID === req.cookies["user_id"]){

        const templateVars = {user: users[req.cookies["user_id"]],urls: urlDatabase, uid: urlDatabase[uid].userID  };
        return res.render("urls_index",templateVars);
        
      }

    }
    res.send("No url data for this user!!")

  }

  res.send("<html><body>Login or Register first!!!!</body></html>\n")

  
});

/////////////////////////////////////////////////////////////
///Get Route to show the new Form
/////////////////////////////////////////////////////////////
app.get("/urls/new", (req, res) => {
  if(req.cookies.user_id){
  
    const templateVars = {user: users[req.cookies["user_id"]]}
    res.render("urls_new",templateVars);
    
  } else {

    res.redirect("/login")
  }
  
});

/////////////////////////////////////////////////////////////
/// POST Route to recieve the Form Submission
/////////////////////////////////////////////////////////////

app.post("/urls", (req, res) => {
  if(req.cookies["user_id"]){

      const id = generateRandomString();

      const longUrl = req.body.longURL
      console.log(longUrl);
      
      urlDatabase[id] ={
        longURL : longUrl,
        userID : req.cookies["user_id"]
      }
     
      res.redirect(`/urls/${id}`);
  }
  res.send("You should login to make a post.")
  
});
/////////////////////////////////////////////////////////////
/// Redirect Short URLs
/////////////////////////////////////////////////////////////

app.get("/u/:id", (req, res) => {
  const idOfUrlDatabase = Object.keys(urlDatabase)
  for(let id of idOfUrlDatabase) {
    if(req.params.id === id) {
      const longURL = urlDatabase[req.params.id].longURL;
      
      res.redirect(longURL);

    }
  } 
  res.send("This Id does not exist!!!!!")

  
});



/////////////////////////////////////////////////////////////
///Route to diplay a single URL and its shortened form 
/////////////////////////////////////////////////////////////
app.get("/urls/:id", (req, res) => {
  if(req.cookies["user_id"]) {
    const templateVars = { user: users[req.cookies["user_id"]],id: req.params.id, longURL:urlDatabase[req.params.id].longURL };
    res.render("urls_show", templateVars);

  }
  res.send("LOGIN TO GET ACCESS TO THIS PAGE")
});


/////////////////////////////////////////////////////////////
/// Route for JSON data
/////////////////////////////////////////////////////////////

app.get("/urls.json", (req,res) => {
  res.json(urlDatabase);
})

/////////////////////////////////////////////////////////////
/// Sending HTML in a route
/////////////////////////////////////////////////////////////
app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
})

/////////////////////////////////////////////////////////////
/// App listening at port 8080!
/////////////////////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});