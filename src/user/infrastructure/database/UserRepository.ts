import { Connection } from "mysql2";
import User from "../../domain/entity/User";
import * as UserRepositoryInterface from "../../domain/repository/UserRepository";
import Email from "../../domain/valueobject/Email";
import Name from "../../domain/valueobject/Name";
import Password from "../../domain/valueobject/Password";
import ResetPasswordToken from "../../domain/valueobject/ResetPasswordToken";

export default class UserRepository implements UserRepositoryInterface.default {
  private _connection: Connection;
  constructor(connection: Connection) {
    this._connection = connection;
  }
  public getUser(email: Email): Promise<User | undefined> {
    return new Promise<User | undefined>(async (resolve, reject) => {
      this._connection.query(
        `SELECT 
          first_name, 
          last_name, 
          salt,
          hashed_password, 
          is_administrator 
          FROM users WHERE email = ? LIMIT 1`,
        [email.toString()],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);
            reject(new Error("failed get an user"));
          }
          if (result.length > 0) {
            resolve(
              new User(
                new Name(result[0].first_name, result[0].last_name),
                email,
                result[0].is_administrator,
                new Password(result[0].salt, result[0].hashed_password),
                new ResetPasswordToken(result[0].token, result[0].token_expiry)
              )
            );
          }
          reject(undefined);
        }
      );
    });
  }
  public saveUser(user: User): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._connection.query(
        `INSERT INTO users (
          first_name, 
          last_name, 
          email, 
          is_administrator,
          salt, 
          hashed_password
          ) 
          VALUES (?, ?, ?, ?, ?, ?)`,
        [
          user.name.first,
          user.name.last,
          user.email.toString(),
          user.isAdministrator,
          user.password!.salt,
          user.password!.hashedPassword,
        ],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);
            reject(new Error("failed save an user"));
          }
          resolve(result);
        }
      );
    });
  }
  public updateUser(user: User): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._connection.query(
        `UPDATE users SET 
          first_name = ?, 
          last_name = ?, 
          email = ?, 
          hashed_password = ? 
          WHERE email = ?`,
        [
          user.name.first,
          user.name.last,
          user.password?.hashedPassword,
          user.resetPasswordToken?.token,
          user.resetPasswordToken?.tokenExpiry,
          user.email.toString(),
        ],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);
            reject(new Error("failed update an user"));
          }
          resolve(result);
        }
      );
    });
  }

  public deleteUser(email: Email): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._connection.query(
        "DELETE FROM users WHERE is_Administrator IS NOT TRUE AND email = ?",
        [email.toString()],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);
            reject(new Error("failed delete an user"));
          }
          resolve(result);
        }
      );
    });
  }
}
