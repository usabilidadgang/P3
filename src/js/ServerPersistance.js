const fetch = require("node-fetch")
//Presistencia en servidor registra la direccion y envia los datos al servidor
class ServerPersistance
{
  constructor(address)
  {
      this.address = address;
  }


  send (dataString)
  {
      var obj = {data: dataString};
      //console.log("Sending object: ", obj);
      fetch(this.address, 
        {
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body : JSON.stringify(obj),
        mode: 'cors'
    

      }).then(res => res.json())
      .catch(error => console.log(error))
    }
  }

module.exports = ServerPersistance;
