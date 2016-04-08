var expect = require('chai').expect;
var Schema = require('../src/SchemaSpec');
var is, are;
are = is = Schema.validators;

describe("SchemaSpec", function() {

  describe("validates", function() {

    describe("single object properties with", function() {
      var object;

      beforeEach(function() {
        object = { property: 5 };
      });

      it("single conditions", function () {
        var validator = new Schema().property('property', is.not.string);
        expect(validator.validate(object)).to.equal(true);
      });

      it("multiple conditions", function () {
        var validator = new Schema().property('property', [is.integer, is.min.value(10)]);
        expect(validator.validate(object)).to.equal(false);
      });


    });

    describe("all object properties with", function() {
      var object;

      beforeEach(function() {
        object = {
          propertyA: 5,
          propertyB: 10
        };
      });

      it("single conditions", function () {
        var validator = new Schema()
          .property('propertyA', is.not.undefined)
          .property('propertyB', is.not.undefined)
          .all(are.greater.than(40));
        expect(validator.validate(object)).to.equal(true);
      });

      it("multiple conditions", function () {
        var validator = new Schema().property('property', [is.integer, is.greater.than(10)]);
        expect(validator.validate(object)).to.equal(false);
      });


    });

  });
});