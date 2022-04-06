/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ViewRecordsDialog } from './view-records.dialog';

describe('ViewRecordsComponent', () => {
  let component: ViewRecordsDialog;
  let fixture: ComponentFixture<ViewRecordsDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRecordsDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRecordsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
