const fetch = require("node-fetch")
class ServerPersistance
{
  constructor(address)
  {
      this.address = address;
  }

  send (dataString)
  {
      var obj = {data: dataString};
      console.log("Sending object: ", obj);
      fetch(this.address, 
        {
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body : JSON.stringify(obj),
        mode: 'cors'
    

      }).then(res => res.json())
      .then(response => console.log(response))
    }
  }

module.exports = ServerPersistance;
