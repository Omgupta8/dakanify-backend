const { status : httpStatus } = require('http-status');

const keys = ['body', 'query', 'params'];

const validate = (schema) => (req, res, next) => {
  for( const key of keys) {
    if(!schema[key]) continue;
    const { error } = schema[key].validate(req[key]);
    if ( error ) {
      const { details } = error;
      const message = details.map((m) => m.message).join(",");
      return res.status(httpStatus.BAD_REQUEST).json({status: false, message});
    }
  }
  next();
};

module.exports= {
  validate
};
