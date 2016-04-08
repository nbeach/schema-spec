(function (global, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	} else {
		global.SchemaSpec = factory();
	}
}(this, function SchemaSpecFactory() {

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

	SchemaSpec.prototype.all = function(conditions) {
		this._universalConditions = this._addConditions(this._universalConditions, conditions);
		return this;
	};

	SchemaSpec.prototype.property = function(name, conditions) {
		if(SchemaSpec.conditions.undefined(this._propertyConditions[name])) {
			this._propertyConditions[name] = [];
		}

		if(!SchemaSpec.conditions.undefined(conditions) && !SchemaSpec.conditions.null(conditions)) {
			this._propertyConditions[name] = this._addConditions(this._propertyConditions[name], conditions);
		}

		return this;
	};

	//TODO: implement this.
	//Schemer.prototype.or = function(conditions) {
	//	this.validations[currentProperty] = conditions;
	//};

	SchemaSpec.prototype.validate = function(object) {
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

	SchemaSpec.prototype._validateValue = function(propertyConditions, value) {
		for(var property in propertyConditions) {
			if (propertyConditions.hasOwnProperty(property) && propertyConditions[property](value) === false) {
				return false;
			}
		}

		return true;
	};




	SchemaSpec.conditions = (function(){
		var module = { min: {}, max: {}, not: {}, greater: {}, less: {} };

		module.null = function(value) { return value === null; };
		module.undefined = function(value) { return typeof value === "undefined"; };
		module.strings = module.string = function(value) { return typeof value === "string"; };
		module.numbers = module.number = function(value) { return typeof value === "number"; };
		module.booleans = module.boolean = function(value) { return typeof value === "boolean"; };
		module.functions = module.function = function(value) { return typeof value === "function"; };
		module.objects = module.object = function(value) { return typeof value === "object"; };
		module.arrays = module.array = function(value) { return Object.prototype.toString.call(value) === '[object Array]'; };

		module.integers = module.integer = function(number) { return module.number(number) && (number % 1) === 0; };
		module.empty = function(value) { return module.string(value) && value.length === 0; };

		//Generate not validators for function that don't utilize currying
		var notValidators = {};
		for (var property in module) {
			if (module.hasOwnProperty(property) && property !== 'not') {
				(function(property) {
					notValidators[property] = function(value) { return !module[property](value); };
				})(property);
			}
		}
		module.not = notValidators;

		//Add currying validators
		module.length = function(length) { return function(value) { return module.not.undefined(value.length) && value.length === length }; };
		module.not.length = function(length) { return function(value) { return module.not.undefined(value.length) && value.length !== length }; };
		module.equal = {};
		module.equal.to = function(provided) { return function(value) { return value === provided }; };
		module.not.equal = {};
		module.not.equal.to = function(provided) { return function(value) { return value !== provided }; };
		module.min.length = function(minLength) { return function(value) { return module.not.undefined(value.length) && value.length >= minLength }; };
		module.max.length = function(maxLength) { return function(value) { return module.not.undefined(value.length) && value.length <= maxLength }; };
		module.greater.than = function(minValue) { return function(value) { return value > minValue }; };
		module.less.than = function(maxValue) { return function(value) { return value < maxValue }; };

		//TODO: Finish and write tests for the conditions below
		module.model = function(modelValidator) { return function(value) { modelValidator.validate(value); } };
		module.arrayOf = function() { return Object.prototype.toString.call(value) === '[object Array]'; };

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

		module._or = function(conditionsA, conditionsB) {
			return function(value) {
				return evaluateConditions(conditionsA, value) || evaluateConditions(conditionsB, value);
			}
		};

		module._and = function(conditionsA, conditionsB) {
			return function(value) {
				return evaluateConditions(conditionsA, value) && evaluateConditions(conditionsB, value);
			}
		};

		return module;
	})();


	return SchemaSpec;

}));
