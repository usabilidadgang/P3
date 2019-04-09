'use strict';
const ServerPersistance = require('./ServerPersistance.js');
const CSVSerializer = require('./CSVSerializer');
class Tracker {

    constructor(typeOfPersistance, typeOfSerializing){
      if(typeOfPersistance == 0)
      {
        this.Persistence = new ServerPersistance('http://localhost:80/tracker');
        this.event_queue = [];
      }
      else if(typeOfPersistance == 1)
      {

      }
      if(typeOfSerializing == 0)
      {
        this.Serializer = new CSVSerializer();
      }
      else if(typeOfSerializing == 1)
      {

      }
      this.instance = this;
      this.addEvent = function(event)
      {
        this.event_queue.push(event);
        if(this.event_queue.length > 5)
          this.saveWithPersistance();
  
      }
      this.saveWithPersistance = function()
      {
        this.event_queue.forEach(event => {
          let serializedData = this.Serializer.serialize(event);
          this.Persistence.send(serializedData);
        });
        this.event_queue = [];       
      }
    } 
  }

  module.exports = Tracker;
