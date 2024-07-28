const { ValidationError } = require('joi');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        next(new ValidationError(error.details[0].message));
    } else {
        next();
    }
};

module.exports = validate;