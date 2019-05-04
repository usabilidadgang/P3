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
};

const PersistanceDefaults = [
  ServerPersistance,
  LocalPersistance
];

const SerializerType = {
  CSVSerialize :0,
  JSONSerialize:1,
};

const SerializerDefaults = [
  CSVSerializer,
  JSONSerializer,
];

class Tracker {
    constructor(setupInfo){
      if(setupInfo != null)
      {
        console.log("Intializing tracker with this settings");
        console.log(setupInfo);
      }
      else
      {
        console.log("No setup information Tracker not initializated");
        return null;
      }
      this.userid = uniqid();
      this.event_queue = [];
      this.maxQueuedEvents = setupInfo.maxQueuedEvents || 5;

      if(setupInfo.persistance != undefined){
        this.Persistence = new PersistanceDefaults[setupInfo.persistance.type](setupInfo.persistance.dir);
      }
      else
      {
        console.log("By default Local Persistance int the file log.txt")
        this.Persistence = new LocalPersistance("log.txt");
      }

      if(setupInfo.serializer != undefined){
        this.Serializer = new SerializerDefaults[setupInfo.serializer.type]();
      }
      else
      {
        console.log("By default CSV serializing")
        this.Serializer = new CSVSerializer();
      }

      

      this.AddEvent = function(event_type, event_info)
      {
        let date = new Date();
        let timestamp = date.getTime();
        let event = new Event(this.userid, timestamp, event_type, event_info)
        this.event_queue.push(event);
        if(this.event_queue.length > this.maxQueuedEvents)
          this.saveWithPersistance();
  
      }

      this.SaveWithPersistance = async function()
      {
        this.event_queue.forEach(event => {
          let serializedData = this.Serializer.serialize(event);
          this.Persistence.send(serializedData);
        });
        this.event_queue = [];       
      }
      this.Flush = function()
      {
        this.saveWithPersistance();
      }
    } 
  }

  var Instance = null;

  /**
   * Initialize the Tracker
   * @param {int} typeOfPersistance 0 for server persistance 1 for file persistance
   * @param {int} typeOfSerializing 0 for csv 1 for json
   */
  function InitializeTracker(setupInfo){
    if(Instance != null){
      console.log("Tracker already initialized");
    }else{
      Instance = new Tracker(setupInfo);
    }
  }

  /**
   * This method add to the queue of tracked events a new one
   * @param {Int32} event_type type of the event
   * @param {object} event_info infomation about the event
   */
  function AddEvent(event_type,event_info){
    (Instance != null)?Instance.AddEvent(event_type,event_info):console.log("Tracker not initialized");
  }

  /**
   * Save the tracked events
   */
  function SaveWithPersistance(){
    (Instance != null)?Instance.SaveWithPersistance():console.log("Tracker not initialized");
  }

  module.exports = {
    AddEvent : AddEvent, 
    InitTracker : InitializeTracker,
    SaveWithPersistance: SaveWithPersistance,
  };
