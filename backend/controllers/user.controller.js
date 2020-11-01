//init code
const router = require('express').Router();
const User = require('../models/user.model');

/* --- MIDDLEWARE -- */

// Verify Refresh Token Middleware (which will be verifying the session)
let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // grab the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }


        // if the code reaches here - the user was found
        // therefore the refresh token exists in the database - but we still have to check if it has expired or not

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}

/* -- MIDDLEWARE END --*/

//create user
router.post('/register', (req, res) => {
    let newUser = new User(req.body);
    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        //Session create successfully and Refresh token returned successfully
        //now we generate an access-auth-token for the user to authenticate 
        return newUser.generateAccessAuthToken().then((accessToken) => {
            //access auth token generated successfully and now retrurn access auth token and refresh token
            return { accessToken, refreshToken };
        });
    }).then((authTokens) => {
        res
        .header('x-refresh-token', authTokens.refreshToken)
        .header('x-access-token', authTokens.accessToken)
        .send(newUser);

    }).catch((e) => {
        res.status(400).send(e);
    });

});

//login
router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((loggedInUser) => {
        return loggedInUser.createSession().then((refreshToken) => {
            //Session create successfully and Refresh token returned successfully
            //now we generate an access-auth-token for the user to authenticate 
            return loggedInUser.generateAccessAuthToken().then((accessToken) => {
                //access auth token generated successfully and now retrurn access auth token and refresh token
                return { accessToken, refreshToken };
            });
        }).then((authTokens) => {
            res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(loggedInUser);
    
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
});


/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
router.get('/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})

//exports the router
module.exports = router;