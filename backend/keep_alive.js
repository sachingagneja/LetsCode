var http = require("http");
http
  .createServer(function (req, res) {
    res.write("I'm working");
    res.end();
  })
  .listen(3001);
