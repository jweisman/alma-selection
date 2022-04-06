import { Component, Inject } from '@angular/core';
import { AlmaService } from '../services/alma.service';
import { Bib } from '../models/alma';
import { finalize } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PromptDialog, PromptDialogData } from 'eca-components';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-view-records',
  templateUrl: './view-records.dialog.html',
  styleUrls: ['./view-records.dialog.scss']
})

export class ViewRecordsDialog extends PromptDialog {

  records: Bib[];
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PromptDialogData,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<PromptDialog>,
    private alma: AlmaService,
  ) {
    super(data,translate,dialogRef);
  }

  ngOnInit() {
    this.loading = true;
    this.alma.getBibs(this.data.val)
    .pipe(
      finalize(() => this.loading = false)
    )
    .subscribe(
      results => this.records = results.bib
    )
  }

}
