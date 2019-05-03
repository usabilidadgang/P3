const fetch = require("node-fetch")

/**
 * Persistance With server
 */
class ServerPersistance
{
  /**
   * Constructor of the Class
   * @param {string} address the adress of the server
   */
  constructor(address)
  {
      this.address = address;
  }

  /**
   * Send the data to the server
   * @param {string} dataString the data you want to send
   */
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
