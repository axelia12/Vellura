// Express 4 doesn't forward rejected promises from async handlers to error
// middleware — an unhandled rejection just crashes the process. This wraps
// a handler so any rejection (e.g. a dropped DB connection) reaches `next`.
export function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
