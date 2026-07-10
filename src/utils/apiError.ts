export class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export class NetworkError extends Error {
  constructor(message = 'Unable to reach the server. Check your internet connection.') {
    super(message)
    this.name = 'NetworkError'
  }
}
