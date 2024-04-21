"user strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // access token
        const accessToken = JWT.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "2 days",
        });

        // refresh token
        const refreshToken = JWT.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "7 days",
        });

        // verify public token
        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.log("error verify: ", err);
            } else {
                console.log("decode verify: ", decoded);
            }
        });

        return {
            accessToken,
            refreshToken,
        };
    } catch (err) {}
};

module.exports = {
    createTokenPair,
};
