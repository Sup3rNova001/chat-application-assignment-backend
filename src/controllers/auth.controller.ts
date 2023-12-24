import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../middlewares/security.middleware";
export class AuthController {
  static async login(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //search in database if user with given email exixts
      const user = await User.findOne({ email: request.body.email });

      if (!user) {
        //if user with given email doesnt exists respond with error message
        response.status(401).json({
          Login: "Unsuccessful",
          error: "User with provided email not found",
        });
      } else {
        //else if user with given email
        // console.log(user.password);
        // console.log(request.body.password);
        const passwordMatch = await bcrypt.compare(
          request.body.password,
          user.password
        );

        // console.log(passwordMatch);
        if (passwordMatch) {
          const token = generateToken(user);

          response.cookie("token", token, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            httpOnly: true,
            secure: true,
            sameSite: "none",
          });

          response.status(200).json({ Login: "Successful", token, user });
        } else {
          response
            .status(400)
            .json({ Login: "Unsuccessful", error: "Incorrect password!" });
        }
      }
    } catch (err) {
      next(err);
    }
  }
}
