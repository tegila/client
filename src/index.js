const url = process.env.URL || "localhost:3000";
var socket = require("socket.io-client")(`http://${url}/`);

const queryBuilder = require("querybuilder");
const crypt = require("common")();
crypt.init_keypair();

socket.on("return", function(data) {
  console.log("returning from server: ");
  console.log(data);
});

socket.on("error", console.log);

const send = (message) => {
  return new Promise((resolve) => {
    const hash = crypt.hash_message(message);

    console.log(`sending hash: ${hash}`);
    socket.emit("hash", hash);
    
    socket.once(hash, nonce => {
      console.log(`getting nonce: ${nonce}`);
      const hash_1 = crypt.hash_message({ hash, nonce });
      console.log(`hash_1: ${hash_1}`);
      // sign hash_1
      const signature = crypt.sign_message(hash_1);
      const payload = { 
        message, 
        hash: hash_1, 
        signature
      };
      const hash_2 = crypt.hash_message(payload);
      console.dir(payload);
      console.log(`hash_2: ${hash_2}`);
      socket.once(hash_2, ret => {
        console.log(`getting return: ${ret}`);
        resolve(ret);
      });
      socket.emit(hash_1, payload);
    });    
  });
}

socket.emit("join", "profile");
socket.emit("join", "sales");

const profile = queryBuilder()
  .database("__auth__")
  .collection("Profiles")
  //.find({})
  .insert({
    user: "user",
    passwd: "passwd"
  })
  //.all()
  .value();

send(profile).then(console.log);

const findone = queryBuilder()
  .database("__auth__")
  .collection("Profiles")
  .find({})
  //.all()
  .value();

findone.nonce = Math.random();
send(findone).then(console.log);

const self = (endpoint) => {
  send: () => {
  }
  return Object.assign(queryBuilder(), {send});
}

module.exports = self;
