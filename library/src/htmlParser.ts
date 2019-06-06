import * as Parser from 'node-html-parser';

export class HtmlParser {
    MainHtml: Parser.Node;

    constructor(htmlString: string) {
        this.MainHtml = Parser.parse(htmlString,
          {
            script: false,
            style: false,
            pre: false,
          }
          );
    }
    getNodeByInnerHtml  = (filterExpression: RegExp) => {
      return this._getNodeByInnerHtml(filterExpression, this.MainHtml.childNodes as Parser.HTMLElement[]);
    }

    private _getNodeByInnerHtml = (filterExpression: RegExp,  arrayOfNodes: Parser.HTMLElement[]) => {
      for (const node of arrayOfNodes) {
        if (node.outerHTML) {
          if (filterExpression.test(node.outerHTML)) {
            return node;
          }
          if (node.childNodes) {
            const foundNode: Parser.HTMLElement = this._getNodeByInnerHtml(filterExpression, node.childNodes as Parser.HTMLElement[]);
            if (foundNode) { return foundNode; }
          }
        }
      }
    }
    private findNodeByClass = (wordToFind: string, arrayOfNodes: Parser.HTMLElement[]) => {
        for (const node of arrayOfNodes) {
          if (node.classNames) {
            for (const className of node.classNames) {
              if (className.indexOf(wordToFind) > -1) {
                return node;
              }
            }
            if (node.childNodes) {
              const foundNode: Parser.HTMLElement = this.findNodeByClass(wordToFind, node.childNodes as Parser.HTMLElement[]);
              if (foundNode) { return foundNode; }
            }
          }
        }
      }
}
