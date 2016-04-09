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

	//TODO: implement this.
	//Schemer.prototype.or = function(conditions) {
	//	this.validations[currentProperty] = conditions;
	//};

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
	SchemaSpec.conditions = new (function(){
		var self = this;

		self.null = function(value) { return value === null; };
		self.undefined = function(value) { return typeof value === "undefined"; };
		self.strings = self.string = function(value) { return typeof value === "string"; };
		self.numbers = self.number = function(value) { return typeof value === "number"; };
		self.booleans = self.boolean = function(value) { return typeof value === "boolean"; };
		self.functions = self.function = function(value) { return typeof value === "function"; };
		self.objects = self.object = function(value) { return typeof value === "object"; };
		self.arrays = self.array = function(value) { return Object.prototype.toString.call(value) === '[object Array]'; };
		self.integers = self.integer = function(number) { return self.number(number) && (number % 1) === 0; };
		self.empty = function(value) { return self.string(value) && value.length === 0; };

		//Generate not validators for function that don't utilize currying
		var notValidators = {};
		for (var property in self) {
			if (self.hasOwnProperty(property) && property !== 'not') {
				(function(property) {
					notValidators[property] = function(value) { return !self[property](value); };
				})(property);
			}
		}
		self.not = notValidators;


		//Currying validators
		self.length = function(length) { return function(value) { return self.not.undefined(value.length) && value.length === length }; };
		self.not.length = function(length) { return function(value) { return self.not.undefined(value.length) && value.length !== length }; };
		self.equal = { to: function(provided) { return function(value) { return value === provided }; } };
		self.not.equal = { to: function(provided) { return function(value) { return value !== provided }; } };
		self.min = { length: function(minLength) { return function(value) { return self.not.undefined(value.length) && value.length >= minLength }; } };
		self.max = { length: function(maxLength) { return function(value) { return self.not.undefined(value.length) && value.length <= maxLength }; } };
		self.greater = { than: function(minValue) { return function(value) { return value > minValue }; } };
		self.less = { than: function(maxValue) { return function(value) { return value < maxValue }; } };
		self.schema = function(spec) { return function(value) { return self.not.undefined(value) && spec.validate(value); } };

		self.arrayOf = function(conditions) {
			return function(array) {
				if(!self.array(array)) {
					return false;
				}

				if(!self.array(conditions)) {
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

		//TODO: Finish and write tests for the conditions below
		function evaluateConditions(conditions, value) {
			if(SchemaSpec.conditions.array(conditions)) {
				for(var i = 0; i < conditions.length; i++) {
					if(conditions[i](value) === false) {
						return false;
					}
				}

				return true;
			} else {
				return conditions(value);
			}
		}

		self.or = function(conditionsA, conditionsB) {
			return function(value) {
				return evaluateConditions(conditionsA, value) || evaluateConditions(conditionsB, value);
			}
		};


	})();


	return SchemaSpec;
}));
