//get the express library
const express = require("express");

// assign express variable and port number
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

//add middleware urlencoded 
app.use(express.urlencoded({extended: true}));

//random short URL id generator function
function generateRandomString() {
  const randomid = Math.random().toString(36).substring(2, 8); //gets randomly generated 6 characters and assign it to randomID
  return randomid; //

}


// an object with short keys to long url values
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// when a request is made , responde with Hello!
app.get("/",(req,res) => {
  res.send("Hello!");
});

// adding /urls route
// creates a new variable and assignes the urlDatabase object to it
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//adding /urls/new route
app.get("/urls/new", (req,res) => {
  res.render("urls_new");
})


//adding post route
app.post("/urls", (req,res) => {

  //getting the longURL from the post
  if (!req.body.longURL){
    res.status(400).send("Please Enter Valid URL!!!!") 
  }
  const longURL = req.body.longURL

  //generate and assign the random id to th longURL
  const id = generateRandomString();
   
  //update our urlDatabase

  urlDatabase[id] = longURL;

  //now redirect page to /urls/:id. 
  res.redirect(`/urls/${id}`);
})


app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});



//route which deletes if a delete button request is submitted
app.post("/urls/:id/delete",(req,res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
  
})
// adding /urls/:id route

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});
// creates a new templateVars which holds Id from the user 
// ...plus value of the id

//additional endpoints for api usage
app.get("/urls.json", (req,res) => {
  res.json(urlDatabase);
})


// sending HTML content code 
app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
}); 

//our app server start listening at port 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})


