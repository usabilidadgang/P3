'use strict';
const ServerPersistance = require('./ServerPersistance.js');
const DiskPersistance = require('./DiskPersistance');
const CSVSerializer = require('./CSVSerializer');
const JSONSerializer = require('./JSONSerializer');
const Event = require('./Event');

class Tracker {

    constructor(typeOfPersistance, typeOfSerializing){
      this.userid = 0;
      this.event_queue = [];
      if(typeOfPersistance == 0)
      {
        this.Persistence = new ServerPersistance('http://localhost:80/tracker');      
      }
      else if(typeOfPersistance == 1)
      {
        this.Persistence = new DiskPersistance("log.txt");
      }
      if(typeOfSerializing == 0)
      {
        this.Serializer = new CSVSerializer();
      }
      else if(typeOfSerializing == 1)
      {
        this.Serializer = new JSONSerializer();
      }
      this.instance = this;
      this.addEvent = function(event_type, event_info)
      {
        let date = new Date();
        let timestamp = date.getTime();
        let event = new Event(timestamp, event_type, event_info)
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

  module.exports = Tracker;
