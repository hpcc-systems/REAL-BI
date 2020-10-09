const logger = require('../config/logger');

const errHandler = err => {
  const { errors = [{ message: null }], Exception = [{ message: null }], response = {} } = err;
  const { message: sequelizeMsg = null } = errors[0];
  const { Message: hpccMsg = null } = Exception[0];
  const { data, message, status = 500, statusText } = response;

  // Get error message
  let errMsg = sequelizeMsg || data || message || hpccMsg || statusText || 'Internal Error';

  // Update error message if status is a 401
  if (status === 401) {
    errMsg = 'Incorrect Credentials Provided';
  }

  // Log error
  logger.error(typeof errMsg === 'object' ? JSON.stringify(errMsg) : errMsg);

  // Return error object
  return { errMsg, status };
};

module.exports = errHandler;
