const crypt = require("common")();

module.exports = {
  init_keypair: crypt.init_keypair,
  send: (socket, message) => {
    return new Promise(resolve => {
      const message_hash = crypt.hash_message(message);

      console.log(`sending message_hash: ${message_hash}`);
      socket.emit("message_hash", message_hash);

      socket.once(message_hash, nonce => {
        console.log(`getting nonce: ${nonce}`);
        const message_hash_nonce = crypt.hash_message({ message_hash, nonce });
        console.log(`message_hash_nonce: ${message_hash_nonce}`);
        // sign hash_nonce
        const signature = crypt.sign_message(message_hash_nonce);
        const payload = {
          message,
          hash: message_hash_nonce,
          signature
        };
        const payload_hash = crypt.hash_message(payload);
        console.dir(payload);
        console.log(`payload_hash: ${payload_hash}`);
        socket.once(payload_hash, ret => {
          console.log(`getting return: ${ret}`);
          resolve(ret);
        });
        socket.emit(message_hash_nonce, payload);
      });
    });
  }
};
