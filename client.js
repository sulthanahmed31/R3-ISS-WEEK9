const io = require("socket.io-client");
const readline = require("readline");
const NodeRSA = require("node-rsa");

const socket = io("http://localhost:3000");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

let targetUsername = "";
let username = "";
const users = new Map();
const keyPair = new NodeRSA({ b: 512 }); // Generate RSA key pair
const publicKey = keyPair.exportKey("public");
const privateKey = keyPair.exportKey("private");

socket.on("connect", () => {
  console.log("Connected to the server");

  rl.question("Enter your username: ", (input) => {
    username = input;
    console.log(`Welcome, ${username} to the chat`);

    socket.emit("registerPublicKey", {
      username,
      publicKey,
    });

    rl.prompt();

    rl.on("line", (message) => {
      if (message.trim()) {
        if ((match = message.match(/^!secret (\w+)$/))) {
          targetUsername = match[1];
          console.log(`Now secretly chatting with ${targetUsername}`);
        } else if (message.match(/^!exit$/)) {
          console.log(`No more secretly chatting with ${targetUsername}`);
          targetUsername = "";
        } else {
          let encryptedMessage = message;
          if (targetUsername && users.has(targetUsername)) {
            const targetPublicKey = users.get(targetUsername);
            const targetRSA = new NodeRSA(targetPublicKey); //Create RSA
            encryptedMessage = targetRSA.encrypt(message, "base64");
          }
          socket.emit("message", { username, message: encryptedMessage });
        }
      }
      rl.prompt();
    });
  });
});

socket.on("init", (keys) => {
  keys.forEach(([user, key]) => users.set(user, key));
  console.log(`\nThere are currently ${users.size} users in the chat`);
  rl.prompt();
});

socket.on("newUser", (data) => {
  const { username, publicKey } = data;
  users.set(username, publicKey);
  console.log(`${username} joined the chat`);
  rl.prompt();
});

socket.on("message", (data) => {
  const { username: senderUsername, message: senderMessage } = data;
  if (senderUsername !== username) {
    try {
      const decryptedMessage = keyPair.decrypt(senderMessage, "utf8"); //Decrypt
      console.log(`${senderUsername} (decrypted): ${decryptedMessage}`);
    } catch {
      console.log(`${senderUsername}: ${senderMessage}`); // Display ciphertext if decryption fails
    }
    rl.prompt();
  }
});

socket.on("disconnect", () => {
  console.log("Server disconnected, Exiting...");
  rl.close();
  process.exit(0);
});

rl.on("SIGINT", () => {
  console.log("\nExiting...");
  socket.disconnect();
  rl.close();
  process.exit(0);
});