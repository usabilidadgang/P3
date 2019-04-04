var ServerPersistance = require('./ServerPersistance');



var persistance = new ServerPersistance('http://localhost:80/tracker');
response = persistance.send("tuvieja");
console.log(response)