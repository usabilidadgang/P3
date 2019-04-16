'use strict';
const ServerPersistance = require('./ServerPersistance.js');
const DiskPersistance = require('./DiskPersistance');
const CSVSerializer = require('./CSVSerializer');
const JSONSerializer = require('./JSONSerializer');
const Event = require('./Event');
const uniqid = require('uniqid');

class Tracker {

    constructor(typeOfPersistance, typeOfSerializing){
      this.userid = uniqid();
      this.event_queue = [];

      switch (typeOfPersistance) {
        case 0:
          this.Persistence = new ServerPersistance('http://localhost:8080/tracker');
          break;
        case 1:
          this.Persistence = new DiskPersistance("log.txt");
          break;
        default:
          this.Persistence = new DiskPersistance("log.txt");
          break;
      }

      switch (typeOfSerializing) {
        case 0:
          this.Serializer = new CSVSerializer();
          break;
        case 1:
          this.Serializer = new JSONSerializer();
          break;
        default:
          this.Serializer = new CSVSerializer();
          break;
      }
      this.addEvent = function(event_type, event_info)
      {
        let date = new Date();
        let timestamp = date.getTime();
        let event = new Event(this.userid, timestamp, event_type, event_info)
        this.event_queue.push(event);
        if(this.event_queue.length > 5)
          this.saveWithPersistance();
  
      }
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

  function InitializeTracker(typeOfPersistance,typeOfSerializing){
    if(Instance == undefined){
      Instance = new Tracker(typeOfPersistance, typeOfSerializing);
      console.log("Tracker initialized");
    }else{
      console.log("Tracker already initialized");
    }
  }

  function AddEvent(event_type,event_info){
    Instance.addEvent(event_type,event_info);
  }

  function SaveWithPersistance(){
    Instance.saveWithPersistance();
  }

  module.exports = {
    AddEvent : AddEvent, 
    InitTracker : InitializeTracker,
    SaveWithPersistance: SaveWithPersistance,
  };
