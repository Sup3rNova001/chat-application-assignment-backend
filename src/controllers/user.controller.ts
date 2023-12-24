import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
export class UserController {
  static async create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //search in database if user with given email exixts
      const user = await User.findOne({ email: request.body.email });

      if (user) {
        //if user with same email exists responde with error message
        response
          .status(400)
          .json({ message: "A user with same email already exist!" });
      } else {
        //else if user with smae email doesn't exist create new user
        const hash = await bcrypt.hash(request.body.password, 10);

        const user = new User({ ...request.body, password: hash });

        const result = await user.save();

        response.status(201).json(result);
      }
    } catch (err) {
      next(err);
    }
  }

  static async getOne(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = request.params._id;
      const user = await User.findOne({ _id: userId });
      if (user) {
        response.status(200).json(user);
      } else {
        response.status(401).json({ message: "No user found with given id" });
      }
    } catch (err) {
      next(err);
    }
  }

  static async getAll(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await User.find();
      response.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

  static async update(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = request.params._id;
      const user = await User.findOneAndUpdate({ _id: userId }, request.body, {
        new: true,
      });
      if (user) {
        response.status(200).json(user);
      } else {
        response.status(401).json({ message: "No user found with given id" });
      }
    } catch (err) {
      next(err);
    }
  }

  static async delete(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = request.params._id;
      const user = await User.findOneAndDelete({ _id: userId });
      if (user) {
        response
          .status(200)
          .json({ message: "deleted user with given id", user });
      } else {
        response.status(401).json({ message: "No user found with given id" });
      }
    } catch (err) {
      next(err);
    }
  }
}
