'use strict';
const ServerPersistance = require('./ServerPersistance.js');
const DiskPersistance = require('./DiskPersistance');
const CSVSerializer = require('./CSVSerializer');
const JSONSerializer = require('./JSONSerializer');
const Event = require('./Event');
const uniqid = require('uniqid');

/**
 * Enumerdo para el tipo de persistencia
 */
const PersistanceType = {
  /**
   * Persistencia en servidor
   */
  Server: 0,
  /**
   * Persistencia en local
   */
  Local: 1,
};

const PersistanceDefaults = [
  ServerPersistance,
  DiskPersistance
];

/**
 * Enumerdo para el tipo de serialización
 */
const SerializerType = {
  /**
   * Serializacion en CSV
   */
  CSV: 0,
  /**
   * Serialización en JSON
   */
  JSON: 1,
};

const SerializerDefaults = [
  CSVSerializer,
  JSONSerializer,
];

/**
 * Clase del Tracker
 * @class Tracker
 */
class Tracker {
  /**
   * Construtora de la clase
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
      this.Persistence = new ServerPersistance("https://usabilidadanalytics.tk/tracker");
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
   * Añade un evento a la cola
   *
   * @param {Number} event_type 
   * @param {Object} event_info 
   * @memberof Tracker
   */
  AddEvent(event_type, event_info) {
    let date = new Date();
    let timestamp = date.getTime();
    let event = new Event(this.userid, timestamp, event_type, event_info)
    this.event_queue.push(event);
    if (this.event_queue.length > this.maxQueuedEvents|| event_type == 1)
      this.SaveWithPersistance();

  }

  /**
   * Guarda los eventos segun la configuración 
   * @memberof Tracker
   */
  async SaveWithPersistance() {
    this.event_queue.forEach(event => {
      let serializedData = this.Serializer.serialize(event);
      this.Persistence.send(serializedData);
    });
    this.event_queue = [];
  }
}

var Instance = null;


/**
 * Inicializa el tracker
 *
 * @param {Object} setupInfo la información de las preferencias para iniciar el tracker
 */
function InitializeTracker(setupInfo) {
  if (Instance != null) {
    console.log("Tracker already initialized");
  } else {
    Instance = new Tracker(setupInfo);
  }
}

/**
 * Añade un evento a la cola 
 * @param {Number} event_type tipo de evento
 * @param {Object} event_info Información del evento
 */
function AddEvent(event_type, event_info) {
  (Instance != null) ? Instance.AddEvent(event_type, event_info) : console.log("Tracker not initialized");
}


/**
 * Guarda los evento segun la configuración asignada
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
