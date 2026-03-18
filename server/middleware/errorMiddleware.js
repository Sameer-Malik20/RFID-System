export function errorMiddleware(error, _req, res, _next) {
  console.error(error);
  res.status(error.status || error.statusCode || 500).json({ message: error.message || "Unexpected server error." });
}
