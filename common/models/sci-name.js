
var async = require('async');
var crypto = require('crypto');
module.exports = function(SciName) {
  /*
  * ASSERTIONS - SINGLE RECORD
  */
  SciName.SingleRecordAssertions = function(record,cb) {
    SciName.SingleRecordCompleteness(record, function (err, response) {
      SciName.SingleRecordValidationCompleteness(response, function (err, response) {
        cb(null, response);
      });
    });
  };
  SciName.remoteMethod(
    'SingleRecordAssertions',
    {
      http: {path: '/assertions/singlerecord', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  SciName.SingleRecordAssertionsList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      SciName.SingleRecordAssertions(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  SciName.remoteMethod(
    'SingleRecordAssertionsList',
    {
      http: {path: '/assertions/singlerecord', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );
  /*
  * MEASUREMENT - SINGLE RECORD
  */
  SciName.SingleRecordMeasure = function(record,cb) {
    SciName.SingleRecordCompleteness(record, function (err, response) {
          cb(null, response);
    });
  };
  SciName.remoteMethod(
    'SingleRecordMeasure',
    {
      http: {path: '/measurement/singlerecord', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  SciName.SingleRecordMeasureList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      SciName.SingleRecordMeasure(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  SciName.remoteMethod(
    'SingleRecordMeasureList',
    {
      http: {path: '/measurement/singlerecord', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );

  // Completeness
  SciName.SingleRecordCompleteness = function(record,cb) {
    if(typeof record.SciNameMeasures == 'undefined')
    record.SciNameMeasures = []
    var measure = {}
    measure.input = {}
    measure.input.scientificName = record.scientificName;
    measure.input.scientificNameAuthorship = record.scientificNameAuthorship;
    //measure.input.origialScientificNameAuthorship = record.origialScientificNameAuthorship;
    measure.contextualizedDimension = 'SciName Completeness of Single Record';
    measure.specification = '';
    measure.mechanism = 'BDQ Toolkit';
    measure.id = crypto.createHash('md5').update(record.scientificName+":"+record.scientificNameAuthorship+":"+measure.contextualizedDimension+":"+measure.specification+":"+measure.mechanism).digest("hex");

    if(typeof record.scientificName == 'undefined' || record.scientificName.toString().trim().length==0){
      measure.assertion = 'Not Complete';
      record.SciNameMeasures.push(measure);
      cb(null, record);
    } else if(typeof record.scientificNameAuthorship == 'undefined' || record.scientificNameAuthorship.toString().trim().length==0){
      measure.assertion = 'Not Complete';
      record.SciNameMeasures.push(measure);
      cb(null, record);
    } else {
      measure.assertion = 'Complete';
      record.SciNameMeasures.push(measure);
      cb(null, record);
    }
  };
  SciName.remoteMethod(
    'SingleRecordCompleteness',
    {
      http: {path: '/measurement/singlerecord/completeness', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  SciName.SingleRecordCompletenessList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      SciName.SingleRecordCompleteness(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  SciName.remoteMethod(
    'SingleRecordCompletenessList',
    {
      http: {path: '/measurement/singlerecord/completeness', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );


    /*
    * VALIDATION - SINGLE RECORD
    */
    SciName.SingleRecordValidation = function(record,cb) {
      SciName.SingleRecordValidationCompleteness(record, function (err, response) {
        cb(null, response);
      });
    };
    SciName.remoteMethod(
      'SingleRecordValidation',
      {
        http: {path: '/validation/singlerecord', verb: 'get'},
        accepts: [{arg: 'record', type: 'object'}],
        returns: {arg: 'response', type: 'object'}
      }
    );
    SciName.SingleRecordValidationList = function(body,cb) {
      var result = [];
      async.each(body, function iterator(item, callback){
        SciName.SingleRecordValidation(item, function (err, response) {
          result.push(response);
          callback();
        });
      }, function done(){
        cb(null, result);
      });
    };
    SciName.remoteMethod(
      'SingleRecordValidationList',
      {
        http: {path: '/validation/singlerecord', verb: 'post'},
        accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
        returns: {arg: 'response', type: 'object'}
      }
    );

    // Completeness
    SciName.SingleRecordValidationCompleteness = function(record,cb) {
      if(typeof record.SciNameValidations == 'undefined')
        record.SciNameValidations = []
      var measure = {}
      measure.contextualizedDimension = 'SciName Completeness of Single Record';
      measure.specification = '';
      measure.mechanism = 'BDQ Toolkit';
      measure.id = crypto.createHash('md5').update(record.scientificName+":"+record.scientificNameAuthorship+":"+measure.contextualizedDimension+":"+measure.specification+":"+measure.mechanism).digest("hex");
      var validation = {}
      validation.input = {}
      validation.input.scientificName = record.scientificName;
      validation.input.scientificNameAuthorship = record.scientificNameAuthorship;
      // validation.input.origialScientificNameAuthorship = record.origialScientificNameAuthorship;
      validation.contextualizedCriterion = 'SciName of Single Record must be "Complete"';
      validation.specification = '';
      validation.mechanism = 'BDQ Toolkit';
      validation.id = crypto.createHash('md5').update(record.scientificName+":"+record.scientificNameAuthorship+":"+validation.contextualizedCriterion+":"+validation.specification+":"+validation.mechanism).digest("hex");

      validation.assertion = 'Not Valid';
        for(var i = 0; i<record.SciNameMeasures.length; i++){
          if(record.SciNameMeasures[i].contextualizedDimension=='SciName Completeness of Single Record'){
            if (record.SciNameMeasures[i].assertion=='Complete') {
              validation.assertion = 'Valid';
              break;
            }else{
              validation.assertion = 'Not Valid';
              break;
            }
          }
        }
        record.SciNameValidations.push(validation);
        cb(null, record);
    };
    SciName.remoteMethod(
      'SingleRecordValidationCompleteness',
      {
        http: {path: '/validation/singlerecord/completeness', verb: 'get'},
        accepts: [{arg: 'record', type: 'object'}],
        returns: {arg: 'response', type: 'object'}
      }
    );
    SciName.SingleRecordValidationCompletenessList = function(body,cb) {
      var result = [];
      async.each(body, function iterator(item, callback){
        SciName.SingleRecordValidationCompleteness(item, function (err, response) {
          result.push(response);
          callback();
        });
      }, function done(){
        cb(null, result);
      });
    };
    SciName.remoteMethod(
      'SingleRecordValidationCompletenessList',
      {
        http: {path: '/validation/singlerecord/completeness', verb: 'post'},
        accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
        returns: {arg: 'response', type: 'object'}
      }
    );
};
