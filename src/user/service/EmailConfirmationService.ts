import { SendMailOptions, Transporter } from "nodemailer";
import ConfirmationService from "./ConfirmationService";
import User from "../domain/entity/User";

export default class EmailConfirmationService implements ConfirmationService {
  private _transporter: Transporter;
  private _sendMailOption: SendMailOptions;

  constructor(transporter: Transporter, sendMailOptions: SendMailOptions) {
    this._transporter = transporter;
    this._sendMailOption = sendMailOptions;
  }

  public sendConfirmation(user: User): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._sendMailOption.to = user.email.toString();
      this._sendMailOption.subject = process.env.EMAIL_CONFIRMATION_SERVICE;
      this._sendMailOption.html = `<p>please visit a ${process.env.RESET_PASSWORD_URL}</p>`
    });
  }
}
