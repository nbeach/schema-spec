var expect = require('chai').expect;
var SchemaSpec = require('../src/SchemaSpec');
var is = SchemaSpec.conditions;

describe("SchemaSpec", function() {
  var alwaysFails, alwaysPasses;

  beforeEach(function() {
    alwaysPasses = function() { return true; };
    alwaysFails = function() { return false; };
  });

  describe("validates objects with", function() {

    describe("single conditions for a property and returns", function() {

      it("true when the condition passes", function () {
        var spec = new SchemaSpec()
          .property('property', alwaysPasses);

        expect(spec.validate({})).to.equal(true);
      });

      it("false when the condition fails", function () {
        var spec = new SchemaSpec()
          .property('property', alwaysFails);

        expect(spec.validate({})).to.equal(false);
      });

    });

    describe("multiple conditions for a property and returns", function() {

      it("true when all conditions pass", function () {
        var spec = new SchemaSpec()
          .property('property', [alwaysPasses, alwaysPasses]);

        expect(spec.validate({})).to.equal(true);
      });

      it("flase when at least one condition fails", function () {
        var spec = new SchemaSpec()
          .property('property', [alwaysPasses, alwaysFails]);

        expect(spec.validate({})).to.equal(false);
      })

    });

    describe("single conditions for all properties and returns", function() {

      it("true when the condition passes", function () {
        var spec = new SchemaSpec()
          .property('property')
          .all(alwaysPasses);

        expect(spec.validate({})).to.equal(true);
      });

      it("false when the condition fails", function () {
        var spec = new SchemaSpec()
          .property('property')
          .all(alwaysFails);

        expect(spec.validate({})).to.equal(false);
      });

    });

    describe("multiple conditions for all properties and returns", function() {

      it("true when all conditions pass", function () {
        var spec = new SchemaSpec()
          .property('property')
          .all([alwaysPasses, alwaysPasses]);

        expect(spec.validate({})).to.equal(true);
      });

      it("false when at least one condition fails", function () {
        var spec = new SchemaSpec()
          .property('property')
          .all([alwaysPasses, alwaysFails]);

        expect(spec.validate({})).to.equal(false);
      });

    });

    describe("multiple properties and returns", function() {

      it("true when all properties conditions pass", function () {
        var spec = new SchemaSpec()
          .property('propertyA', alwaysPasses)
          .property('propertyB', alwaysPasses);

        expect(spec.validate({})).to.equal(true);
      });

      it("false when at least one property condition fails", function () {
        var spec = new SchemaSpec()
          .property('propertyA', alwaysPasses)
          .property('propertyB', alwaysFails);

        expect(spec.validate({})).to.equal(false);
      });

    });

  });


  describe('condition', function() {
    var obj, spec;

    function initObject() {
      obj = {};
      obj.undefined = undefined;
      obj.null = null;
      obj.empty = '';
      obj.numbers = obj.number = 55.555;
      obj.integers = obj.integer = 55;
      obj.strings = obj.string = 'abc123';
      obj.booleans = obj.boolean = true;
      obj.arrays = obj.array = [1, 2, 3];
      obj.objects = obj.object = { string: 1 } ;
      obj.functions = obj.function = function(){};
    }

    beforeEach(function() {
      spec = new SchemaSpec();
      initObject();
    });

    //We can generate tests for the non-currying conditions
    initObject();
    Object.keys(obj).forEach(function(name) {

      describe(name + ' returns', function() {

        it('true when the value is a ' + name, function() {
          var result = spec.property(name, is[name]).validate(obj);
          expect(result).to.equal(true);
        });

        it('false when the value is not a ' + name, function() {
          var otherValueName = name.indexOf('number') >= 0 ? 'object' : 'number' ;

          var result = spec.property(otherValueName, is[name]).validate(obj);
          expect(result).to.equal(false);
        });

      });

      describe('not.'+ name + ' returns', function() {
        var otherValueName = name.indexOf('number') >= 0 ? 'object' : 'number' ;

        it('false when the value is a ' + name, function() {
          var result = spec.property(otherValueName, is.not[name]).validate(obj);
          expect(result).to.equal(true);
        });

        it('true when the value is not a ' + name, function() {
          var result = spec.property(name, is.not[name]).validate(obj);
          expect(result).to.equal(false);
        });

      });

    });


    describe('length returns', function() {

      it('true when the value length matches the provided', function() {
        var result = spec.property('string', is.length(6)).validate(obj);
        expect(result).to.equal(true);
      });

      it('false when the value length does not match the provided', function() {
        var result = spec.property('string', is.length(3)).validate(obj);
        expect(result).to.equal(false);
      });

    });

    describe('not.length returns', function() {

      it('true when the value does not match the provided', function() {
        var result = spec.property('string', is.not.length(3)).validate(obj);
        expect(result).to.equal(true);
      });

      it('false when the value matches the provided', function() {
        var result = spec.property('string', is.not.length(6)).validate(obj);
        expect(result).to.equal(false);
      });

    });


    describe('equal.to returns', function() {

      it('true when the value matches the provided', function() {
        var result = spec.property('string', is.equal.to('abc123')).validate(obj);
        expect(result).to.equal(true);
      });

      it('false when the value does not match the provided', function() {
        var result = spec.property('string', is.equal.to('xzy789')).validate(obj);
        expect(result).to.equal(false);
      });

    });

    describe('not.equal.to returns', function() {

      it('true when the value does not match the provided', function() {
        var result = spec.property('string', is.not.equal.to('xzy789')).validate(obj);
        expect(result).to.equal(true);
      });

      it('false when the value matches the provided', function() {
        var result = spec.property('string', is.not.equal.to('abc123')).validate(obj);
        expect(result).to.equal(false);
      });

    });

    describe('min.length returns', function() {

      it('true when the value length is greater than the provided', function() {
        var result = spec.property('string', is.min.length(5)).validate(obj);
        expect(result).to.equal(true);
      });

      it('true when the value length is equal to the provided', function() {
        var result = spec.property('string', is.min.length(6)).validate(obj);
        expect(result).to.equal(true);
      });

      it('false when the value is less than the provided', function() {
        var result = spec.property('string', is.min.length(7)).validate(obj);
        expect(result).to.equal(false);
      });

    });

    describe('max.length returns', function() {

      it('true when the value length is less than the provided', function() {
        var result = spec.property('string', is.max.length(7)).validate(obj);
        expect(result).to.equal(true);
      });

      it('true when the value length is equal to the provided', function() {
        var result = spec.property('string', is.max.length(6)).validate(obj);
        expect(result).to.equal(true);
      });

      it('false when the value is greater than the provided', function() {
        var result = spec.property('string', is.max.length(5)).validate(obj);
        expect(result).to.equal(false);
      });

    });

    describe('greater.than returns', function() {

      it('true when the value length is greater than the provided', function() {
        var result = spec.property('integer', is.greater.than(50)).validate(obj);
        expect(result).to.equal(true);
      });

      it('false when the value is less or equal to than the provided', function() {
        var result = spec.property('string', is.greater.than(55)).validate(obj);
        expect(result).to.equal(false);
      });

    });


    describe('less.than returns', function() {

      it('true when the value length is less than the provided', function() {
        var result = spec.property('integer', is.less.than(60)).validate(obj);
        expect(result).to.equal(true);
      });

      it('false when the value is greater than or equal to than the provided', function() {
        var result = spec.property('string', is.less.than(55)).validate(obj);
        expect(result).to.equal(false);
      });

    });



    describe('schema returns', function() {
      var parentObject, childASpec;

      beforeEach(function() {
        parentObject = {
          childA: { string: 'abc123' },
          childB: { number: 3.333 }
        };

        childASpec = new SchemaSpec().property('string', is.string);
      });

      it('true when the object matches the provided spec', function() {
        var result = spec.property('childA', is.schema(childASpec)).validate(parentObject);
        expect(result).to.equal(true);
      });

      it('false when the object does not match the provided spec', function() {
        var result = spec.property('childB', is.schema(childASpec)).validate(parentObject);
        expect(result).to.equal(false);
      });

    });


    describe('arrayOf returns', function() {
      var arrayObj;

      beforeEach(function() {
        arrayObj = {
          arrayA: [1, 2, 3],
          arrayB: [1, '2', 3]
        };

      });

      it('true when the array contains only values matching the provided condition', function() {
        var result = spec.property('arrayA', is.arrayOf(is.number)).validate(arrayObj);
        expect(result).to.equal(true);
      });

      it('false when the array contains at least one value not matching the provided condition', function() {
        var result = spec.property('arrayB', is.arrayOf(is.number)).validate(arrayObj);
        expect(result).to.equal(false);
      });

    });


  });

});