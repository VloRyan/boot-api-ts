class Configuration {
  private static _instance: Configuration;
  public ApiPath: string;

  private constructor() {
    this.ApiPath = "";
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}

export const Config = Configuration.Instance;
