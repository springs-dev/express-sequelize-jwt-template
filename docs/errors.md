# Error Handling Documentation

## Overview

This guide outlines how to throw and handle exceptions effectively in our application, ensuring clarity for end users and maintainability in our codebase.

## Supported Exceptions

- **JavaScript Standard Errors**: The built-in error types in JavaScript used for general purposes.
- **Sequelize Validation Errors**: Errors specific to the Sequelize ORM that arise during the validation of model data against predefined schemas.
- **HTTP Errors**: These are errors pertaining to HTTP requests, facilitated by the `http-errors` library, which provide constructors for common HTTP status codes.

## Throwing Exceptions`

### HTTP Errors

Errors can be thrown within the application using the `http-errors` library for different scenarios. Below are examples of how to throw standard and custom errors.

```javascript
// For not found errors
throw new CreateError.NotFound('The requested resource could not be found.');

// For conflict errors, such as when an email is already in use
throw new CreateError.Conflict('Email already in use.');
```

For custom errors or when you need to include additional properties like a unique error key (optionally including i18n support), you can use the general constructor:.

```javascript
// For a bad request with a custom error key
throw new CreateError(400, 'Custom error message', {
  key: 'error.custom-key',
});

// You can also pass properties directly to set specific details of the error
throw new CreateError({
  statusCode: 400,
  message: 'File type is not allowed',
  key: 'error.file-type-not-allowed',
});
```

## Error Responses

Here are some examples of error responses that the client may receive:

- Sequelize validation error example

```json
{
  "key": "error.validation",
  "message": "Validation error",
  "incidentDetails": [
    {
      "location": "body",
      "message": "email must be a valid email",
      "key": "error.email-invalid"
    }
  ]
}
```

- HTTP error example

```json
{
  "statusCode": 404,
  "message": "Not Found",
  "key": "error.not-found"
}
```
