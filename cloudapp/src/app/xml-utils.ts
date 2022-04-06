
  /** Execute XPath */
  const select = (doc: Document, expression: string, options: {context?: Node, single?: boolean, resolver?: XPathNSResolver}={context: null, resolver: null, single: false}) => {
    const evaluator = new XPathEvaluator();
    const resolver = options.resolver || resolverFactory(doc.documentElement);
    return evaluator.evaluate(expression, options.context || doc, resolver, options.single ? XPathResult.FIRST_ORDERED_NODE_TYPE : XPathResult.ANY_TYPE, null);
  }

  const selectSingleNode = (doc: Document, expression: string, context?: Node) => {
    return select(doc, expression, { single: true, context }).singleNodeValue;
  }

  const selectText = (doc: Document, expression: string, context?: Node) => {
    const node = selectSingleNode(doc, expression, context);
    return node && node.textContent;
  }

  const resolverFactory = (element: Element): XPathNSResolver => {
    const resolver = element.ownerDocument.createNSResolver(element);
    const defaultNamespace = element.getAttribute('xmlns');
    // @ts-ignore 
    return (prefix: string) => resolver.lookupNamespaceURI(prefix) || defaultNamespace;
  }

  /** Converts XPathResult to Array */
  const xpathToArray = (nodes: XPathResult) => {
    let result: Array<string> = [];
    let node = nodes.iterateNext();
    while (node) {
      result.push(node.textContent);
      node = nodes.iterateNext();
    }
    return result;
  };

  /** Adds Element to dom and returns it */
  const dom = (name: string, options: {parent?: Element | Node, text?: string, className?: string, 
    id?: string, ns?: string, attributes?: string[][]} = {}): Element => {
    let ns = options.ns || ((options.parent && options.parent instanceof Element) ? options.parent.namespaceURI : '');
    let element = document.createElementNS(ns, name);
    
    if (options.parent) options.parent.appendChild(element);
    if (options.text) element.innerHTML = options.text;
    if (options.className) element.className = options.className;
    if (options.id) element.id = options.id;
    if (options.attributes) options.attributes.forEach(([att, val]) => element.setAttribute(att, val));

    return element;  
  };

  export { dom, select, selectSingleNode, selectText, xpathToArray }