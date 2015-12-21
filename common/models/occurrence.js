var async = require('async');
var crypto = require('crypto');
var request = require('request');
module.exports = function(Occurrence) {
  /*
  * ASSERTIONS - SINGLE RECORD
  */
  Occurrence.SingleRecordAssertions = function(record,cb) {
    Occurrence.SingleRecordCompleteness(record, function (err, response) {
      Occurrence.SingleRecordValidationCompleteness(response, function (err, response) {
        // Occurrence.SingleRecordAccuracy(response, function (err, response) {
        //   Occurrence.SingleRecordValidationAccuracy(response, function (err, response) {
            cb(null, response);
        //   });
        // });
      });
    });
  };
  Occurrence.remoteMethod(
    'SingleRecordAssertions',
    {
      http: {path: '/assertions/singlerecord', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  Occurrence.SingleRecordAssertionsList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      Occurrence.SingleRecordAssertions(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  Occurrence.remoteMethod(
    'SingleRecordAssertionsList',
    {
      http: {path: '/assertions/singlerecord', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );

  // Completeness
  Occurrence.SingleRecordCompleteness = function(record,cb) {
    if(typeof record.OccurrenceMeasures == 'undefined')
      record.OccurrenceMeasures = []
    var measure = {}
    measure.input = {}
    measure.input.decimalLatitude = record.decimalLatitude;
    measure.input.decimalLongitude = record.decimalLongitude;
    measure.input.scientificName = record.scientificName;
    measure.input.scientificNameAuthorship = record.scientificNameAuthorship;
    //measure.input.originalScientificNameAuthorship = record.originalScientificNameAuthorship;
    measure.input.eventDate = record.eventDate;
    measure.contextualizedDimension = 'Occurrence Completeness of Single Record';
    measure.specification = '';
    measure.mechanism = 'BDQ Toolkit';
    measure.id = crypto.createHash('md5').update(record.eventDate+":"+record.scientificNameAuthorship+":"+record.scientificName+":"+record.decimalLatitude+":"+record.decimalLongitude+":"+measure.contextualizedDimension+":"+measure.specification+":"+measure.mechanism).digest("hex");

    var Coordinates = Object.create(Occurrence.app.models.Coordinates);
    var SciName = Object.create(Occurrence.app.models.SciName);
    var CollectedDate = Object.create(Occurrence.app.models.CollectedDate);
    Coordinates.SingleRecordCompleteness(Object.create(record), function(err, coordinatesCompleteness){
      if(coordinatesCompleteness.coordinatesMeasures[0].assertion != "Complete"){
        measure.assertion = 'Not Complete';
        record.OccurrenceMeasures.push(measure);
        cb(null, record);
      }else{
        SciName.SingleRecordCompleteness(Object.create(record), function(err, sciNameCompleteness){
          if(sciNameCompleteness.SciNameMeasures[0].assertion != "Complete"){
            measure.assertion = 'Not Complete';
            record.OccurrenceMeasures.push(measure);
            cb(null, record);
          }else{
            CollectedDate.SingleRecordCompleteness(Object.create(record), function(err, collectedDateNameCompleteness){
              if(collectedDateNameCompleteness.CollectedDateMeasures[0].assertion != "Complete"){
                measure.assertion = 'Not Complete';
                record.OccurrenceMeasures.push(measure);
                cb(null, record);
              }else{
                measure.assertion = 'Complete';
                record.OccurrenceMeasures.push(measure);
                cb(null, record);
              }
            });
          }
        });
      }
    });
  };
  Occurrence.remoteMethod(
    'SingleRecordCompleteness',
    {
      http: {path: '/measurement/singlerecord/completeness', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  // Completeness
  Occurrence.SingleRecordAccuracy = function(record,cb) {
    if(typeof record.OccurrenceMeasures == 'undefined')
      record.OccurrenceMeasures = []
    var measure = {}
    measure.input = {}
    measure.input.decimalLatitude = record.decimalLatitude;
    measure.input.decimalLongitude = record.decimalLongitude;
    measure.input.scientificName = record.scientificName;
    measure.input.scientificNameAuthorship = record.scientificNameAuthorship;
    //measure.input.originalScientificNameAuthorship = record.originalScientificNameAuthorship;
    measure.input.eventDate = record.eventDate;
    measure.contextualizedDimension = 'Occurrence Accuracy of Single Record';
    measure.specification = '';
    measure.mechanism = 'BDQ Toolkit';
    measure.id = crypto.createHash('md5').update(record.eventDate+":"+record.scientificNameAuthorship+":"+record.scientificName+":"+record.decimalLatitude+":"+record.decimalLongitude+":"+measure.contextualizedDimension+":"+measure.specification+":"+measure.mechanism).digest("hex");

    var Coordinates = Occurrence.app.models.Coordinates;
    var SciName = Occurrence.app.models.SciName;
    var CollectedDate = Occurrence.app.models.CollectedDate;
    Coordinates.SingleRecordConsistency(Object.create(record), function(err, coordinatesConsistency){
      if(coordinatesConsistency.coordinatesMeasures[0].assertion != "Consistent"){
        measure.assertion = 'Not Accurate';
        record.OccurrenceMeasures.push(measure);
        cb(null, record);
      }else{
        SciName.SingleRecordAccuracy(Object.create(record), function(err, sciNameAccuracy){
          if(sciNameAccuracy.SciNameMeasures[0].assertion != "Accurate"){
            measure.assertion = 'Not Accurate';
            record.OccurrenceMeasures.push(measure);
            cb(null, record);
          }else{
            CollectedDate.SingleRecordConsistency(Object.create(record), function(err, collectedDateNameConsitency){
              if(collectedDateNameConsistency.CollectedDateMeasures[0].assertion != "Consistent"){
                measure.assertion = 'Not Accurate';
                record.OccurrenceMeasures.push(measure);
                cb(null, record);
              }else{
                measure.assertion = 'Accurate';
                record.OccurrenceMeasures.push(measure);
                cb(null, record);
              }
            });
          }
        });
      }
    });
  };
  Occurrence.remoteMethod(
    'SingleRecordAccuracy',
    {
      http: {path: '/measurement/singlerecord/accuracy', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  Occurrence.SingleRecordCompletenessList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      Occurrence.SingleRecordCompleteness(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  Occurrence.remoteMethod(
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
  Occurrence.SingleRecordValidation = function(record,cb) {
    Occurrence.SingleRecordValidationCompleteness(record, function (err, response) {
      cb(null, response);
    });
  };
  Occurrence.remoteMethod(
    'SingleRecordValidation',
    {
      http: {path: '/validation/singlerecord', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  Occurrence.SingleRecordValidationList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      Occurrence.SingleRecordValidation(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  Occurrence.remoteMethod(
    'SingleRecordValidationList',
    {
      http: {path: '/validation/singlerecord', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );

  // Completeness
  Occurrence.SingleRecordValidationCompleteness = function(record,cb) {
    if(typeof record.OccurrenceValidations == 'undefined')
      record.OccurrenceValidations = []
    var measure = {}
    measure.contextualizedDimension = 'Occurrence Completeness of Single Record';
    measure.specification = '';
    measure.mechanism = 'BDQ Toolkit';
    measure.id = crypto.createHash('md5').update(record.eventDate+":"+record.scientificNameAuthorship+":"+record.scientificName+":"+record.decimalLatitude+":"+record.decimalLongitude+":"+measure.contextualizedDimension+":"+measure.specification+":"+measure.mechanism).digest("hex");
    var validation = {}
    validation.input = {}
    validation.input.scientificName = record.scientificName;
    validation.input.scientificNameAuthorship = record.scientificNameAuthorship;
    //validation.input.origialScientificNameAuthorship = record.origialScientificNameAuthorship;
    validation.contextualizedCriterion = 'Occurrence of Single Record must be "Complete"';
    validation.specification = '';
    validation.mechanism = 'BDQ Toolkit';
    validation.id = crypto.createHash('md5').update(record.scientificName+":"+record.scientificNameAuthorship+":"+validation.contextualizedCriterion+":"+validation.specification+":"+validation.mechanism).digest("hex");

    validation.assertion = null;
    if(typeof record.OccurrenceMeasures == 'undefined' || !Array.isArray(record.OccurrenceMeasures)){
      record.OccurrenceValidations.push(validation);
      cb(null, record);
    } else {
      for(var i = 0; i<record.OccurrenceMeasures.length; i++){
        if(record.OccurrenceMeasures[i].id==measure.id){
          if (record.OccurrenceMeasures[i].assertion=='Complete') {
            validation.assertion = 'Valid';
            break;
          }else{
            validation.assertion = 'Not Valid';
            break;
          }
        }
      }
      record.OccurrenceValidations.push(validation);
      cb(null, record);
    }
  };
  Occurrence.remoteMethod(
    'SingleRecordValidationCompleteness',
    {
      http: {path: '/validation/singlerecord/completeness', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  // Completeness
  Occurrence.SingleRecordValidationAccuracy = function(record,cb) {
    if(typeof record.OccurrenceValidations == 'undefined')
      record.OccurrenceValidations = []
    var measure = {}
    measure.contextualizedDimension = 'Occurrence Accuracy of Single Record';
    measure.specification = '';
    measure.mechanism = 'BDQ Toolkit';
    measure.id = crypto.createHash('md5').update(record.eventDate+":"+record.scientificNameAuthorship+":"+record.scientificName+":"+record.decimalLatitude+":"+record.decimalLongitude+":"+measure.contextualizedDimension+":"+measure.specification+":"+measure.mechanism).digest("hex");
    var validation = {}
    validation.input = {}
    validation.input.scientificName = record.scientificName;
    validation.input.scientificNameAuthorship = record.scientificNameAuthorship;
    //validation.input.origialScientificNameAuthorship = record.origialScientificNameAuthorship;
    validation.contextualizedCriterion = 'Occurrence of Single Record must be "Accurate"';
    validation.specification = '';
    validation.mechanism = 'BDQ Toolkit';
    validation.id = crypto.createHash('md5').update(record.scientificName+":"+record.scientificNameAuthorship+":"+validation.contextualizedCriterion+":"+validation.specification+":"+validation.mechanism).digest("hex");

    validation.assertion = null;
    if(typeof record.OccurrenceMeasures == 'undefined' || !Array.isArray(record.OccurrenceMeasures)){
      record.OccurrenceValidations.push(validation);
      cb(null, record);
    } else {
      for(var i = 0; i<record.OccurrenceMeasures.length; i++){
        if(record.OccurrenceMeasures[i].id==measure.id){
          if (record.OccurrenceMeasures[i].assertion=='Accurate') {
            validation.assertion = 'Valid';
            break;
          }else{
            validation.assertion = 'Not Valid';
            break;
          }
        }
      }
      record.OccurrenceValidations.push(validation);
      cb(null, record);
    }
  };
  Occurrence.remoteMethod(
    'SingleRecordValidationAccuracy',
    {
      http: {path: '/validation/singlerecord/accuracy', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  Occurrence.SingleRecordValidationCompletenessList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      Occurrence.SingleRecordValidationCompleteness(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  Occurrence.remoteMethod(
    'SingleRecordValidationCompletenessList',
    {
      http: {path: '/validation/singlerecord/completeness', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );

  /*
  * IMPROVEMENT
  */
  /*
  * SINGLE RECORD
  */
  Occurrence.SingleRecordAcceptRecommendation = function(record,cb) {
    if(typeof record.improvements == 'undefined')
      cb(null, record);
    else {
      if(typeof record.improvements.ce1 != 'undefined'){
        record.dataResource.value.rawScientificName = record.dataResource.value.scientificName
        record.dataResource.value.rawScientificNameAuthorship = record.dataResource.value.scientificNameAuthorship
        record.dataResource.value.scientificName = record.improvements.ce1.assertion.scientificName
        record.dataResource.value.scientificNameAuthorship = record.improvements.ce1.assertion.scientificNameAuthorship
        delete record.improvements.ce1
        record.measures.cd8.assertion = 'Accurate'
        record.validations.cc8.assertion = 'Compliant'
        record.measures.cd7.assertion = 'Complete'
        record.validations.cc7.assertion = 'Compliant'
      }
      if(typeof record.improvements.ce2 != 'undefined'){
        record.dataResource.value.rawEventDate = record.dataResource.value.eventDate
        record.dataResource.value.eventDate = record.improvements.ce2.assertion.eventDate
        delete record.improvements.ce2
        record.measures.cd12.assertion = 'Consistent'
        record.validations.cc12.assertion = 'Compliant'
        record.validations.cc17.assertion = 'Compliant'
        record.measures.cd11.assertion = 'Complete'
        record.validations.cc11.assertion = 'Compliant'
      }
      if(typeof record.improvements.ce3 != 'undefined'){
        record.dataResource.value.rawDecimalLatitude = record.dataResource.value.decimalLatitude
        record.dataResource.value.rawDecimalLongitude = record.dataResource.value.decimalLongitude
        record.dataResource.value.decimalLatitude = record.improvements.ce3.assertion.decimalLatitude
        record.dataResource.value.decimalLongitude = record.improvements.ce3.assertion.decimalLongitude
        delete record.improvements.ce3
        record.measures.cd3.assertion = 'Consistent'
        record.validations.cc3.assertion = 'Compliant'
        record.measures.cd2.assertion = 'Complete'
        record.validations.cc2.assertion = 'Compliant'
        var Coordinates = Occurrence.app.models.Coordiantes;
        Coordinates.SingleRecordNumericalPrecision(Object.create(record.dataResource.value),function (err,response) {
          record.measures.cd1.assertion = response.coordinatesMeasures[0].assertion
          Coordinates.SingleRecordValidationNumericalPrecision(Object.create(record.dataResource.value),function (err,response) {
            record.validations.cc1.assertion = response.coordinatesValidations[0].assertion
            record.measures.cd15.assertion = record.measures.cd2.assertion=='Complete' && record.measures.cd11.assertion=='Complete' && record.measures.cd7.assertion=='Complete'?'Complete':'Not Complete';
            record.validations.cc15.assertion = record.measures.cd15.assertion=='Complete'?'Compliant':'Not Compliant'
            record.measures.cd17.assertion = (record.measures.cd3.assertion=='Consistent'&&record.measures.cd12.assertion=='Consistent'&&record.measures.cd8.assertion=='Accurate')?'Accurate':'Not Accurate'
            record.validations.cc18.assertion = (record.measures.cd17.assertion=='Accurate')?'Compliant':'Not Compliant'
            cb(null, record);
          })
        })
      } else {
          record.measures.cd15.assertion = record.measures.cd2.assertion=='Complete' && record.measures.cd11.assertion=='Complete' && record.measures.cd7.assertion=='Complete'?'Complete':'Not Complete';
          record.validations.cc15.assertion = record.measures.cd15.assertion=='Complete'?'Compliant':'Not Compliant'
          record.measures.cd17.assertion = (record.measures.cd3.assertion=='Consistent'&&record.measures.cd12.assertion=='Consistent'&&record.measures.cd8.assertion=='Accurate')?'Accurate':'Not Accurate'
          record.validations.cc18.assertion = (record.measures.cd17.assertion=='Accurate')?'Compliant':'Not Compliant'
          cb(null, record);
      }
    }
  };
  Occurrence.remoteMethod(
    'SingleRecordAcceptRecommendation',
    {
      http: {path: '/improvement/singlerecord/acceptrecommendation', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  Occurrence.SingleRecordAcceptRecommendationList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      Occurrence.SingleRecordAcceptRecommendation(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  Occurrence.remoteMethod(
    'SingleRecordAcceptRecommendationList',
    {
      http: {path: '/improvement/singlerecord/acceptrecommendation', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );

  /*
  * DATASET
  */
  Occurrence.DatasetAcceptRecommendation = function(url,cb) {
    //url = url + "?filter[limit]=5";
    request({
        url: url,
        method: 'GET',
      }, function (error, response, body) {
        var result = [];
        var records = JSON.parse(body);
        async.each(records, function iterator(item, callback){
          if(item.dataResource.resourceType=='Single Record'){
            Occurrence.SingleRecordAcceptRecommendation(item, function (err, response) {
              result.push(response);
              callback()
            });
          }else callback()
        }, function done(){
          cb(null, result);
        });
      });
  };
  Occurrence.remoteMethod(
    'DatasetAcceptRecommendation',
    {
      http: {path: '/improvement/dataset/acceptrecommendation', verb: 'get'},
      accepts: [{arg: 'url', type: 'string'}],
      returns: {arg: 'response', type: 'object'}
    }
  );

  /*
  * DATASET
  */
  Occurrence.DatasetFilter = function(url,cb) {
    //url = url + "?filter[limit]=5";
    request({
        url: url,
        method: 'GET',
      }, function (error, response, body) {
        var result = [];
        var records = JSON.parse(body);
        records.forEach(function iterator(item, callback){
          if(item.dataResource.resourceType == 'Single Record'){
            if( item.validations.cc1.assertion=='Compliant' &&
                item.validations.cc2.assertion=='Compliant' &&
                item.validations.cc3.assertion=='Compliant' &&
                item.validations.cc7.assertion=='Compliant' &&
                item.validations.cc8.assertion=='Compliant' &&
                item.validations.cc11.assertion=='Compliant' &&
                item.validations.cc12.assertion=='Compliant' &&
                item.validations.cc15.assertion=='Compliant' &&
                item.validations.cc17.assertion=='Compliant' &&
                item.validations.cc18.assertion=='Compliant'
              )
                result.push(item);
          }
        });
        cb(null, result);
      });
  };
  Occurrence.remoteMethod(
    'DatasetFilter',
    {
      http: {path: '/improvement/dataset/filter', verb: 'get'},
      accepts: [{arg: 'url', type: 'string'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
};
