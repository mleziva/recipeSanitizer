import * as Parser from 'node-html-parser';

export class HtmlParser {
    MainHtml: Parser.Node;

    constructor(htmlString: string) {
        this.MainHtml = Parser.parse(htmlString);
    }

    getNodesByContents () {
        // add this sometime
    }
    findNodeByClass = (wordToFind: string, arrayOfNodes: Parser.HTMLElement[]) => {
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