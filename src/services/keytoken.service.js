"use strict";

const keyTokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

class KeyTokenService {
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken,
    }) => {
        try {
            // level 0
            // const publicKeyString = publicKey.toString();
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey: publicKeyString,
            // });

            // return tokens ? tokens.publicKey : null;

            // update level
            const filter = { user: userId },
                update = {
                    publicKey,
                    privateKey,
                    refreshTokesUsed: [],
                    refreshToken,
                },
                options = { upsert: true, new: true };

            const tokens = await keyTokenModel.findOneAndUpdate(
                filter,
                update,
                options
            );

            return tokens ? tokens.publicKey : null;
        } catch (err) {
            return err;
        }
    };
    static findByUserId = async (userId) => {
        return await keyTokenModel
            .findOne({ user: new Types.ObjectId(userId) })
            .lean();
    };
    static removeKeyById = async (id) => {
        const result = await keyTokenModel.deleteOne({
            _id: new Types.ObjectId(id),
        });
        return result;
    };
}

module.exports = KeyTokenService;
