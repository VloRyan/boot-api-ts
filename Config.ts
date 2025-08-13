class Configuration {
  private static _instance: Configuration;
  public ApiPath: string;

  private constructor() {
    this.ApiPath = "";
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }
}

export const Config = Configuration.Instance;
