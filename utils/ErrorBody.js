class ErrorBody {
  constructor(statusCode = 500, message = "Internal Server Error.", errors = []) {
    this.status = statusCode;
    this.message = message;
    this.errors = errors;
  }
}

module.exports = { ErrorBody };
