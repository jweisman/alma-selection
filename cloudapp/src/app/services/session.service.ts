import { Injectable } from "@angular/core";
import { CloudAppStoreService } from "@exlibris/exl-cloudapp-angular-lib";
import { map, tap } from "rxjs/operators";
import { Bib } from "../models/bib";

const SESSION_STORE = 'SESSION';

@Injectable({
  providedIn: 'root'
})
export class SessionService { 

  private _bibs: Bib[];

  constructor(
    private store: CloudAppStoreService,
  ) { }

  set bibs(value: Bib[]) {
    this.store.set(SESSION_STORE, value)
    .subscribe();
    this._bibs = value;
  }

  get bibs() {
    return this._bibs;
  }

  checkExistingSession() {
    return this.store.get(SESSION_STORE)
    .pipe(
      tap(value => this._bibs = value),
      map(value => !!value),
    )
  }

  clear() {
    this._bibs = undefined;
    this.store.remove(SESSION_STORE).subscribe();
  }
}