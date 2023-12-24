"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityCheck = exports.generateToken = void 0;
// import { Request, Response, NextFunction } from 'express';
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const secret = (_a = process.env.ACCESS_TOKEN_SECRET) !== null && _a !== void 0 ? _a : "d9c88113b44bc263987cac0c544ef3ea8c97c14811b50bbe24f91528a8e7c2f447754105852849b1dc18fc48e8e4add3466e6eaee9640278c219f743dc8d955f";
const generateToken = (user) => {
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, secret, {
        algorithm: "HS256",
        expiresIn: "30d",
    });
    return token;
};
exports.generateToken = generateToken;
function securityCheck(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return response
                .status(401)
                .json({ message: "Unauthorized: Token missing or invalid" });
        }
        const token = authorizationHeader.slice(7);
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, secret);
            ;
            request.userId = decodedToken.id;
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                return response
                    .status(401)
                    .json({ message: "Unauthorized: Token expired" });
            }
            return response
                .status(401)
                .json({ message: "Unauthorized: Invalid token" });
        }
    });
}
exports.securityCheck = securityCheck;
