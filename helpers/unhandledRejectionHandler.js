module.exports = (req, res, next) => {
  const unhandledRejection = (reason, p) => {
    console.error(
      'Possibly Unhandled Rejection at: Promise ',
      p,
      ' reason: ',
      reason
    );
    next(reason);
  };

  process.on('unhandledRejection', unhandledRejection);

  // Manage to get information from the response too, just like Connect.logger does:
  const { end } = res;
  res.end = (chunk, encoding) => {
    // Prevent MaxListener on process.events
    process.removeListener('unhandledRejection', unhandledRejection);
    res.end = end;
    res.end(chunk, encoding);
  };

  next();
};
