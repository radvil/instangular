import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  constructor() { }

  static loadInitialState() {
    return Object.keys(localStorage).reduce((state: any, storageKey) => {
      if (storageKey.includes(env.appName)) {
        const stateKeys = storageKey
          .replace(env.appName, '')
          .toLowerCase()
          .split('.')
          .map((key) =>
            key
              .split('-')
              .map((token, index) =>
                index === 0
                  ? token
                  : token.charAt(0).toUpperCase() + token.slice(1)
              )
              .join('')
          );

        let currentStateRef = state;
        stateKeys.forEach((key, index) => {
          if (index === stateKeys.length - 1) {
            currentStateRef[key] = JSON.parse(localStorage.getItem(storageKey));
            return;
          }

          currentStateRef[key] = currentStateRef[key] || {};
          currentStateRef = currentStateRef[key];
        });
      }

      return state;
    }, {});
  }

  public setItem(key: string, value: any): void {
    localStorage.setItem(`${env.appName}-${key}`, JSON.stringify(value));
  }

  public getItem(key: string): any {
    let itemFromLS = localStorage.getItem(`${env.appName}-${key}`);
    if (itemFromLS) {
      return JSON.parse(itemFromLS);
    } else {
      return null;
    }
  }

  public removeItem(key: string): void {
    localStorage.removeItem(`${env.appName}-${key}`);
  }

  /** Tests that localStorage exists, can be written to, and read from. */
  public testLocalStorage(): void {
    const testValue = 'testValue';
    const testKey = 'testKey';
    let retrievedValue: string;
    const errorMessage = 'Local storage did not return expected value';

    this.setItem(testKey, testValue);
    retrievedValue = this.getItem(testKey);
    this.removeItem(testKey);

    if (retrievedValue !== testValue) {
      throw new Error(errorMessage);
    }
  }
}
