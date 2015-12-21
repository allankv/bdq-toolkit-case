var async = require('async');
var request = require('request');
module.exports = function(Record) {
  Record.SingleRecordAssertions = function(record,cb) {
    var Coordinates = Record.app.models.Coordinates;
    var SciName = Record.app.models.SciName;
    var CollectedDate = Record.app.models.CollectedDate;
    var Occurrence = Record.app.models.Occurrence;
    var output = Object.create(record)
    output.id = record.id
    Coordinates.SingleRecordAssertions(Object.create(record), function (err, response1) {
      output.coordinatesMeasures =response1.coordinatesMeasures
      output.coordinatesValidations =response1.coordinatesValidations
      SciName.SingleRecordAssertions(Object.create(record), function (err, response2) {
        output.SciNameMeasures = response2.SciNameMeasures
        output.SciNameValidations =response2.SciNameValidations
        CollectedDate.SingleRecordAssertions(Object.create(record), function (err, response3) {
          output.CollectedDateMeasures = response3.CollectedDateMeasures
          output.CollectedDateValidations =response3.CollectedDateValidations
          Occurrence.SingleRecordAssertions(Object.create(record), function (err, response4) {
            output.OccurrenceMeasures = response4.OccurrenceMeasures
            output.OccurrenceValidations =response4.OccurrenceValidations
            cb(null, output);
          });
        });
      });
    });
  };
  Record.remoteMethod(
    'SingleRecordAssertions',
    {
      http: {path: '/assertions/singlerecord', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  Record.SingleRecordAssertionsList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      Record.SingleRecordAssertions(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  Record.remoteMethod(
    'SingleRecordAssertionsList',
    {
      http: {path: '/assertions/singlerecord', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );

  /*
  * DATASET
  */
  Record.DatasetAssertions = function(url,cb) {
    //url = url + "?filter[limit]=60000";
    request({
        url: url,
        method: 'GET',
      }, function (error, response, body) {
        var result = {};
        result.id = url;
        result.measures = {}
        result.validations = {}

        result.measures.coordinatesCompleteness = 0;
        result.measures.coordinatesNumericalPrecision = 0;
        result.measures.coordinatesStatedPrecision = {};
        result.measures.coordinatesStatedPrecision.assertion = 0;
        result.measures.coordinatesStatedPrecision.determined = 0;
        result.measures.coordinatesStatedPrecision.undetermined = 0;

        result.measures.sciNameCompleteness = {}
        result.measures.sciNameCompleteness = 0;
        // result.measures.sciNameCompleteness.partialComplete = 0;
        // result.measures.sciNameCompleteness.notComplete = 0;

        result.measures.collectedDateCompleteness = 0

        result.measures.occurrenceCompleteness = 0
        //result.measures.occurrenceAccuracy = 0

        var records = JSON.parse(body);
        async.each(records, function iterator(item, callback){
          Record.SingleRecordAssertions(item, function (err, response) {
            if(response.coordinatesMeasures[0].assertion=="Complete")
              result.measures.coordinatesCompleteness++;
            if(response.coordinatesMeasures[1].assertion)
              result.measures.coordinatesNumericalPrecision = result.measures.coordinatesNumericalPrecision + response.coordinatesMeasures[1].assertion;

            // if(response.coordinatesMeasures[2].assertion){
            //   result.measures.coordinatesStatedPrecision.assertion = result.measures.coordinatesStatedPrecision.assertion + response.coordinatesMeasures[2].assertion;
            //   result.measures.coordinatesStatedPrecision.determined++;
            // }else{
            //   result.measures.coordinatesStatedPrecision.undetermined++;
            // }

            if(response.SciNameMeasures[0].assertion=="Complete")
              result.measures.sciNameCompleteness++;

              result.measures.sciNameCompleteness.notComplete++;

            if(response.CollectedDateMeasures[0].assertion=="Complete")
              result.measures.collectedDateCompleteness++;

            if(response.OccurrenceMeasures[0].assertion=="Complete")
              result.measures.occurrenceCompleteness++;

            // if(response.OccurrenceMeasures[1].assertion=="Accurate")
            //   result.measures.occurrenceAccuracy++;

            callback();
          });
        }, function done(){

          // result.measures.coordinatesStatedPrecision.assertion = result.measures.coordinatesStatedPrecision.assertion/records.length;
          // result.measures.coordinatesStatedPrecision.determined = result.measures.coordinatesStatedPrecision.determined/records.length;
          // result.measures.coordinatesStatedPrecision.undetermined = result.measures.coordinatesStatedPrecision.undetermined/records.length;
          result.measures.coordinatesNumericalPrecision = result.measures.coordinatesNumericalPrecision/records.length;
          result.measures.coordinatesCompleteness = result.measures.coordinatesCompleteness/records.length;

          result.measures.sciNameCompleteness = result.measures.sciNameCompleteness/records.length;
          // result.measures.sciNameCompleteness.partialComplete = result.measures.sciNameCompleteness.partialComplete/records.length;
          // result.measures.sciNameCompleteness.notComplete = result.measures.sciNameCompleteness.notComplete/records.length;

          result.measures.collectedDateCompleteness = result.measures.collectedDateCompleteness/records.length;

          result.measures.occurrenceCompleteness = result.measures.occurrenceCompleteness/records.length;
          // result.measures.occurrenceAccuracy = result.measures.occurrenceAccuracy/records.length;


          result.validations.coordinatesCompleteness = {};
          result.validations.coordinatesCompleteness.criterion = "Coordinates must be 100% complete.";
          result.validations.coordinatesCompleteness.specification = "";
          result.validations.coordinatesCompleteness.mechanism = "BDQ Toolkit";
          result.validations.coordinatesCompleteness.assertion = result.measures.coordinatesCompleteness==1?"Valid":"Not Valid";

          result.validations.coordinatesNumericalPrecision = {};
          result.validations.coordinatesNumericalPrecision.criterion = "Coordinates must have numerical precision higher than 5.";
          result.validations.coordinatesNumericalPrecision.specification = "";
          result.validations.coordinatesNumericalPrecision.mechanism = "BDQ Toolkit";
          result.validations.coordinatesNumericalPrecision.assertion = result.measures.coordinatesNumericalPrecision>5?"Valid":"Not Valid";

          result.validations.sciNameCompleteness = {};
          result.validations.sciNameCompleteness.criterion = "SciName must be 100% complete.";
          result.validations.sciNameCompleteness.specification = "";
          result.validations.sciNameCompleteness.mechanism = "BDQ Toolkit";
          result.validations.sciNameCompleteness.assertion = result.measures.sciNameCompleteness==1?"Valid":"Not Valid";

          result.validations.collectedDateCompleteness = {};
          result.validations.collectedDateCompleteness.criterion = "Collected date must be 100% complete.";
          result.validations.collectedDateCompleteness.specification = "";
          result.validations.collectedDateCompleteness.mechanism = "BDQ Toolkit";
          result.validations.collectedDateCompleteness.assertion = result.measures.collectedDateCompleteness==1?"Valid":"Not Valid";

          result.validations.occurrenceCompleteness = {};
          result.validations.occurrenceCompleteness.criterion = "Occurrence must be 100% complete.";
          result.validations.occurrenceCompleteness.specification = "";
          result.validations.occurrenceCompleteness.mechanism = "BDQ Toolkit";
          result.validations.occurrenceCompleteness.assertion = result.measures.occurrenceCompleteness==1?"Valid":"Not Valid";

          // result.validations.occurrenceAccuracy = {};
          // result.validations.occurrenceAccuracy.criterion = "Occurrence must be 100% Accurate.";
          // result.validations.occurrenceAccuracy.specification = "";
          // result.validations.occurrenceAccuracy.mechanism = "BDQ Toolkit";
          // result.validations.occurrenceAccuracy.assertion = result.measures.occurrenceAccuracy==1?"Valid":"Not Valid";

          cb(null, result);
        });
      });
  };
  Record.remoteMethod(
    'DatasetAssertions',
    {
      http: {path: '/assertions/dataset', verb: 'get'},
      accepts: [{arg: 'url', type: 'string'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
};
