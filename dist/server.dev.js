"use strict";

var app = require("./app");

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log("App running on port ".concat(port));
}); // handle error outside express

process.on("unhandledRejection", function (err) {
  console.error("unhandledRejection error: ".concat(err.name, " | ").concat(err.message)); // you must close server first then shut down your app

  server.close(function () {
    console.log("App shutting down");
    process.exit(1);
  });
});