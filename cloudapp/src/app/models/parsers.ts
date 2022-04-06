import { select } from "../xml-utils";
import { Bib } from "./bib";

const serializer = new XMLSerializer();

const marc21XPaths = {
  controlNumber: 'controlfield[@tag="001"]',
  title: 'datafield[@tag="245"]/subfield[@code="a"]',
  author: 'datafield[@tag="100"]/subfield[@code="a"]',
  identifiers: 'datafield[@tag="035"]/subfield[@code="a"]',
}

const parseMarcXml = (xml: string): Bib[] => {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  let records = select(doc, `/collection/record`), record: Element;
  let bibs: Bib[] = [];
  while (record = records.iterateNext() as Element) {
    bibs.push(marcXmlToBib(doc, record));
  }
  return bibs;
}

const marcXmlToBib = (doc: Document, record: Element): Bib => {
  let bib = new Bib();
  Object.entries(marc21XPaths).forEach(([key, value]) => {
    const results = select(doc, value, { context: record });
    let result: Element, values = [];
    while (result = results.iterateNext() as Element) {
      switch (key) {
        case 'identifiers':
          const regexp = /(\((\S+)\))?\s*(.*)$/;
          const matches = result.textContent.match(regexp);
          values.push({ type: matches[2], value: matches[3]});
          break;
        default:
          values.push(result.textContent);
      }
      bib[key] = Array.isArray(bib[key]) ? values : values[0];
    }
  });
  bib.record = serializer.serializeToString(record);
  return bib;
}

export { marcXmlToBib, parseMarcXml }