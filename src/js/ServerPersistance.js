const fetch = require("node-fetch")

/**
 * Clase para la persistencia en servidor
 */
class ServerPersistance {
  /**
   * Constructora de la clase
   * @param {String} address Dirección a enviar los datos
   */
  constructor(address) {
    this.address = address;
  }

  /**
   * Envia al servidor definido la información
   * @param {String} dataString Datos
   */
  send(dataString) {
    var obj = { data: dataString };
    fetch(this.address,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj),
        mode: 'cors'


      }).then(res => res.json())
      .catch(error => console.log(error))
  }
}


module.exports = ServerPersistance;
