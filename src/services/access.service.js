"user strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keytoken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // step 1: check email exist
            // use lean will return a pure object javascript
            // it will resize return data
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    code: "20001",
                    message: "Email already registered",
                };
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
                    return {
                        code: "20001",
                        message: "publicKeyString Error",
                    };
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
                    code: 200,
                    metadata: {
                        shop: getInfoData({
                            fields: ["_id", "name", "email"],
                            object: newShop,
                        }),
                        tokens: tokens,
                    },
                };
            }

            return {
                code: 200,
                metadata: null,
            };
        } catch (err) {
            return {
                code: "5001",
                message: err.message,
                status: "error",
            };
        }
    };
}

module.exports = AccessService;
