"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: {
        filename: { type: String, required: false },
        url: { type: String, required: false },
    },
    date: { type: Date, default: Date.now },
});
// Define a virtual field for chatRooms
exports.userSchema.virtual('chatRooms', {
    ref: 'Chat',
    localField: '_id',
    foreignField: 'participants',
});
exports.User = (0, mongoose_1.model)("User", exports.userSchema);
