
var async = require('async');
var crypto = require('crypto');
module.exports = function(Coordinates) {
  /*
  * ASSERTIONS - SINGLE RECORD
  */
  Coordinates.SingleRecordAssertions = function(record,cb) {
    Coordinates.SingleRecordCompleteness(record, function (err, response) {
      Coordinates.SingleRecordNumericalPrecision(response, function (err, response) {
        //Coordinates.SingleRecordStatedPrecision(response, function (err, response) {
          Coordinates.SingleRecordValidationCompleteness(response, function (err, response) {
            Coordinates.SingleRecordValidationNumericalPrecision(response, function (err, response) {
              //Coordinates.SingleRecordValidationStatedPrecision(response, function (err, response) {
                cb(null, response);
              //});
            });
          });
        //});
      });
    });
  };
  Coordinates.remoteMethod(
    'SingleRecordAssertions',
    {
      http: {path: '/assertions/singlerecord', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  Coordinates.SingleRecordAssertionsList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      Coordinates.SingleRecordAssertions(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  Coordinates.remoteMethod(
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
  Coordinates.SingleRecordMeasure = function(record,cb) {
    Coordinates.SingleRecordCompleteness(record, function (err, response) {
      Coordinates.SingleRecordNumericalPrecision(response, function (err, response) {
        Coordinates.SingleRecordStatedPrecision(response, function (err, response) {
          cb(null, response);
        });
      });
    });
  };
  Coordinates.remoteMethod(
    'SingleRecordMeasure',
    {
      http: {path: '/measurement/singlerecord', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  Coordinates.SingleRecordMeasureList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      Coordinates.SingleRecordMeasure(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  Coordinates.remoteMethod(
    'SingleRecordMeasureList',
    {
      http: {path: '/measurement/singlerecord', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );

  // Completeness
  Coordinates.SingleRecordCompleteness = function(record,cb) {
    if(typeof record.coordinatesMeasures == 'undefined')
    record.coordinatesMeasures = []
    var measure = {}
    measure.input = {}
    measure.input.decimalLatitude = record.decimalLatitude;
    measure.input.decimalLongitude = record.decimalLongitude;
    measure.contextualizedDimension = 'Coordinates Completeness of Single Record';
    measure.specification = '';
    measure.mechanism = 'BDQ Toolkit';
    measure.id = crypto.createHash('md5').update(record.decimalLatitude+":"+record.decimalLongitude+":"+measure.contextualizedDimension+":"+measure.specification+":"+measure.mechanism).digest("hex");

    if(typeof record.decimalLatitude == 'undefined' || typeof record.decimalLongitude == 'undefined' ||
    (parseFloat(record.decimalLatitude)==0 && parseFloat(record.decimalLongitude)==0) ||
    record.decimalLatitude.toString().trim().length==0 || record.decimalLongitude.toString().trim().length==0 ){
      measure.assertion = 'Not Complete';
      record.coordinatesMeasures.push(measure);
      cb(null, record);
    } else {
      measure.assertion = 'Complete';
      record.coordinatesMeasures.push(measure);
      cb(null, record);
    }
  };
  Coordinates.remoteMethod(
    'SingleRecordCompleteness',
    {
      http: {path: '/measurement/singlerecord/completeness', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  Coordinates.SingleRecordCompletenessList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      Coordinates.SingleRecordCompleteness(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  Coordinates.remoteMethod(
    'SingleRecordCompletenessList',
    {
      http: {path: '/measurement/singlerecord/completeness', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );

  // Numerical Precision
  Coordinates.SingleRecordNumericalPrecision = function(record,cb) {
    if(typeof record.coordinatesMeasures == 'undefined')
      record.coordinatesMeasures = []
    var measure = {}
    measure.input = {}
    measure.input.decimalLatitude = record.decimalLatitude;
    measure.input.decimalLongitude = record.decimalLongitude;
    measure.contextualizedDimension = 'Coordinates Numerical Precision of Single Record';
    measure.specification = '';
    measure.mechanism = 'BDQ Toolkit';
    measure.id = crypto.createHash('md5').update(record.decimalLatitude+":"+record.decimalLongitude+":"+measure.contextualizedDimension+":"+measure.specification+":"+measure.mechanism).digest("hex");

    if(typeof record.decimalLatitude == 'undefined' || typeof record.decimalLongitude == 'undefined' ||
      record.decimalLatitude.toString().trim().length==0 || record.decimalLongitude.toString().trim().length==0){
        measure.assertion = null;
        record.coordinatesMeasures.push(measure);
        cb(null, record);
    } else {
        var latMeasure = parseFloat(record.decimalLatitude).toString().split(".")[1];
        latMeasure = typeof latMeasure == 'undefined'?0:latMeasure.length;

        var lngMeasure = parseFloat(record.decimalLongitude).toString().split(".")[1];
        lngMeasure = typeof lngMeasure == 'undefined'?0:lngMeasure.length;

        measure.assertion = (latMeasure+lngMeasure)/2;

        record.coordinatesMeasures.push(measure);
        cb(null, record);
    }
  };
  Coordinates.remoteMethod(
    'SingleRecordNumericalPrecision',
    {
      http: {path: '/measurement/singlerecord/numericalprecision', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  Coordinates.SingleRecordNumericalPrecisionList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      Coordinates.SingleRecordNumericalPrecision(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  Coordinates.remoteMethod(
    'SingleRecordNumericalPrecisionList',
    {
      http: {path: '/measurement/singlerecord/numericalprecision', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );

  // Stated Precision
  Coordinates.SingleRecordStatedPrecision = function(record,cb) {
    if(typeof record.coordinatesMeasures == 'undefined')
      record.coordinatesMeasures = []
    var measure = {}
    measure.input = {}
    measure.input.coordinateUncertaintyInMeters = record.coordinateUncertaintyInMeters;
    measure.contextualizedDimension = 'Coordinates Stated Precision of Single Record';
    measure.specification = '';
    measure.mechanism = 'BDQ Toolkit';
    measure.id = crypto.createHash('md5').update(record.coordinateUncertaintyInMeters+":"+measure.contextualizedDimension+":"+measure.specification+":"+measure.mechanism).digest("hex");

    if(typeof record.coordinateUncertaintyInMeters == 'undefined' ||
      record.coordinateUncertaintyInMeters.toString().trim().length==0 ||
      !(parseFloat(record.coordinateUncertaintyInMeters.toString())>0) ){
        measure.assertion = null;
        record.coordinatesMeasures.push(measure);
        cb(null, record);
    } else {
        measure.assertion = parseFloat(record.coordinateUncertaintyInMeters.toString());
        record.coordinatesMeasures.push(measure);
        cb(null, record);
    }
  };
  Coordinates.remoteMethod(
    'SingleRecordStatedPrecision',
    {
      http: {path: '/measurement/singlerecord/statedprecision', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  Coordinates.SingleRecordStatedPrecisionList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      Coordinates.SingleRecordStatedPrecision(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  Coordinates.remoteMethod(
    'SingleRecordStatedPrecisionList',
    {
      http: {path: '/measurement/singlerecord/statedprecision', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );


  /*
  * VALIDATION - SINGLE RECORD
  */
  Coordinates.SingleRecordValidation = function(record,cb) {
    Coordinates.SingleRecordValidationCompleteness(record, function (err, response) {
      Coordinates.SingleRecordValidationNumericalPrecision(response, function (err, response) {
        Coordinates.SingleRecordValidationStatedPrecision(response, function (err, response) {
          cb(null, response);
        });
      });
    });
  };
  Coordinates.remoteMethod(
    'SingleRecordValidation',
    {
      http: {path: '/validation/singlerecord', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  Coordinates.SingleRecordValidationList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      Coordinates.SingleRecordValidation(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  Coordinates.remoteMethod(
    'SingleRecordValidationList',
    {
      http: {path: '/validation/singlerecord', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );

  // Completeness
  Coordinates.SingleRecordValidationCompleteness = function(record,cb) {
    if(typeof record.coordinatesValidations == 'undefined')
      record.coordinatesValidations = []
    var measure = {}
    measure.contextualizedDimension = 'Coordinates Completeness of Single Record';
    measure.specification = '';
    measure.mechanism = 'BDQ Toolkit';
    measure.id = crypto.createHash('md5').update(record.decimalLatitude+":"+record.decimalLongitude+":"+measure.contextualizedDimension+":"+measure.specification+":"+measure.mechanism).digest("hex");
    var validation = {}
    validation.input = {}
    validation.input.decimalLatitude = record.decimalLatitude;
    validation.input.decimalLongitude = record.decimalLongitude;
    validation.contextualizedCriterion = 'Coordinates of Single Record must be "Complete"';
    validation.specification = '';
    validation.mechanism = 'BDQ Toolkit';
    validation.id = crypto.createHash('md5').update(record.decimalLatitude+":"+record.decimalLongitude+":"+validation.contextualizedCriterion+":"+validation.specification+":"+validation.mechanism).digest("hex");

    validation.assertion = null;
    if(typeof record.coordinatesMeasures == 'undefined' || !Array.isArray(record.coordinatesMeasures)){
      record.coordinatesValidations.push(validation);
      cb(null, record);
    } else {
      for(var i = 0; i<record.coordinatesMeasures.length; i++){
        if(record.coordinatesMeasures[i].id==measure.id){
          if(record.coordinatesMeasures[i].assertion == null){
            validation.assertion = null;
            break;
          }else if (record.coordinatesMeasures[i].assertion=='Complete') {
            validation.assertion = 'Valid';
            break;
          }else{
            validation.assertion = 'Not Valid';
            break;
          }
        }
      }
      record.coordinatesValidations.push(validation);
      cb(null, record);
    }
  };
  Coordinates.remoteMethod(
    'SingleRecordValidationCompleteness',
    {
      http: {path: '/validation/singlerecord/completeness', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  Coordinates.SingleRecordValidationCompletenessList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      Coordinates.SingleRecordValidationCompleteness(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  Coordinates.remoteMethod(
    'SingleRecordValidationCompletenessList',
    {
      http: {path: '/validation/singlerecord/completeness', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );

  // Numerical Precision
  Coordinates.SingleRecordValidationNumericalPrecision = function(record,cb) {
    if(typeof record.coordinatesValidations == 'undefined')
      record.coordinatesValidations = []
    var measure = {}
    measure.contextualizedDimension = 'Coordinates Numerical Precision of Single Record';
    measure.specification = '';
    measure.mechanism = 'BDQ Toolkit';
    measure.id = crypto.createHash('md5').update(record.decimalLatitude+":"+record.decimalLongitude+":"+measure.contextualizedDimension+":"+measure.specification+":"+measure.mechanism).digest("hex");
    var validation = {}
    validation.input = {}
    validation.input.decimalLatitude = record.decimalLatitude;
    validation.input.decimalLongitude = record.decimalLongitude;
    validation.contextualizedCriterion = 'Coordinates Numerical Precision of Single Record must higher then 4';
    validation.specification = '';
    validation.mechanism = 'BDQ Toolkit';
    validation.id = crypto.createHash('md5').update(record.decimalLatitude+":"+record.decimalLongitude+":"+validation.contextualizedCriterion+":"+validation.specification+":"+validation.mechanism).digest("hex");

    validation.assertion = null;
    if(typeof record.coordinatesMeasures == 'undefined' || !Array.isArray(record.coordinatesMeasures)){
      record.coordinatesValidations.push(validation);
      cb(null, record);
    } else {
      for(var i = 0; i < record.coordinatesMeasures.length; i++){
        if(record.coordinatesMeasures[i].id==measure.id){
          if(record.coordinatesMeasures[i].assertion == null){
            validation.assertion = null;
            break;
          }else if (record.coordinatesMeasures[i].assertion>4) {
            validation.assertion = 'Valid';
            break;
          }else{
            validation.assertion = 'Not Valid';
            break;
          }
        }
      }
      record.coordinatesValidations.push(validation);
      cb(null, record);
    }
  };
  Coordinates.remoteMethod(
    'SingleRecordValidationNumericalPrecision',
    {
      http: {path: '/validation/singlerecord/numericalprecision', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  Coordinates.SingleRecordValidationNumericalPrecisionList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      Coordinates.SingleRecordNumericalPrecision(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  Coordinates.remoteMethod(
    'SingleRecordValidationNumericalPrecisionList',
    {
      http: {path: '/validation/singlerecord/numericalprecision', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );

  // Stated Precision
  Coordinates.SingleRecordValidationStatedPrecision = function(record,cb) {
    if(typeof record.coordinatesValidations == 'undefined')
      record.coordinatesValidations = []
    var measure = {}
    measure.contextualizedDimension = 'Coordinates Stated Precision of Single Record';
    measure.specification = '';
    measure.mechanism = 'BDQ Toolkit';
    measure.id = crypto.createHash('md5').update(record.coordinateUncertaintyInMeters+":"+measure.contextualizedDimension+":"+measure.specification+":"+measure.mechanism).digest("hex");
    var validation = {}
    validation.input = {}
    validation.input.coordinateUncertaintyInMeters = record.coordinateUncertaintyInMeters;
    validation.contextualizedCriterion = 'Coordinates Stated Precision of Single Record must lower then 1000';
    validation.specification = '';
    validation.mechanism = 'BDQ Toolkit';
    validation.id = crypto.createHash('md5').update(record.coordinateUncertaintyInMeters+":"+validation.contextualizedCriterion+":"+validation.specification+":"+validation.mechanism).digest("hex");

    validation.assertion = null;
    if(typeof record.coordinatesMeasures == 'undefined' || !Array.isArray(record.coordinatesMeasures)){
      record.coordinatesValidations.push(validation);
      cb(null, record);
    } else {
      for(var i = 0; i < record.coordinatesMeasures.length; i++){
        if(record.coordinatesMeasures[i].id==measure.id){
          if(record.coordinatesMeasures[i].assertion == null){
            validation.assertion = 'Not Valid';
            break;
          }else if (record.coordinatesMeasures[i].assertion < 1000) {
            validation.assertion = 'Valid';
            break;
          }else{
            validation.assertion = 'Not Valid';
            break;
          }
        }
      }
      record.coordinatesValidations.push(validation);
      cb(null, record);
    }
  };
  Coordinates.remoteMethod(
    'SingleRecordValidationStatedPrecision',
    {
      http: {path: '/validation/singlerecord/statedprecision', verb: 'get'},
      accepts: [{arg: 'record', type: 'object'}],
      returns: {arg: 'response', type: 'object'}
    }
  );
  Coordinates.SingleRecordValidationStatedPrecisionList = function(body,cb) {
    var result = [];
    async.each(body, function iterator(item, callback){
      Coordinates.SingleRecordValidationStatedPrecision(item, function (err, response) {
        result.push(response);
        callback();
      });
    }, function done(){
      cb(null, result);
    });
  };
  Coordinates.remoteMethod(
    'SingleRecordValidationStatedPrecisionList',
    {
      http: {path: '/validation/singlerecord/statedprecision', verb: 'post'},
      accepts: {arg: 'list', type: 'array', http: { source: 'body' }},
      returns: {arg: 'response', type: 'object'}
    }
  );
};
