const { status : httpStatus } = require('http-status');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if ( error ) {
    const { details } = error;
    const message = details.map((m) => m.message).join(",");
    return res.status(httpStatus.BAD_REQUEST).json({ code:1, message });
  }
  next();
};

module.exports= {
  validate
};
