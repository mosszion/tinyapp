
const bcrypt = require("bcryptjs");

// Function which returns user if email is registered to users

function getUserByEmail(email,userDatabase){
  
  for( let user in userDatabase ) {
    if(email === userDatabase[user]["email"]) {
        return userDatabase[user]
    }
  }
  return undefined;


}

//function which checks given email and password if correct and found in database
function getUserByEmailByPassword(emailFromPost,passwordFromPost,users){
  
  for( let user in users ) {
   
    if (bcrypt.compareSync(passwordFromPost, users[user]["password"])&& (emailFromPost === users[user]["email"])){
    
    return user

      }
  }
  return null;
}
//Function which generates random Ids
function generateRandomString() {
  const randomid = Math.random().toString(36).substring(2, 8); //gets randomly generated 6 characters and assign it to randomID
  return randomid; //
  
};

module.exports = {
  getUserByEmail,
  getUserByEmailByPassword,
  generateRandomString
}