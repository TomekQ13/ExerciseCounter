function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();        
    }
    // sets the variable to redirect the user after logging in to the page they were on
    console.log(req)
    req.session.redirectTo = req.baseUrl
    res.redirect('/user/login');
};

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');        
    };
    next();
};



module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
};
