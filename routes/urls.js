const router = require("express").Router();
const helper = require("../helpers/helper_functions.js");

// Databases
const userDatabase = require("../data/databases").userDatabase;
const userEmailDatabase = require("../data/databases").userEmailDatabase;// Databases
const urlDatabase = require("../data/databases").urlDatabase;

// redirect our client to the URL in our URL DB
router.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].url;
  // console.log(longURL);
  res.redirect(longURL);
});

// Create a new tinyURL by getting this form
router.get("/urls/new", (req, res) => {
  if(res.locals.userLoggedIn) {
    res.render("urls_new");
    return;
  }
  res.redirect('/urls');
});

// Create a new tinyURL by posting here
router.post("/urls", (req, res) => {
  if(res.locals.userLoggedIn){
    const bigURL = req.body.longURL;
    const shortURL = helper.generateRandomString();
    urlDatabase[shortURL] = {url: bigURL, userid: res.locals.user.id};
    res.redirect(`/urls/${shortURL}`);
    return;
  }
  res.redirect('/urls');
});

// Our Homepage
router.get("/", (req, res) => {
  if(res.locals.userLoggedIn){
    res.locals.urlDatabase = helper.urlsForUserId(res.locals.user.id, urlDatabase);
  }
  res.render("urls_index");
});

// List all the URLs
router.get("/urls", (req, res) => {
  if(res.locals.userLoggedIn){
    res.locals.urlDatabase = helper.urlsForUserId(res.locals.user.id, urlDatabase);
  }
  res.render("urls_index");
});

// Show a tinyURL and allow user to edit the original
router.get("/urls/:shortURL", (req, res) => {
  if(res.locals.userLoggedIn && helper.userBelongsToUrl(req, res, urlDatabase)) {
    const short = req.params.shortURL;
    res.locals.shortURL = short;
    res.locals.bigURL = urlDatabase[short].url;
    res.render("urls_show");
    return;
  }
  res.redirect("/urls");
});

// Update the Long or Original of the specified URL
router.post("/urls/:shortURL", (req, res) => {
  if(res.locals.userLoggedIn && helper.userBelongsToUrl(req, res, urlDatabase)) {
    const short = req.params.shortURL;
    const big = req.body.update_input;
    urlDatabase[short].url = big;
    res.redirect(`/urls/${short}`);
    return;
  }
  res.redirect('/urls');
});

// Delete the specified URL
router.post("/urls/:shortURL/delete", (req, res) => {
  if(res.locals.userLoggedIn && helper.userBelongsToUrl(req, res, urlDatabase)) {
    const short = req.params.shortURL;
    delete urlDatabase[short];
  }
  res.redirect("/urls");
});

module.exports = router;