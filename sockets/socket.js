const { io } = require("../index");
const Band = require("../models/band");

const Bands = require("../models/bands");
const bands = new Bands();

bands.addBand(new Band("Queen"));
bands.addBand(new Band("Nonpalidece"));
bands.addBand(new Band("Dread Mar I"));
bands.addBand(new Band("Los Piojos"));

// mensajes de sockets
io.on("connection", (client) => {
  console.log("Cliente conectado");

  client.emit("active-bands", bands.getBands()); // solo al cliente que se conecta

  client.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

  client.on("mensaje", (payload) => {
    console.log("Mensaje!!", payload.nombre);

    io.emit("mensaje", { admin: "Nuevo mensaje" });
  });

  //   client.on("emitir-mensaje", (payload) => {
  //     console.log(payload);
  //     // io.emit("nuevo-mensaje", payload); //emite a todos
  //     client.broadcast.emit("nuevo-mensaje", payload); //emite a todos menos al que lo emitio
  //   });

  client.on("vote-band", (payload) => {
    bands.voteBand(payload.id);
    io.emit("active-bands", bands.getBands());
  });

  client.on("add-band", (payload) => {
    bands.addBand(new Band(payload.name));
    io.emit("active-bands", bands.getBands());
  });

  client.on("delete-band", (payload) => {
    console.log(payload.id);
    bands.deleteBand(payload.id);
    io.emit("active-bands", bands.getBands());
  });
});
