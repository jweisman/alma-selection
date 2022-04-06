import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CloudAppEventsService, CloudAppRestService } from "@exlibris/exl-cloudapp-angular-lib";
import { map, switchMap } from "rxjs/operators";
import { Bib, Identifier } from "../models/bib";
import { Bibs } from '../models/alma';
import { select, xpathToArray } from "../xml-utils";

@Injectable({
  providedIn: 'root'
})
export class AlmaService { 

  constructor(
    private http: HttpClient,
    private eventsService: CloudAppEventsService,
    private restService: CloudAppRestService,
  ) {};

  search(bib: Bib) {
    const options: Object = {
      responseType: 'text',
      params: this.buildQuery(bib),
    };
    return this.eventsService.getInitData()
    .pipe(
      switchMap(initData => this.http.get<string>(`/view/sru/${initData.instCode}`, options)),
    )
  }

  getBibs(mmsIds: string[]) {
    return this.restService.call<Bibs>(`/bibs?mms_id=${mmsIds.join(',')}`);
  }

  getBib(mmsId: string) {
    return this.restService.call(`/bibs/${mmsId}`);
  }

  match(bib: Bib) {
    return this.search(bib)
    .pipe(
      map(resp => {
        const doc = new DOMParser().parseFromString(resp, "application/xml");
        const results = select(doc, CONTROL_NUMBER_XPATH, { resolver: SRU_NS_RESOLVER });
        bib.matchResults = xpathToArray(results);
        return bib;
      })
    )
  }

  private buildQuery(bib: Bib): HttpParams {
    const IDENTIFIER_TYPE = 'DE-604';
    return new HttpParams()
    .append('version', '1.2')
    .append('operation', 'searchRetrieve')
    .append('recordSchema', 'marcxml')
    .append('query', encodeURI(`alma.title="${bib.title}"${this.extractIdentifier(bib.identifiers, IDENTIFIER_TYPE)}`));
  }

  private extractIdentifier(identifiers: Identifier[], prefix: string) {
    const identifier = identifiers.find(i => i.type == prefix);
    return identifier ? ` and alma.other_system_number=${identifier.value}` : '';
  }
}

/* First three results */
const CONTROL_NUMBER_XPATH = '/sru:searchRetrieveResponse/sru:records/sru:record[position()<=3]/sru:recordData/marc:record/marc:controlfield[@tag="001"]';
const SRU_NS_RESOLVER = (prefix: string) => {
  var ns = {
    'sru': 'http://www.loc.gov/zing/srw/',
    'marc': 'http://www.loc.gov/MARC21/slim'
  };
  return ns[prefix] || null;
}