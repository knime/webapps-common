interface Credentials {
  username: string;
  password: string;
  secondFactor: string;
  isHiddenPassword?: boolean;
  isHiddenSecondFactor?: boolean;
  flowVariableName?: string | null;
}

export default Credentials;
