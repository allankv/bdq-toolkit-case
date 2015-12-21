var async = require('async');
var crypto = require('crypto');
var moment = require('moment');
module.exports = function(CollectedDate) {
  /*
  * ASSERTIONS - SINGLE RECORD
  */
  CollectedDate.SingleRecordAssertions = function(record,cb) {
    CollectedDate.SingleRecordCompleteness(record, function (err, response) {
      CollectedDate.SingleRecordValidationCompleteness(response, function (err, response) {
        CollectedDate.SingleRecordValidationISOCompliance(response, function (err, response) {
          cb(null, response);
        });
      });
    });
  };
  CollectedDate.remoteMethod(
    'SingleRecordAssertions',
    {
      http: {path: '/assertions/singlerecord', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  CollectedDate.SingleRecordAssertionsList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      CollectedDate.SingleRecordAssertions(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  CollectedDate.remoteMethod(
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
  CollectedDate.SingleRecordMeasure = function(record,cb) {
    CollectedDate.SingleRecordCompleteness(record, function (err, response) {
          cb(null, response);
    });
  };
  CollectedDate.remoteMethod(
    'SingleRecordMeasure',
    {
      http: {path: '/measurement/singlerecord', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  CollectedDate.SingleRecordMeasureList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      CollectedDate.SingleRecordMeasure(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  CollectedDate.remoteMethod(
    'SingleRecordMeasureList',
    {
      http: {path: '/measurement/singlerecord', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );

  // Completeness
  CollectedDate.SingleRecordCompleteness = function(record,cb) {
    if(typeof record.CollectedDateMeasures == 'undefined')
    record.CollectedDateMeasures = []
    var measure = {}
    measure.input = {}
    measure.input.eventDate = record.eventDate;
    measure.contextualizedDimension = 'Collected Date Completeness of Single Record';
    measure.specification = '';
    measure.mechanism = 'BDQ Toolkit';
    measure.id = crypto.createHash('md5').update(record.eventDate+":"+measure.contextualizedDimension+":"+measure.specification+":"+measure.mechanism).digest("hex");

    if(typeof record.eventDate == 'undefined' || record.eventDate == null){
      measure.assertion = 'Not Complete';
      record.CollectedDateMeasures.push(measure);
      cb(null, record);
    } else if(record.eventDate.toString().trim().length==0) {
      measure.assertion = 'Not Complete';
      record.CollectedDateMeasures.push(measure);
      cb(null, record);
    } else {
      measure.assertion = 'Complete';
      record.CollectedDateMeasures.push(measure);
      cb(null, record);
    }
  };
  CollectedDate.remoteMethod(
    'SingleRecordCompleteness',
    {
      http: {path: '/measurement/singlerecord/completeness', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  CollectedDate.SingleRecordCompletenessList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      CollectedDate.SingleRecordCompleteness(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  CollectedDate.remoteMethod(
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
    CollectedDate.SingleRecordValidation = function(record,cb) {
      CollectedDate.SingleRecordValidationCompleteness(record, function (err, response) {
        CollectedDate.SingleRecordValidationISOCompliance(response, function (err, response) {
          cb(null, response);
        });
      });
    };
    CollectedDate.remoteMethod(
      'SingleRecordValidation',
      {
        http: {path: '/validation/singlerecord', verb: 'get'},
        accepts: [{arg: 'record', type: 'object'}],
        returns: {arg: 'response', type: 'object'}
      }
    );
    CollectedDate.SingleRecordValidationList = function(body,cb) {
      var result = [];
      async.each(body, function iterator(item, callback){
        CollectedDate.SingleRecordValidation(item, function (err, response) {
          result.push(response);
          callback();
        });
      }, function done(){
        cb(null, result);
      });
    };
    CollectedDate.remoteMethod(
      'SingleRecordValidationList',
      {
        http: {path: '/validation/singlerecord', verb: 'post'},
        accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
        returns: {arg: 'response', type: 'object'}
      }
    );

    // Completeness
    CollectedDate.SingleRecordValidationCompleteness = function(record,cb) {
      if(typeof record.CollectedDateValidations == 'undefined')
        record.CollectedDateValidations = []
      var measure = {}
      measure.contextualizedDimension = 'Collected Date Completeness of Single Record';
      measure.specification = '';
      measure.mechanism = 'BDQ Toolkit';
      measure.id = crypto.createHash('md5').update(record.eventDate+":"+measure.contextualizedDimension+":"+measure.specification+":"+measure.mechanism).digest("hex");
      var validation = {}
      validation.input = {}
      validation.input.eventDate = record.eventDate;
      validation.contextualizedCriterion = 'Collected Date of Single Record must be "Complete"';
      validation.specification = '';
      validation.mechanism = 'BDQ Toolkit';
      validation.id = crypto.createHash('md5').update(record.eventDate+":"+validation.contextualizedCriterion+":"+validation.specification+":"+validation.mechanism).digest("hex");

      validation.assertion = 'Not Valid';
      for(var i = 0; i<record.CollectedDateMeasures.length; i++){
        if(record.CollectedDateMeasures[i].contextualizedDimension=='Collected Date Completeness of Single Record'){
          if (record.CollectedDateMeasures[i].assertion=='Complete') {
            validation.assertion = 'Valid';
            break;
          }else{
            validation.assertion = 'Not Valid';
            break;
          }
        }
      }
      record.CollectedDateValidations.push(validation);
      cb(null, record);
    };
    CollectedDate.remoteMethod(
      'SingleRecordValidationCompleteness',
      {
        http: {path: '/validation/singlerecord/completeness', verb: 'get'},
        accepts: [{arg: 'record', type: 'object'}],
        returns: {arg: 'response', type: 'object'}
      }
    );
    CollectedDate.SingleRecordValidationCompletenessList = function(body,cb) {
      var result = [];
      async.each(body, function iterator(item, callback){
        CollectedDate.SingleRecordValidationCompleteness(item, function (err, response) {
          result.push(response);
          callback();
        });
      }, function done(){
        cb(null, result);
      });
    };
    CollectedDate.remoteMethod(
      'SingleRecordValidationCompletenessList',
      {
        http: {path: '/validation/singlerecord/completeness', verb: 'post'},
        accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
        returns: {arg: 'response', type: 'object'}
      }
    );

    // ISO Compliance
    CollectedDate.SingleRecordValidationISOCompliance = function(record,cb) {
      if(typeof record.CollectedDateValidations == 'undefined')
        record.CollectedDateValidations = []
      var validation = {}
      validation.input = {}
      validation.input.eventDate = record.eventDate;
      validation.contextualizedCriterion = 'Collected Date must be according to ISO 8601 standard format.';
      validation.specification = '';
      validation.mechanism = 'BDQ Toolkit';
      validation.id = crypto.createHash('md5').update(record.eventDate+":"+validation.contextualizedCriterion+":"+validation.specification+":"+validation.mechanism).digest("hex");

      validation.assertion = null;
      if(typeof record.eventDate != 'undefined'){
        if(moment(record.eventDate).isValid())
          validation.assertion = 'Valid';
        else
          validation.assertion = 'Not Valid';
      }
      record.CollectedDateValidations.push(validation);
      cb(null, record);
    };
    CollectedDate.remoteMethod(
      'SingleRecordValidationISOCompliance',
      {
        http: {path: '/validation/singlerecord/isocompliance', verb: 'get'},
        accepts: [{arg: 'record', type: 'object'}],
        returns: {arg: 'response', type: 'object'}
      }
    );
    CollectedDate.SingleRecordValidationISOComplianceList = function(body,cb) {
      var result = [];
      async.each(body, function iterator(item, callback){
        CollectedDate.SingleRecordValidationISOCompliance(item, function (err, response) {
          result.push(response);
          callback();
        });
      }, function done(){
        cb(null, result);
      });
    };
    CollectedDate.remoteMethod(
      'SingleRecordValidationISOComplianceList',
      {
        http: {path: '/validation/singlerecord/isocompliance', verb: 'post'},
        accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
        returns: {arg: 'response', type: 'object'}
      }
    );
};
