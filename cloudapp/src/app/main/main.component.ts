import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bib } from '../models/bib';
import { parseMarcXml } from '../models/parsers';
import { SessionService } from '../services/session.service';
import { readTextFile } from '../utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  loading = false;
  files: File[] = [];
  existingSession = false;

  constructor(
    private session: SessionService,
    private router: Router,
  ) { }

  ngOnInit(): void { 
    this.session.checkExistingSession()
    .subscribe(result => this.existingSession = result);
  }

  ngOnDestroy(): void { }

  onSelect(event: NgxDropzoneChangeEvent) {
    this.files.push(...event.addedFiles);
  }
   
  onRemove(file: File) {
    this.files.splice(this.files.indexOf(file), 1);
  }

  process() {
    if (this.existingSession) this.router.navigate(['/review']);
    else {
      this.readFiles()
      .subscribe(bibs => {
        this.session.bibs = bibs;
        this.router.navigate(['/review']);
      })
    }
  }

  readFiles() {
    let files: Observable<Bib[]>[] = [];
    this.files.forEach(f => {
      switch(f.type) {
        case 'text/xml':
          files.push(readTextFile(f).pipe(map(text => parseMarcXml(text))));
          break;
        /* Other formats */
        default:
          break;
      }
    })
    return forkJoin(files)
    .pipe(map(texts => texts.flat()))
  }

  reset() {
    this.session.clear();
    this.files = [];
    this.existingSession = false;
  }


}