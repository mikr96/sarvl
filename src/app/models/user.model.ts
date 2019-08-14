export class User {
  constructor(
    public role: string,
    private _token: string
  ) {}

  get token() {
    return this._token;
  }
}
