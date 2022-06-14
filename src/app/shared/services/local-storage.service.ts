import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  setItem<T>(key: string, value: T): boolean {
    if (this.storage) {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    }

    return false;
  }

  getItem<T>(key: string): T | null {
    if (this.storage) {
      return JSON.parse(this.storage.getItem(key));
    }

    return null;
  }

  removeItem(key: string): boolean {
    if (this.storage) {
      this.storage.removeItem(key);
      return true;
    }

    return false;
  }

  clear(): boolean {
    if (this.storage) {
      this.storage.clear();
      return true;
    }

    return false;
  }
}
