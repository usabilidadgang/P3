'use strict';
const ServerPersistance = require('./ServerPersistance.js');
const DiskPersistance = require('./DiskPersistance');
const CSVSerializer = require('./CSVSerializer');
const JSONSerializer = require('./JSONSerializer');
const Event = require('./Event');
const uniqid = require('uniqid');

const PersistanceType = {
  Server: 0,
  Local: 1,
};

const PersistanceDefaults = [
  ServerPersistance,
  DiskPersistance
];

const SerializerType = {
  Custom: -1,
  CSV: 0,
  JSON: 1,
};

const SerializerDefaults = [
  CSVSerializer,
  JSONSerializer,
];

/**
 * Tracker Main class
 *
 * @class Tracker
 */
class Tracker {
  /**
   *Creates an instance of Tracker.
   * @param {Object} setupInfo
   * @memberof Tracker
   */
  constructor(setupInfo) {
    if (setupInfo != null) {
      console.log("Intializing tracker with this settings");
      console.log(setupInfo);
    }
    else {
      console.log("No setup information Tracker not initializated");
      return null;
    }
    this.userid = uniqid();
    this.event_queue = [];
    this.maxQueuedEvents = setupInfo.maxQueuedEvents || 5;

    if (setupInfo.persistance != undefined) {
      this.Persistence = new PersistanceDefaults[setupInfo.persistance.type](setupInfo.persistance.arg);
    }
    else {
      this.Persistence = new ServerPersistance("localhost:8080/tracker");
    }

    if (setupInfo.serializer != undefined) {
      if(setupInfo.serializer.type!= SerializerType.Custom){
        this.Serializer = new SerializerDefaults[setupInfo.serializer.type]();
      }
      else
      {
        this.Serializer = setupInfo.serializer.custom;
      }
    }
    else {
      console.log("By default CSV serializing")
      this.Serializer = new CSVSerializer();
    }
  }

  /**
   * Add an event to the queue
   *
   * @param {*} event_type the event type
   * @param {*} event_info the event info
   * @memberof Tracker
   */
  AddEvent(event_type, event_info) {
    let date = new Date();
    let timestamp = date.getTime();
    let event = new Event(this.userid, timestamp, event_type, event_info)
    this.event_queue.push(event);
    if (this.event_queue.length > this.maxQueuedEvents)
      this.SaveWithPersistance();

  }

  /**
   * Save the events
   *
   * @memberof Tracker
   */
  async SaveWithPersistance() {
    this.event_queue.forEach(event => {
      let serializedData = this.Serializer.serialize(event);
      this.Persistence.send(serializedData);
    });
    this.event_queue = [];
  }

  /**
   * deprecated shit ask manu why this
   *
   * @memberof Tracker
   */
  Flush() {
    this.SaveWithPersistance();
  }
}

var Instance = null;


/**
 * Initialize the tracker
 *
 * @param {*} setupInfo The setup information
 */
function InitializeTracker(setupInfo) {
  if (Instance != null) {
    console.log("Tracker already initialized");
  } else {
    Instance = new Tracker(setupInfo);
  }
}

/**
 * This method add to the queue of tracked events a new one
 * @param {Int32} event_type type of the event
 * @param {object} event_info infomation about the event
 */
function AddEvent(event_type, event_info) {
  (Instance != null) ? Instance.AddEvent(event_type, event_info) : console.log("Tracker not initialized");
}


/**
 * save the tracked events
 *
 */
function SaveWithPersistance() {
  (Instance != null) ? Instance.SaveWithPersistance() : console.log("Tracker not initialized");
}

module.exports = {
  AddEvent: AddEvent,
  InitTracker: InitializeTracker,
  SaveWithPersistance: SaveWithPersistance,
  PersistanceType,
  SerializerType
};
