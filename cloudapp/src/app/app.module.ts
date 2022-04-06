import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule, CloudAppTranslateModule, AlertModule } from '@exlibris/exl-cloudapp-angular-lib';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ReviewComponent } from './review/review.component';
import { MarcHtmlComponent } from './marc-html/marc-html.component';
import { DialogModule } from 'eca-components';
import { ViewRecordsDialog } from './view-records/view-records.dialog';

@NgModule({
  declarations: [			
    AppComponent,
    MainComponent,
    ReviewComponent,
    MarcHtmlComponent,
    ViewRecordsDialog,
   ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AlertModule,
    FormsModule,
    ReactiveFormsModule,     
    NgxDropzoneModule,
    CloudAppTranslateModule.forRoot(),
    DialogModule,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'standard' } },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ViewRecordsDialog],
})
export class AppModule { }
