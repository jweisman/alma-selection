import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { marcHtmlXsl } from './marc-html.xsl';

@Component({
  selector: 'app-marc-html',
  template: '<div class="marc-html" #marchtml></div>',
  styleUrls: ['./marc-html.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MarcHtmlComponent implements OnInit {
  @Input() record: string;
  @ViewChild('marchtml', { static: true }) div: ElementRef;

  constructor() { }

  ngOnInit() {
    const doc = new DOMParser().parseFromString(this.record, "application/xml");
    const xsldoc = new DOMParser().parseFromString(marcHtmlXsl, "application/xml");
    const parser = new XSLTProcessor();
    parser.importStylesheet(xsldoc);
    const serializer = new XMLSerializer();
    this.div.nativeElement.innerHTML = serializer.serializeToString(parser.transformToDocument(doc));
  }

}
