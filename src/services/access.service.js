"user strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keytoken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
    BadRequestError,
    AuthFailureError,
    ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

class AccessService {
    /*
        1 - check this token used
    */
    static handlerRefreshToken = async (refreshToken) => {
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(
            refreshToken
        );
        if (foundToken) {
            // decode xem co trong he thong hay khong
            const { userId, email } = await verifyJWT(
                refreshToken,
                foundToken.privateKey
            );
            console.log({ userId, email });
            // delete all token in keyStore
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError(
                "Something wrong happened!! Please login again"
            );
        }

        const holderToken = await KeyTokenService.findByRefreshToken(
            refreshToken
        );

        if (!holderToken) throw new AuthFailureError("Email not registered!");

        // verify token
        const { userId, email } = await verifyJWT(
            refreshToken,
            holderToken.privateKey
        );
        console.log("[2]--", { userId, email });
        // check UserId
        const foundEmail = await findByEmail({ email });
        if (!foundEmail) throw new AuthFailureError("Email not registered!");

        // create new token pair
        const tokens = await createTokenPair(
            { userId, email },
            holderToken.publicKey,
            holderToken.privateKey
        );

        // update token to token used
        await KeyTokenService.updateTokenByRefreshToken(
            tokens.refreshToken,
            refreshToken
        );

        return {
            user: { userId, email },
            tokens: tokens,
        };
    };

    static logout = async ({ keyStore }) => {
        const delKeyStore = await KeyTokenService.removeKeyById(keyStore._id);
        return delKeyStore;
    };

    /*
        1 - Check email in database
        2 - match password
        3 - create access token and refresh token and save
        4 - generate tokens
        5 - get data return login
    */
    static login = async ({ email, password, refreshToken = null }) => {
        // 1
        const foundAccount = await findByEmail({ email });
        if (!foundAccount) throw new BadRequestError("Email not registered");

        // 2
        const matchPassword = await bcrypt.compare(
            password,
            foundAccount.password
        );
        if (!matchPassword) throw new AuthFailureError("Authentication Error");

        // 3
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 4096,
            publicKeyEncoding: {
                // public key cryptographic standard
                type: "pkcs1",
                format: "pem",
            },
            privateKeyEncoding: {
                // public key cryptographic standard
                type: "pkcs1",
                format: "pem",
            },
        });

        // 4
        const tokens = await createTokenPair(
            { userId: foundAccount._id, email },
            publicKey,
            privateKey
        );
        await KeyTokenService.createKeyToken({
            userId: foundAccount._id,
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
        });

        return {
            code: 200,
            metadata: {
                user: getInfoData({
                    fields: ["_id", "name", "email"],
                    object: foundAccount,
                }),
                tokens,
            },
        };
    };

    static signUp = async ({ name, email, password }) => {
        // step 1: check email exist
        // use lean will return a pure object javascript
        // it will resize return data
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError("Error: Email already registered!");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP],
        });

        if (newShop) {
            // created privateKey, publicKey
            // use has private key
            // system store public key
            // private key use to sync token
            // public key use to verify token
            console.log("crete new");
            const { privateKey, publicKey } = crypto.generateKeyPairSync(
                "rsa",
                {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        // public key cryptographic standard
                        type: "pkcs1",
                        format: "pem",
                    },
                    privateKeyEncoding: {
                        // public key cryptographic standard
                        type: "pkcs1",
                        format: "pem",
                    },
                }
            );
            console.log("private key: " + privateKey);
            console.log("public key: " + publicKey);
            // if exist handle save to collection KeyStore

            const publicKeyString = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
            });

            if (!publicKeyString) {
                throw new BadRequestError("Public key string error");
            }

            const publicKeyObject = crypto.createPublicKey(publicKeyString);

            // create token pair
            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKeyObject,
                privateKey
            );
            console.log("create token pair success: " + tokens);

            return {
                code: 201,
                metadata: {
                    user: getInfoData({
                        fields: ["_id", "name", "email"],
                        object: newShop,
                    }),
                    tokens: tokens,
                },
            };
        }
        return {
            code: 201,
            metadata: null,
        };
    };
}

module.exports = AccessService;
