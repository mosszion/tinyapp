//get the express library
const express = require("express");

// assign express variable and port number
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

// an object with short keys to long url values
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// when a request is made , responde with Hello!
app.get("/",(req,res) => {
  res.send("Hello!");
});

// adding first route
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// adding second route
app.get("/urls/:id", (req, res) => {
  // const longURL = urlDatabase[req.params.id];
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

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


