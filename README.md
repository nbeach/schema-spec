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

[![Dependency Status][david-image]][david-url] [![devDependency Status][david-dev-image]][david-dev-url] [![peerDependency Status][david-peer-image]][david-peer-url]

SchemaSpec is a JavaScript library for defining object schemas and validating object against them. It implements UMD, and supports CommonJS, AMD, and global based loading.

* [Examples](#examples)
* [Documentation](#documentation)

SchemaSpec is released under the [MIT license](https://github.com/nbeach/schema-spec/blob/master/LICENSE).


## Examples

#### Basic usage
    var SchemaSpec = require('schema-spec');
    var is = SchemaSpec.validators

    var spec = new SchemaSpec()
        .property("id", is.number)
        .property("name", is.string);

    var valid = spec.validate(person);


#### Multiple conditions per property
    var is = SchemaSpec.validators;

    var spec = new SchemaSpec()
        .property("id", [is.number, is.min.value(0)])
        .property("name", [is.string, is.not.empty]);


#### Applying conditions to all properties
    var is = SchemaSpec.validators, are = is

    var spec = new SchemaSpec()
        .property("id")
        .property("name", is.not.empty)
        .all(are.not.undefined);


#### Validating nested objects
    var is = SchemaSpec.validators;

    var accountSpec = new SchemaSpec()
        .property("accountNumber", is.integer);

    var personSpec = new SchemaSpec()
        .property("id", is.number)
        .property("name", is.string)
        .property("account", is.schema(accountSpec));

## Documentation

<a name="SchemaSpec"></a>

## SchemaSpec
**Kind**: global class  

* [SchemaSpec](#SchemaSpec)
    * [new SchemaSpec()](#new_SchemaSpec_new)
    * _instance_
        * [.all(conditions)](#SchemaSpec+all) ⇒ <code>[SchemaSpec](#SchemaSpec)</code>
        * [.property(name, [conditions])](#SchemaSpec+property) ⇒ <code>[SchemaSpec](#SchemaSpec)</code>
        * [.validate(object)](#SchemaSpec+validate) ⇒ <code>[SchemaSpec](#SchemaSpec)</code>
    * _static_
        * [.conditions](#SchemaSpec.conditions) : <code>object</code>

<a name="new_SchemaSpec_new"></a>

### new SchemaSpec()
Creates a new schema specification object.

<a name="SchemaSpec+all"></a>

### schemaSpec.all(conditions) ⇒ <code>[SchemaSpec](#SchemaSpec)</code>
Sets conditions to be applied to all specified properties in the object.

**Kind**: instance method of <code>[SchemaSpec](#SchemaSpec)</code>  
**Returns**: <code>[SchemaSpec](#SchemaSpec)</code> - Returns a reference to the SchemaSpec object to support builder style calls  

| Param | Type | Description |
| --- | --- | --- |
| conditions | <code>function</code> &#124; <code>Array.&lt;function()&gt;</code> | A single or array of conditions to apply |

<a name="SchemaSpec+property"></a>

### schemaSpec.property(name, [conditions]) ⇒ <code>[SchemaSpec](#SchemaSpec)</code>
Sets conditions to be applied to a property.

**Kind**: instance method of <code>[SchemaSpec](#SchemaSpec)</code>  
**Returns**: <code>[SchemaSpec](#SchemaSpec)</code> - Returns a reference to the SchemaSpec object to support builder style calls  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the property |
| [conditions] | <code>function</code> &#124; <code>Array.&lt;function()&gt;</code> | A single or array of conditions to apply |

<a name="SchemaSpec+validate"></a>

### schemaSpec.validate(object) ⇒ <code>[SchemaSpec](#SchemaSpec)</code>
Validates an object against the schema spec.

**Kind**: instance method of <code>[SchemaSpec](#SchemaSpec)</code>  
**Returns**: <code>[SchemaSpec](#SchemaSpec)</code> - Returns true if the object passes all validations, false if at least one validation fails.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | The object to be validated |

<a name="SchemaSpec.conditions"></a>

### SchemaSpec.conditions : <code>object</code>
Contains condition functions to be used for validation

**Kind**: static property of <code>[SchemaSpec](#SchemaSpec)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| null | <code>function</code> | Asserts the value is null |
| undefined | <code>function</code> | Asserts the value is undefined |
| string | <code>function</code> | Asserts the value is a string |
| number | <code>function</code> | Asserts the value is a number |
| boolean | <code>function</code> | Asserts the value is a boolean |
| function | <code>function</code> | Asserts the value is a function |
| object | <code>function</code> | Asserts the value is an object |
| array | <code>function</code> | Asserts the value is an array |
| integer | <code>function</code> | Asserts the value is an integer |
| empty | <code>function</code> | Asserts the value is empty |
| equal.to(value) | <code>function</code> | Asserts the value is equal to the provided value |
| length(length) | <code>function</code> | Asserts the value length is equal to the provided length |
| min.length(length) | <code>function</code> | Asserts the value is greater then or equal to the provided length |
| max.length(length) | <code>function</code> | Asserts the value is less than or equal to the provided length |
| greater.than(value) | <code>function</code> | Asserts the value is greater than the provided value |
| less.than(value) | <code>function</code> | Asserts the value is less that the provided value |
| arrayOf(conditions) | <code>function</code> | Asserts value is an array and all values match the provided condition(s) |
| schema(SchemaSpec) | <code>function</code> | Asserts the value is an object and passes validation with the provided SchemaSpec |
| not.null | <code>function</code> | Asserts the value is not null |
| not.undefined | <code>function</code> | Asserts the value is not undefined |
| not.string | <code>function</code> | Asserts the value is not a string |
| not.number | <code>function</code> | Asserts the value is not a number |
| not.boolean | <code>function</code> | Asserts the value is not a boolean |
| not.function | <code>function</code> | Asserts the value is not a function |
| not.object | <code>function</code> | Asserts the value is not an object |
| not.array | <code>function</code> | Asserts the value is not an array |
| not.integer | <code>function</code> | Asserts the value is not an integer |
| not.empty | <code>function</code> | Asserts the value is not empty |
| not.equal.to(value) | <code>function</code> | Asserts the value is not equal to the provided value |
| not.length(length) | <code>function</code> | Asserts the value length is not the provided length |

