"use strict";

const DiscountTypeAppliesTo = Object.freeze({
    ALL: "ALL",
    SPECIFIC: "SPECIFIC",
});

const DiscountType = Object.freeze({
    FIXED: "FIXED",
    PERCENTAGE: "PERCENTAGE",
});

const CartStateEnum = Object.freeze({
    ACTIVE: "ACTIVE",
    COMPLETED: "COMPLETED",
    CANCELED: "CANCELED",
    PENDING: "PENDING",
});

module.exports = {
    DiscountTypeAppliesTo,
    DiscountType,
    CartStateEnum,
};
