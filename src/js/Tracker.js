'use strict';
const ServerPersistance = require('./ServerPersistance.js');
const DiskPersistance = require('./DiskPersistance');
const CSVSerializer = require('./CSVSerializer');
const JSONSerializer = require('./JSONSerializer');
const Event = require('./Event');
const uniqid = require('uniqid');

class Tracker {

    constructor(typeOfPersistance, typeOfSerializing){
      this.userid = uniqid(); //Generacion de una id única para el usuario
      this.event_queue = []; //Pila de eventos

      switch (typeOfPersistance) {
        case 0:
          this.Persistence = new ServerPersistance('http://localhost:8080/tracker');
          break;
        case 1://No está implementado
          this.Persistence = new DiskPersistance("log.txt");
          break;
        default://No está implementado
          this.Persistence = new DiskPersistance("log.txt");
          break;
      }

      switch (typeOfSerializing) {
        case 0: //Serialización en CSV
          this.Serializer = new CSVSerializer();
          break;
        case 1: //Serialización en JSON
          this.Serializer = new JSONSerializer();
          break;
        default:
          this.Serializer = new CSVSerializer();
          break;
      }
        //Añadir un evento , necesitamos el EventType y la información adicional
      this.addEvent = function(event_type, event_info)
      {
        let date = new Date();
        let timestamp = date.getTime();
        let event = new Event(this.userid, timestamp, event_type, event_info)
        this.event_queue.push(event);
        if(this.event_queue.length > 5) //Si la pila es mayor de 5 guardamos
          this.saveWithPersistance();
  
      }
       //funcion asíncrona que sirve para guardar los eventos de la pila
      this.saveWithPersistance = async function()
      {
        this.event_queue.forEach(event => {
          let serializedData = this.Serializer.serialize(event);
          this.Persistence.send(serializedData);
        });
        this.event_queue = [];       
      }
      this.flush = function()
      {
        this.saveWithPersistance();
      }
    } 
  }

  var Instance;
  //inicializamos el tracker como un singletone
  function InitializeTracker(typeOfPersistance,typeOfSerializing){
    if(Instance == undefined){
      Instance = new Tracker(typeOfPersistance, typeOfSerializing);
      console.log("Tracker initialized");
    }else{
      console.log("Tracker already initialized");
    }
  }

  //añadir evento
  function AddEvent(event_type,event_info){
    Instance.addEvent(event_type,event_info);
  }
  //guardar
  function SaveWithPersistance(){
    Instance.saveWithPersistance();
  }

  module.exports = {
    AddEvent : AddEvent, 
    InitTracker : InitializeTracker,
    SaveWithPersistance: SaveWithPersistance,
  };
