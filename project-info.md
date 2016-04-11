## SchemaSpec
![Build Status](https://travis-ci.org/nbeach/schema-spec.svg?branch=master)

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
    var SchemaSpec = require('schema-spec');
    var is = SchemaSpec.validators;

    var spec = new SchemaSpec()
        .property("id", [is.number, is.min.value(0)])
        .property("name", [is.string, is.not.empty]);


#### Applying conditions to all properties
    var SchemaSpec = require('schema-spec');
    var is = SchemaSpec.validators, are = is

    var spec = new SchemaSpec()
        .property("id")
        .property("name", is.not.empty)
        .all(are.not.undefined);


#### Validating nested objects
    var SchemaSpec = require('schema-spec');
    var is = SchemaSpec.validators;

    var accountSpec = new SchemaSpec()
        .property("accountNumber", is.integer);

    var personSpec = new SchemaSpec()
        .property("id", is.number)
        .property("name", is.string)
        .property("account", is.schema(accountSpec));

## Documentation
