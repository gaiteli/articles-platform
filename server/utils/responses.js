

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
function failure(res, error) {
  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(e => e.message)
    return res.status(400).json({
      status: false,
      message: '请求参数错误',
      subType: '01',
      errors
    })
  } 
  else if (error.name === 'BadRequestError') {
    return res.status(400).json({
      status: false,
      message: '请求参数错误',
      subType: '02',
      errors: [error.message]
    })
  } 
  else if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: false,
      message: '认证失败',
      errors: [error.message]
    })
  }
  else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: false,
      message: '认证失败',
      errors: ['token错误']
    })
  }
  else if (error.name === 'TokenExpireError') {
    return res.status(401).json({
      status: false,
      message: '认证失败',
      errors: ['token已过期']
    })
  }
  else if (error.name === 'NotFoundError') {
    return res.status(404).json({
      status: false,
      message: '资源不存在',
      errors: [error.message]
    })
  } 
  else {
    res.status(500).json({
      status: false,
      message: '服务器错误',
      errors: [error.message]
    })
  }
}

module.exports = {
  success,
  failure
}