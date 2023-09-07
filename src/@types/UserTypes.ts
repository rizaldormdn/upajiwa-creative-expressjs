export type UserTypes = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  isAdministrator: boolean;
  resetPasswordToken: {
    token: string;
    tokenExpiry: Date;
  };
  createdAt: number;
  updatedAt: number;
};
