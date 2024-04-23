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

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel
            .findOne({ refreshTokensUsed: refreshToken })
            .lean();
    };

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken }).lean();
    };

    static deleteKeyById = async (id) => {
        return await keyTokenModel.findOneAndDelete({
            user: new Types.ObjectId(id),
        });
    };

    static updateTokenByRefreshToken = async (
        newRefreshToken,
        refreshToken
    ) => {
        const result = await keyTokenModel.findOneAndUpdate(
            { refreshToken: refreshToken },
            {
                $set: {
                    refreshToken: newRefreshToken,
                },
                $push: {
                    refreshTokensUsed: refreshToken,
                },
            },
            { new: true }
        );
        return result;
    };
}

module.exports = KeyTokenService;
