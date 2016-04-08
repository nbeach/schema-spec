var SchemaSpec = require('schema-spec');
var is = SchemaSpec.validators, are = SchemaSpec.validators;

var spec = new SchemaSpec('optionalName')
	.all(are.not.null)
	.property("id", is.undefined)
	.property("name", [is.not.undefined, is.null]);


var person = {
	id: 12,
	name: "jim",
	account: {
		number: 86753009
	}
};


spec.validate(person);