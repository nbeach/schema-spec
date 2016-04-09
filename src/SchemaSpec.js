(function (global, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	} else {
		global.SchemaSpec = factory();
	}
}(this, function SchemaSpecFactory() {

	/**
	 * Creates a new schema specification object.
	 * @Class SchemaSpec
	 * @param {string} [name] - Name of the object type the spec will validate
	 */
	var SchemaSpec = function(name) {
		this.name = name;
		this._propertyConditions = {};
		this._universalConditions = [];
	};

	SchemaSpec.prototype._addConditions = function(validationList, conditions) {
		var list = [].concat(validationList);
		if(SchemaSpec.conditions.array(conditions)) {
			list = list.concat(conditions);
		} else {
			list.push(conditions);
		}
		return list;
	};

	SchemaSpec.prototype._validateValue = function(propertyConditions, value) {
		for(var property in propertyConditions) {
			if (propertyConditions.hasOwnProperty(property) && propertyConditions[property](value) === false) {
				return false;
			}
		}

		return true;
	};

	/**
	 * Sets conditions to be applied to all specified properties in the object.
	 * @memberof SchemaSpec
	 * @param {function|Array<function>} conditions - A single or array of conditions to apply
	 * @returns {SchemaSpec} Returns a reference to the SchemaSpec object to support builder style calls
	 */
	SchemaSpec.prototype.all = function(conditions) {
		this._universalConditions = this._addConditions(this._universalConditions, conditions);
		return this;
	};

	/**
	 * Sets conditions to be applied to a property.
	 * @memberof SchemaSpec
	 * @param {string} name - The name of the property
	 * @param {function|Array<function>} [conditions] - A single or array of conditions to apply
	 * @returns {SchemaSpec} Returns a reference to the SchemaSpec object to support builder style calls
	 */
	SchemaSpec.prototype.property = function(name, conditions) {
		if(SchemaSpec.conditions.undefined(this._propertyConditions[name])) {
			this._propertyConditions[name] = [];
		}

		if(!SchemaSpec.conditions.undefined(conditions) && !SchemaSpec.conditions.null(conditions)) {
			this._propertyConditions[name] = this._addConditions(this._propertyConditions[name], conditions);
		}

		return this;
	};


	/**
	 * Validates an object against the schema spec.
	 * @memberof SchemaSpec
	 * @param {object} object - The object to be validated
	 * @returns {SchemaSpec} Returns true if the object passes all validations, false if at least one validation fails.
	 */
	SchemaSpec.prototype.validate = function(object) {

		if(!SchemaSpec.conditions.object(object)) {
			throw new Error('Value to validate is not an object');
		}

		if(Object.keys(this._propertyConditions).length === 0) {
			throw new Error('No object properties specified');
		}

		for (var propertyName in this._propertyConditions) {

			for(var i = 0; i  < this._universalConditions.length; i++) {
				if(this._universalConditions[i](object[propertyName]) === false) {
					return false;
				}
			}

			if(this._validateValue(this._propertyConditions[propertyName], object[propertyName]) === false) {
				return false;
			}
		}

		return true;
	};




	/**
	 * SchemaSpec.conditions contains functions to be used for validation, and has methods to generate condition
	 * functions for more complex validations
	 * @memberof SchemaSpec
	 * @static
	 * @type {object}
	 * @property {function} null
	 * @property {function} not.null
	 * @property {function} undefined
	 * @property {function} not.undefined
	 * @property {function} string
	 * @property {function} not.string
	 * @property {function} number
	 * @property {function} not.number
	 * @property {function} boolean
	 * @property {function} not.boolean
	 * @property {function} function
	 * @property {function} not.function
	 * @property {function} object
	 * @property {function} not.object
	 * @property {function} array
	 * @property {function} not.array
	 * @property {function} integer
	 * @property {function} not.integer
	 * @property {function} empty
	 * @property {function} not.empty
	 * @property {function} equal.to(value)
	 * @property {function} not.equal.to(value)
	 * @property {function} length(length)
	 * @property {function} not.length(length)
	 * @property {function} min.length(length)
	 * @property {function} max.length(length)
	 * @property {function} greater.than(value)
	 * @property {function} less.than(value)
	 * @property {function} arrayOf(condition)
	 * @property {function} schema(SchemaSpec)
	 */
	SchemaSpec.conditions = {};
	SchemaSpec.conditions.null = function(value) { return value === null; };
	SchemaSpec.conditions.undefined = function(value) { return typeof value === "undefined"; };
	SchemaSpec.conditions.strings = SchemaSpec.conditions.string = function(value) { return typeof value === "string"; };
	SchemaSpec.conditions.numbers = SchemaSpec.conditions.number = function(value) { return typeof value === "number"; };
	SchemaSpec.conditions.booleans = SchemaSpec.conditions.boolean = function(value) { return typeof value === "boolean"; };
	SchemaSpec.conditions.functions = SchemaSpec.conditions.function = function(value) { return typeof value === "function"; };
	SchemaSpec.conditions.objects = SchemaSpec.conditions.object = function(value) { return typeof value === "object"; };
	SchemaSpec.conditions.arrays = SchemaSpec.conditions.array = function(value) { return Object.prototype.toString.call(value) === '[object Array]'; };
	SchemaSpec.conditions.integers = SchemaSpec.conditions.integer = function(number) { return SchemaSpec.conditions.number(number) && (number % 1) === 0; };
	SchemaSpec.conditions.empty = function(value) { return SchemaSpec.conditions.string(value) && value.length === 0; };

	//Generate not validators for function that don't utilize currying
	var notConditions = {};
	for (var property in SchemaSpec.conditions) {
		if (SchemaSpec.conditions.hasOwnProperty(property) && property !== 'not') {
			(function(property) {
				notConditions[property] = function(value) { return !SchemaSpec.conditions[property](value); };
			})(property);
		}
	}
	SchemaSpec.conditions.not = notConditions;


	//Currying validators
	SchemaSpec.conditions.length = function(length) { return function(value) { return SchemaSpec.conditions.not.undefined(value.length) && value.length === length }; };
	SchemaSpec.conditions.not.length = function(length) { return function(value) { return SchemaSpec.conditions.not.undefined(value.length) && value.length !== length }; };
	SchemaSpec.conditions.equal = { to: function(provided) { return function(value) { return value === provided }; } };
	SchemaSpec.conditions.not.equal = { to: function(provided) { return function(value) { return value !== provided }; } };
	SchemaSpec.conditions.min = { length: function(minLength) { return function(value) { return SchemaSpec.conditions.not.undefined(value.length) && value.length >= minLength }; } };
	SchemaSpec.conditions.max = { length: function(maxLength) { return function(value) { return SchemaSpec.conditions.not.undefined(value.length) && value.length <= maxLength }; } };
	SchemaSpec.conditions.greater = { than: function(minValue) { return function(value) { return value > minValue }; } };
	SchemaSpec.conditions.less = { than: function(maxValue) { return function(value) { return value < maxValue }; } };
	SchemaSpec.conditions.schema = function(spec) { return function(value) { return SchemaSpec.conditions.not.undefined(value) && spec.validate(value); } };

	SchemaSpec.conditions.arrayOf = function(conditions) {
		return function(array) {
			if(!SchemaSpec.conditions.array(array)) {
				return false;
			}

			if(!SchemaSpec.conditions.array(conditions)) {
				conditions = [conditions];
			}

			for(var i = 0; i < array.length; i++) {
				for(var x = 0; x < conditions.length; x++)
				if(!conditions[x](array[i])) {
					return false;
				}
			}

			return true;
		};
	};

	function evaluateConditions(conditions, value) {
		if(!SchemaSpec.conditions.array(conditions)) {
			conditions = [conditions];
		}

		for(var i = 0; i < conditions.length; i++) {
			if(conditions[i](value) === false) {
				return false;
			}
		}

		return true;
	}

	SchemaSpec.conditions.either = function(conditionsA) {
		return {
			or: function(conditionsB) {
				return function(value) {
					return evaluateConditions(conditionsA, value) || evaluateConditions(conditionsB, value);
				};
			}
		};
	};

	return SchemaSpec;
}));
