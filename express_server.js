/////////////////////////////////////////////////////////////
///Setup files and dependancies plus libraries
/////////////////////////////////////////////////////////////
const express = require("express")
const app = express();
const PORT = 8080;

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}));

/////////////////////////////////////////////////////////////
///OUR URL Temporary Database
/////////////////////////////////////////////////////////////

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};


/////////////////////////////////////////////////////////////
/// Aiding Function which generates random ID
/////////////////////////////////////////////////////////////
function generateRandomString() {
  const randomid = Math.random().toString(36).substring(2, 8); //gets randomly generated 6 characters and assign it to randomID
  return randomid; //
  
};
/////////////////////////////////////////////////////////////
///POST route for Login  
/////////////////////////////////////////////////////////////

app.post("/login",(req,res) => {
  const value = req.body.username
  res.cookie("username",`${value}`)
  res.redirect("/urls",);
  
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
  const templateVars = {urls: urlDatabase};
  res.render("urls_index",templateVars);
  
});

/////////////////////////////////////////////////////////////
///Get Route to show the new Form
/////////////////////////////////////////////////////////////
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
  const templateVars = { id: req.params.id, longURL:urlDatabase[req.params.id] };
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