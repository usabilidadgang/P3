const fetch = require("node-fetch")
class ServerPersistance
{
  constructor(address)
  {
      this.address = address;
  }

  send(dataString)
  {
      var obj = {data: dataString};
      fetch(this.address, 
        {
         method:'POST',
         headers:{
            'Content-Type': 'application/json'
         },
         body : JSON.stringify(obj)   
      }).then(res => res.json())
      .then(response =>console.log('Success: ', JSON.stringify(response)))
    }
  }

module.exports = ServerPersistance;
