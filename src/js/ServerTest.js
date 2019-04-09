const ServerPersistance = require('./ServerPersistance');
const readline = require('readline');

var persistance = new ServerPersistance('http://localhost:80/tracker');
response = persistance.send(process.argv[2]);
console.log(process.argv[2])