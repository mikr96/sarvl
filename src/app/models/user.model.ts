export class User {
  _data: any = {
    username: '',
    fullname: '',
    ic: '',
    dp: '',
    created_at: ''
  }
  constructor(
    public role: string,
    private _token: string,
    private _isAdmin: boolean,
    private _id: string,
  ) { }


  public set user(user: any) {
    this._data.username = user.username
    this._data.fullname = user.fullname
    this._data.ic = user.ic
    this._data.dp = user.dp
    this._data.created_at = user.created_at
  }

  public get getUser() {
    return this._data
  }

  get data() {
    return
  }

  get token() {
    return this._token;
  }

  get isAdmin() {
    return this._isAdmin
  }

  get id() {
    return this._id
  }
}
