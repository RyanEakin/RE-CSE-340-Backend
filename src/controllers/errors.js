// Test route for 500 errors
const servError = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

export {servError};