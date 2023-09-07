import User from "../../domain/entity/User";

export type MeJSON = {
  email: string;
  name: {
    first_name: string;
    last_name: string;
    full_name: string;
  };
  password: {
    salt: string;
    hashed_password: string;
  };
  is_administrator: boolean;
};
export type UserJSON = {
  email: string;
  name: {
    first_name: string;
    last_name: string;
    full_name: string;
  };
  password: {
    salt: string;
    hashed_password: string;
  };
  is_administrator: boolean;
};

export default class UserMapper {
  public static fromJSON(user: UserJSON): MeJSON {
    return {
      email: user.email,
      name: {
        first_name: user.name.first_name,
        last_name: user.name.last_name,
        full_name: user.name.full_name,
      },
      password: {
        salt: user.password.salt,
        hashed_password: user.password.hashed_password,
      },
      is_administrator: Boolean(user.is_administrator),
    };
  }

  public static toJSON(user: User): UserJSON {
    return {
      email: user.email.toString(),
      name: {
        first_name: user.name.first,
        last_name: user.name.last,
        full_name: user.name.full(),
      },
      password: {
        salt: String(user.password?.salt),
        hashed_password: String(user.password?.hashedPassword),
      },
      is_administrator: user.isAdministrator,
    };
  }
}
