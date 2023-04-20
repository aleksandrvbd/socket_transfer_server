WebSocketServer = require("ws").Server

var fs = require('fs');
ws = new WebSocketServer({port: 5001})
var logStream = ""
var count = 0
ws.on("connection", function (socket) {
    socket.on("message", function (message) {
        message = JSON.parse(message);
        if (message.c == "start") {
            count = 0
            // use {flags: 'a'} to append and {flags: 'w'} to erase and write a new file
            console.log("Receiving file...")
            logStream = fs.createWriteStream('test.tmp', {flags: 'w'});
        }
        else if (message.c == "d") { // data
            const data = Buffer.from(message.d, 'base64').toString('binary')
            count += data.length;
            logStream.write(data);
            socket.send("Received " + data.length + " bytes")
        }
        // Completion
        else if (message.c == "end") { // finished
            console.log("Data saved (" + count + ") bytes.")
            socket.send("Completed")
        }
        else {
            console.log("Unknown message" + message)
        }
    });
    socket.on("error", function (error) {
        console.error(error);
    });
});

// Simple version - each message is saved into the file
//ws.on("connection", function (socket) {
//    socket.on("message", function (message) {
//        console.log("Message received. Saving data...")
//        const data = Buffer.from(message, 'base64').toString('binary')
//        var fs=require("fs")
//        fs.writeFileSync("test.tmp", data);
//        console.log("Message saved (" + data.length + ") bytes.")
//        socket.send("Received")
//    });
//    socket.on("error", function (error) {
//        console.error(error);
//    });
//});
////////////////////////// not needed
function base64ToArrayBuffer(base64) {
      var binary_string = Buffer.from(base64, 'base64').toString('binary');
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
  }
console.log("Started echo websocket server on port 5001")
