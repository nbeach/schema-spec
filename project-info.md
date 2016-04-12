[david-url]: https://david-dm.org/nbeach/schema-spec
[david-image]: https://img.shields.io/david/nbeach/schema-spec.svg
[david-dev-url]: https://david-dm.org/nbeach/schema-spec#info=devDependencies
[david-dev-image]: https://david-dm.org/nbeach/schema-spec/dev-status.svg
[david-peer-url]: https://david-dm.org/nbeach/schema-spec#info=peerDependencies
[david-peer-image]: https://david-dm.org/nbeach/schema-spec/peer-status.svg
[coveralls-url]: https://coveralls.io/r/nbeach/schema-spec/
[coveralls-image]: https://img.shields.io/coveralls/nbeach/schema-spec.svg

## SchemaSpec
[![npm version](https://badge.fury.io/js/schema-spec.svg)](https://badge.fury.io/js/schema-spec) ![Build Status](https://travis-ci.org/nbeach/schema-spec.svg?branch=master) [![Coverage Status][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url] [![devDependency Status][david-dev-image]][david-dev-url]

SchemaSpec is a JavaScript library for defining object schemas and validating object against them. It implements UMD for CommonJS, AMD, and global based loading support.

* [Examples](#examples)
* [Documentation](#documentation)

SchemaSpec is released under the [MIT license](https://github.com/nbeach/schema-spec/blob/master/LICENSE).


## Examples

#### Basic usage
    var SchemaSpec = require('schema-spec');
    var is = SchemaSpec.conditions

    var spec = new SchemaSpec()
        .property("id", is.number)
        .property("name", is.string);

    var valid = spec.validate(person);


#### Multiple conditions per property
Multiple conditions can be specified as an array.

    var is = SchemaSpec.conditions;

    var spec = new SchemaSpec()
        .property("id", [is.number, is.min.value(0)])
        .property("name", [is.string, is.not.empty]);


#### Applying conditions to all properties
Conditions can be applied to all specified properties using .all().

    var is = SchemaSpec.conditions, are = is

    var spec = new SchemaSpec()
        .property("id")
        .property("name", is.not.empty)
        .all(are.not.undefined);


#### Validating nested objects
Object hierarchies can be validated by using the "schema" condition to validate properties against SchemaSpecs.

    var is = SchemaSpec.conditions;

    var accountSpec = new SchemaSpec()
        .property("accountNumber", is.integer);

    var personSpec = new SchemaSpec()
        .property("id", is.number)
        .property("name", is.string)
        .property("account", is.schema(accountSpec));

#### Or Condition
Using either().or() you can validate a property against two conditions (or sets of conditions) using a logical or. In the case below the object would be considered valid is the id property is null, or if it is an integer that is greater than or equal to zero.

    var is = SchemaSpec.conditions;

    var spec = new SchemaSpec()
        .property("id", is.either(is.null).or([is.integer, is.min.value(0)]));

#### Custom conditions

You can easily create your own validation conditions. Conditions are just functions that take a single property value and return true if the value meets the condition or false if it fails.

    var isNamedJohn = function(value) {
        return value === 'John';
    }

    var spec = new SchemaSpec().property("name", isJohn);


## Documentation
