'use strict'

export default class Tracker {

    static instance;

    constructor(){
      if(instance){
        return instance;
      }

      this.instance = this;
    }

    static Serializer;
    static Persistence;
    Cola  = {};

  }

  module.exports = Tracker;
