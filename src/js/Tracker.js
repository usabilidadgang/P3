'use strict';
const ServerPersistance = require('./ServerPersistance.js');
const DiskPersistance = require('./DiskPersistance');
const CSVSerializer = require('./CSVSerializer');
const JSONSerializer = require('./JSONSerializer');
const Event = require('./Event');
const uniqid = require('uniqid');

const PersistanceType = {
  ServerPersistance :0,
  LocalPersistance  :1,
}


class Tracker {
    constructor(typeOfPersistance, typeOfSerializing){
      this.userid = uniqid();
      this.event_queue = [];

      switch (typeOfPersistance) {
        case PersistanceType.ServerPersistance:
          this.Persistence = new ServerPersistance('http://localhost:8080/tracker');
          break;
        case PersistanceType.LocalPersistance:
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

  /**
   * Initialize the Tracker
   * @param {int} typeOfPersistance 0 for server persistance 1 for file persistance
   * @param {int} typeOfSerializing 0 for csv 1 for json
   */
  function InitializeTracker(typeOfPersistance,typeOfSerializing){
    if(Instance == undefined){
      Instance = new Tracker(typeOfPersistance, typeOfSerializing);
      console.log("Tracker initialized");
    }else{
      console.log("Tracker already initialized");
    }
  }

  /**
   * This method add to the queue of tracked events a new one
   * @param {Int32} event_type type of the event
   * @param {object} event_info infomation about the event
   */
  function AddEvent(event_type,event_info){
    (Instance != null)?Instance.addEvent(event_type,event_info):console.log("Tracker not initialized");
  }

  /**
   * Save the tracked events
   */
  function SaveWithPersistance(){
    (Instance != null)?Instance.saveWithPersistance():console.log("Tracker not initialized");
  }

  module.exports = {
    AddEvent : AddEvent, 
    InitTracker : InitializeTracker,
    SaveWithPersistance: SaveWithPersistance,
  };
