const logger = process.env.DEBUG ? console.log : () => null;

const wss = require("../src");
const url = process.env.URL || "localhost:3000";

const _wss = wss(url);
_wss.init_keypair();

// const profile = 

_wss.qb()
  .database("__auth__")
  .collection("Profiles")
  //.find({})
  .insert({
    user: "user",
    passwd: "passwd"
  })
  //.all()
  .send()
  .then(logger);

// const findone = 
_wss.qb()
  .database("__auth__")
  .collection("Profiles")
  .find({})
  //.all()
  .send()
  .then(logger);

