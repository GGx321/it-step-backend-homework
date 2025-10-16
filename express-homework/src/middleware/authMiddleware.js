const authMiddleware = (req, res, next) => {
    if (req.query.auth === "true") {
        return next();
    }
    res.status(403).send("Доступ заборонено. Додайте ?auth=true до URL");
};

module.exports = authMiddleware;
