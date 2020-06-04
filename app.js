const express = require("express");
const { ExpressPeerServer, realm } = require("peer-server-vanilla");
const app = express();

app.get("/", (req, res, next) => res.send("Hello world!"));

const http = require("http");

const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/",
  allow_discovery: true,
});

app.use("/peerjs", peerServer);
peerServer.on("connection", (client) => {
  const clients = realm.getClientsIds();
  const _client = realm.getClientById(clients[0]);
  const _clientSocket = _client.getSocket();
  _clientSocket.send(
    JSON.stringify({
      type: "OPEN",
      payload: {
        msg: "ID is taken",
      },
    })
  );
  // realm.getClientsIds()
});

peerServer.on("disconnect", (client) => {
  console.log(client);
});

const PORT = process.env.PORT || 9000;

server.listen(PORT);
