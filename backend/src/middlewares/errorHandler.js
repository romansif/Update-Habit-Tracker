export default (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Внутренняя ошибка сервера';
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
};