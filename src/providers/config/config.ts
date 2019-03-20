import { Injectable } from '@angular/core';

@Injectable()
export class Config {
  public static apiDomain = 'amonnenpc:8080';
  public static apiBaseUrl = `http://${Config.apiDomain}/api`;
}
