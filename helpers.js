
// Function which returns user if email is registered to users

function getUserByEmail(email,Database){
  
  for( let user in Database ) {
    if(email === Database[user]["email"]) {
        return user
    }
  }
  return null;
}

module.exports = {
  getUserByEmail
}