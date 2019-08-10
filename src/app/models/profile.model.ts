export class Profile {
  constructor(
    public username: string,
    public password: string,
    public confirmPassword: string,
    public ic: string,
    public fullname: string
  ) {}
}