const createError = require('http-errors')
const createHttpError = require("http-errors");
const multer = require('multer')

/* List of all constructors in http-errors
  Status Code	Constructor Name
  400	BadRequest
  401	Unauthorized
  402	PaymentRequired
  403	Forbidden
  404	NotFound
  405	MethodNotAllowed
  406	NotAcceptable
  407	ProxyAuthenticationRequired
  408	RequestTimeout
  409	Conflict
  410	Gone
  411	LengthRequired
  412	PreconditionFailed
  413	PayloadTooLarge
  414	URITooLong
  415	UnsupportedMediaType
  416	RangeNotSatisfiable
  417	ExpectationFailed
  418	ImATeapot
  421	MisdirectedRequest
  422	UnprocessableEntity
  423	Locked
  424	FailedDependency
  425	TooEarly
  426	UpgradeRequired
  428	PreconditionRequired
  429	TooManyRequests
  431	RequestHeaderFieldsTooLarge
  451	UnavailableForLegalReasons
  500	InternalServerError
  501	NotImplemented
  502	BadGateway
  503	ServiceUnavailable
  504	GatewayTimeout
  505	HTTPVersionNotSupported
  506	VariantAlsoNegotiates
  507	InsufficientStorage
  508	LoopDetected
  509	BandwidthLimitExceeded
  510	NotExtended
  511	NetworkAuthenticationRequired
*/

/*
 * 请求成功
 */
function success(res, message, data = {}, code = 200) {
  res.status(code).json({
    status: true,
    message,
    data
  })
}

/*
 * 请求失败
 */
function failure(res, error, message) {
  // 默认相应为500，服务器错误
  let statusCode = 500
  let errors = '服务器错误'

  if (error.name === 'SequelizeValidationError') {
    statusCode = 400
    errors = error.errors.map(e => e.message)
  }
  else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    statusCode = 401
    errors = 'token错误或已过期'
  }
  else if (error instanceof createError.HttpError) {    // http-errors库创建的错误
    statusCode = error.status
    errors = error.message
  }
  else if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      statusCode = 413
      errors = '文件大小超出限制'
    } else {
      statusCode = 400
      errors = error.message
    }
  }

  res.status(statusCode).json({
    status: false,
    message: message || `请求失败: ${error.name}: ${error.message}`,
    errors: Array.isArray(errors) ? errors : [errors]
  })


  // if (error.name === 'SequelizeValidationError') {
  //   const errors = error.errors.map(e => e.message)
  //   return res.status(400).json({
  //     status: false,
  //     message: '请求参数错误',
  //     subType: '01',
  //     errors
  //   })
  // }
  // else if (error.name === 'BadRequest') {
  //   return res.status(400).json({
  //     status: false,
  //     message: '请求参数错误',
  //     subType: '02',
  //     errors: [error.message]
  //   })
  // }
  // else if (error.name === 'Unauthorized') {
  //   return res.status(401).json({
  //     status: false,
  //     message: '认证失败',
  //     errors: [error.message]
  //   })
  // }
  // else if (error.name === 'JsonWebTokenError') {
  //   return res.status(401).json({
  //     status: false,
  //     message: '认证失败',
  //     errors: ['token错误']
  //   })
  // }
  // else if (error.name === 'TokenExpireError') {
  //   return res.status(401).json({
  //     status: false,
  //     message: '认证失败',
  //     errors: ['token已过期']
  //   })
  // }
  // else if (error.name === 'NotFound') {
  //   return res.status(404).json({
  //     status: false,
  //     message: '资源不存在',
  //     errors: [error.message]
  //   })
  // }
  // else {
  //   res.status(500).json({
  //     status: false,
  //     message: '服务器错误',
  //     errors: [error.message]
  //   })
  // }
}

module.exports = {
  success,
  failure
}