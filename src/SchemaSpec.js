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
		this.validations = {};
		this.universalValidations = [];
	};

	SchemaSpec.prototype._addConditions = function(validationList, conditions) {
		var list = [].concat(validationList);
		if(SchemaSpec.validators.array(conditions)) {
			list = list.concat(conditions);
		} else {
			list.push(conditions);
		}
		return list;
	};

	SchemaSpec.prototype.all = function(conditions) {
		this.universalValidations = this._addConditions(this.universalValidations, conditions);
		return this;
	};

	SchemaSpec.prototype.property = function(name, conditions) {
		if(SchemaSpec.validators.undefined(this.validations[name])) {
			this.validations[name] = [];
		}

		this.validations[name] = this._addConditions(this.validations[name], conditions);
		return this;
	};

	//TODO: implement this.
	//Schemer.prototype.or = function(conditions) {
	//	this.validations[currentProperty] = conditions;
	//};

	SchemaSpec.prototype.validate = function(object) {
		for (var property in this.validations) {
			if(this._validateValue(this.validations[property], object[property]) === false) {
				return false;
			}

		}

		return true;
	};

	SchemaSpec.prototype._validateValue = function(validations, value) {
		for(var property in validations) {
			if (validations.hasOwnProperty(property) && validations[property](value) === false) {
				return false;
			}
		}

		return true;
	};



	SchemaSpec.validators = (function(){
		var module = { min: {}, max: {}, not: {}, greater: {}, less: {} };

		module.null = function(value) { return value === null; };
		module.undefined = function(value) { return typeof value === "undefined"; };
		module.string = function(value) { return typeof value === "string"; };
		module.number = function(value) { return typeof value === "number"; };
		module.boolean = function(value) { return typeof value === "boolean"; };
		module.function = function(value) { return typeof value === "function"; };
		module.object = function(value) { return typeof value === "object"; };
		module.array = function(value) { return Object.prototype.toString.call(value) === '[object Array]'; };

		module.integer = function(number) { return module.number(number) && (number % 1) === 0; };
		module.empty = function(value) { return module.string(value) && module.length(0)(value); };

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
		module.length = function(length) { return function(value) { return !module.not.undefined(value.length) && value.length === length }; };
		module.equals = function(provided) { return function(value) { return value === provided }; };
		module.min.length = function(minLength) { return function(value) { return !module.not.undefined(value.length) && value.length >= minLength }; };
		module.max.length = function(maxLength) { return function(value) { return !module.not.undefined(value.length) && value.length <= maxLength }; };
		module.min.value = function(minValue) { return function(value) { return value >= minValue }; };
		module.greater.than = function(minValue) { return function(value) { return value > minValue }; };
		module.max.value = function(maxValue) { return function(value) { return value <= maxValue }; };
		module.less.than = function(maxValue) { return function(value) { return value < maxValue }; };

		//TODO: combine with object validator?
		module.model = function(modelValidator) { return function(value) { modelValidator.validate(value); } };
		module.arrayOf = function() { return Object.prototype.toString.call(value) === '[object Array]'; };



		function evaluateConditions(conditions, value) {
			if(SchemaSpec.validators.array(conditions)) {
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
