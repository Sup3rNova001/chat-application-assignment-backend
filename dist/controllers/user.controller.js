"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserController {
    static create(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //search in database if user with given email exixts
                const user = yield user_model_1.User.findOne({ email: request.body.email });
                if (user) {
                    //if user with same email exists responde with error message
                    response
                        .status(400)
                        .json({ message: "A user with same email already exist!" });
                }
                else {
                    //else if user with smae email doesn't exist create new user
                    const hash = yield bcrypt_1.default.hash(request.body.password, 10);
                    const user = new user_model_1.User(Object.assign(Object.assign({}, request.body), { password: hash }));
                    const result = yield user.save();
                    response.status(201).json(result);
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
    static getOne(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = request.params._id;
                const user = yield user_model_1.User.findOne({ _id: userId });
                if (user) {
                    response.status(200).json(user);
                }
                else {
                    response.status(401).json({ message: "No user found with given id" });
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
    static getAll(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_model_1.User.find();
                response.status(200).json(users);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = request.params._id;
                const user = yield user_model_1.User.findOneAndUpdate({ _id: userId }, request.body, {
                    new: true,
                });
                if (user) {
                    response.status(200).json(user);
                }
                else {
                    response.status(401).json({ message: "No user found with given id" });
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
    static delete(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = request.params._id;
                const user = yield user_model_1.User.findOneAndDelete({ _id: userId });
                if (user) {
                    response
                        .status(200)
                        .json({ message: "deleted user with given id", user });
                }
                else {
                    response.status(401).json({ message: "No user found with given id" });
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.UserController = UserController;
