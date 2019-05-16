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
      let obj = {data: dataString};
      fetch(this.address, 
        {
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body : JSON.stringify(obj)
    

      }).then(res => res.json())
      .catch(error => console.log(error))
    }
  }

module.exports = ServerPersistance;
