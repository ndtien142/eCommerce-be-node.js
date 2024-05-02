const _ = require("lodash");
const { Types } = require("mongoose");

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

// convert ['a', 'b'] => {a: 1, b: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (unSelect = []) => {
    return Object.fromEntries(unSelect.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach((k) => {
        if (obj[k] == null || obj[k] === undefined) {
            delete obj[k];
        }
    });

    return obj;
};
/**
    In mongoose have 100 nested objects.
    {
        a : 1,
        c : {
            b : 2,
            d: 3
        }
    }

    will convert to 

    {
        a: 1,
        'c.b' : 2,
        'c.d' : 3
    }

 */

const updateNestedObject = (obj) => {
    const final = {};
    Object.keys(obj || {}).forEach((key) => {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            const response = updateNestedObject(obj[key]);
            Object.keys(response || {}).forEach((k) => {
                final[`${key}.${k}`] = response[k];
            });
        } else {
            final[key] = obj[key];
        }
    });
    return final;
};

module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObject,
    convertToObjectIdMongodb,
};
