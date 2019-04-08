export default class FilePersistence{
    constructor(address){
        this.address = address;
    }
    Send(datos){

    }

}

export default class ServerPersistence{

    SaveDatFileBro=  function(localstorage) {
        localstorage.root.getFile("datos.txt", {create: true}, function(DatFile) {
          DatFile.createWriter(function(DatContent) {
            var blob = new Blob(["Lorem Ipsum"], {type: "text/plain"});
            DatContent.write(blob);
          });
        });
      }
}
module.exports = {FilePersistence,ServerPersistence};
