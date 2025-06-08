const auth = (req, res, next) => {
    const username = req.headers.username;
    const password = req.headers.password;
    if (username && password) {
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            next();
        }
        else {
            return res.status(500).json({
                status: false,
                error: 1,
                message: "Credentails not matched"
            })
        }
    } else {
        return res.status(500).json({
            status: false,
            error: 2,
            message: "Credentails Required"
        })
    }
}

module.exports = auth;