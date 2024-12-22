export class Unauthorized extends Error {
  message: string;

  constructor(message: string = "Unauthorized") {
    super();
    this.message = message;
  }
}

export class Forbidden extends Error {
  message: string;

  constructor(message: string = "Forbidden") {
    super();
    this.message = message;
  }
}

export class BadRequest extends Error {
  message: string;

  constructor(message: string = "Bad Request") {
    super();
    this.message = message;
  }
}

export class NotFound extends Error {
  message: string;

  constructor(message: string = "Not Found") {
    super();
    this.message = message;
  }
}

export class InternalFailure extends Error {
  message: string;

  constructor(message: string = "Internal Failure") {
    super();
    this.message = message;
  }
}

export function Failure(code: number, message: string): Error {
  let error = new InternalFailure(message);

  if (code == 401) {
    error = new Unauthorized(message);
  }

  if (code == 403) {
    error = new Forbidden(message);
  }

  if (code == 400) {
    error = new BadRequest(message);
  }

  if (code == 404) {
    error = new NotFound(message);
  }

  return error;
}
