const express = require('express');
//everything here is required for the authentication setup
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const morgan = require('morgan'); // logging middleware
const expireTime = 1800;
const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';

// Authorization error
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

//const OfficerDao = require("./officer_dao");

const PORT = 3001;

app = new express();

// Set-up logging
app.use(morgan('tiny'));

app.use(express.json());


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

module.exports =  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));


app.post('/api/login', (req, res) => {
  const officerAccount = req.body;
  if (!officerAccount) {
    res.status(400).end();
  } else {
    OfficerDao.getOfficerByEmail(officerAccount.email)
      .then((user) => {
        if (user === undefined || user.password != officerAccount.password) {
          res.status(200).json({ error_no: -1, error_info: "Email or password is wrong." })
        } else {
          //AUTHENTICATION SUCCESS
          //const token = jsonwebtoken.sign({ user: user.officerID }, jwtSecret, {expiresIn: expireTime});
          //res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
          res.status(200).json({ user: { name: user.name, email: user.email, isManager: user.isManager }, error_no: 0, error_info: "Login successfully." });
        }
      }).catch(
        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
          new Promise((resolve) => { setTimeout(resolve, 1000) }).then(() => res.status(401).json(authErrorObj))
        }
      );
  }
})

//----------------------COOKIE--------------------------
//TODO: to be tested (if needed)
/*
app.use(cookieParser());


// For the rest of the code, all APIs require authentication
app.use(
  jwt({
    secret: jwtSecret,
    getToken: req => req.cookies.token
  })
);
*/

