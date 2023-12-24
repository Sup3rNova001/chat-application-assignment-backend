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
exports.AuthController = void 0;
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const security_middleware_1 = require("../middlewares/security.middleware");
class AuthController {
    static login(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //search in database if user with given email exixts
                const user = yield user_model_1.User.findOne({ email: request.body.email });
                if (!user) {
                    //if user with given email doesnt exists respond with error message
                    response.status(401).json({
                        Login: "Unsuccessful",
                        error: "User with provided email not found",
                    });
                }
                else {
                    //else if user with given email
                    // console.log(user.password);
                    // console.log(request.body.password);
                    const passwordMatch = yield bcrypt_1.default.compare(request.body.password, user.password);
                    // console.log(passwordMatch);
                    if (passwordMatch) {
                        const token = (0, security_middleware_1.generateToken)(user);
                        response.cookie("token", token, {
                            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                        });
                        response.status(200).json({ Login: "Successful", token, user });
                    }
                    else {
                        response
                            .status(400)
                            .json({ Login: "Unsuccessful", error: "Incorrect password!" });
                    }
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.AuthController = AuthController;
