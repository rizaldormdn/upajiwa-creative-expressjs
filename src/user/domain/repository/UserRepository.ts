import User from "../entity/User";
import Email from "../valueobject/Email";

export default interface UserRepository {
  getUser(email: Email): Promise<User | undefined>;
  saveUser(user: User): Promise<void>;
  updateUser(user: User): Promise<void>;
  deleteUser(email: Email): Promise<void>;
}
