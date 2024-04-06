/////////////////////////////////////////////////////////////
///Setup files and dependancies plus libraries
/////////////////////////////////////////////////////////////
const express = require("express")
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8080;

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

/////////////////////////////////////////////////////////////
///OUR URL Temporary Database
/////////////////////////////////////////////////////////////

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

/////////////////////////////////////////////////////////////
///OUR URL Temporary USERS Database
/////////////////////////////////////////////////////////////

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
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
      if ((passwordFromPost === users[user]["password"] )&& (emailFromPost === users[user]["email"])){
        return user
      }
  }
  return null;
}


/////////////////////////////////////////////////////////////
///Get route renders Login page
/////////////////////////////////////////////////////////////

app.get("/login",(req,res) => {
  res.cookie("user_id");
  res.render("login",{user: users[req.cookies["user_id"]] });
  
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
  const password = req.body.password;
  
  const newUser ={
      id : id,
    email: email,
    password: password
  }

  users[id] = newUser;

  res.cookie("user_id",`${id}`);

  

  res.redirect("/urls");
  
});

/////////////////////////////////////////////////////////////
///Get route renders Registration page
/////////////////////////////////////////////////////////////

app.get("/register",(req,res) => {

  res.render("register",{user: users[req.cookies["user_id"]]});
  
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
///Route to diplay all our urls 
/////////////////////////////////////////////////////////////
app.get("/urls",(req,res) => {
  const templateVars = {user: users[req.cookies["user_id"]],urls: urlDatabase};
  res.render("urls_index",templateVars);
  
});

/////////////////////////////////////////////////////////////
///Get Route to show the new Form
/////////////////////////////////////////////////////////////
app.get("/urls/new", (req, res) => {
  const templateVars = {user: users[req.cookies["user_id"]]}
  res.render("urls_new",templateVars);
});

/////////////////////////////////////////////////////////////
/// Post Route that edits URL resource
/////////////////////////////////////////////////////////////
app.post("/urls/:id",(req,res) => {
  const id = req.params.id;
  const longURL = req.body.longURL
  urlDatabase[id] = longURL;
 
 res.redirect(`/urls`);
});
/////////////////////////////////////////////////////////////
/// Post Route that removes URL resource
/////////////////////////////////////////////////////////////
app.post("/urls/:id/delete",(req,res) => {
  const id = req.params.id;
  delete urlDatabase[id];
 
 res.redirect("/urls");
});
/////////////////////////////////////////////////////////////
/// POST Route to recieve the Form Submission
/////////////////////////////////////////////////////////////

app.post("/urls", (req, res) => {
  const id = generateRandomString();
  const longUrl = req.body.longURL
  urlDatabase[id] =longUrl;

  res.redirect(`/urls/${id}`);
});
/////////////////////////////////////////////////////////////
/// Redirect Short URLs
/////////////////////////////////////////////////////////////

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});



/////////////////////////////////////////////////////////////
///Route to diplay a single URL and its shortened form 
/////////////////////////////////////////////////////////////
app.get("/urls/:id", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]],id: req.params.id, longURL:urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
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