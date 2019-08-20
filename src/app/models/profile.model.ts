export class Profile {
  constructor(
    public username: string,
    public password: string,
    public password_confirmation: string,
    public ic: string,
    public fullname: string,
    public telNo: string,
    public location: string,
    public image: any
  ) {}
}