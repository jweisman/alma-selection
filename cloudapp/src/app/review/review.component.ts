import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogService } from 'eca-components';
import { from } from 'rxjs';
import { finalize, mergeMap, tap, toArray } from 'rxjs/operators';
import { Bib, Identifier } from '../models/bib';
import { AlmaService } from '../services/alma.service';
import { SessionService } from '../services/session.service';
import { ViewRecordsDialog } from '../view-records/view-records.dialog';

const MAX_CONCURENT_SRU = 10;

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['select', 'title', 'author', 'identifiers', 'match', 'actions'];
  dataSource = new MatTableDataSource<Bib>();
  selection = new SelectionModel<Bib>(true, []);
  matched = 0;
  percentComplete = 0;
  loading = false;

  constructor(
    private session: SessionService,
    private alma: AlmaService,
    private router: Router,
    private dialog: DialogService,
  ) { }

  ngOnInit() {
    /* Limit for testing */
    const bibs = this.session.bibs.slice(0, 20);
    this.loading = true;
    from(bibs)
    .pipe(
      mergeMap(bib => this.alma.match(bib), MAX_CONCURENT_SRU),
      tap(() => {
        this.matched++;
        this.percentComplete = 
          Math.round((this.matched/bibs.length)*100);
      }),
      toArray(),
      finalize(() => this.loading = false)
    )
    .subscribe(
      result => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.data = result;
      }
    )
  }

  ngAfterViewInit() {

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data && this.dataSource.data.length;
    return numSelected === numRows;
  }

  reset() {
    this.selection.clear();
  }

  view(bib: Bib) {
    this.dialog.prompt(ViewRecordsDialog,{ val: bib.matchResults })
    .subscribe((result: string) => {
      console.log('result', result)
    })
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Bib): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  displayIdentifiers(identifiers: Identifier[]) {
    return identifiers.map(i => (i.type ? i.type + ': ' : '') + i.value).join(', ');
  }

}
