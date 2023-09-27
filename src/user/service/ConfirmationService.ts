import User from "../domain/entity/User";

export default interface ConfirmationService {
  sendConfirmation(user: User): Promise<void>;
}
