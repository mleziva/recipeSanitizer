import * as Parser from 'node-html-parser';
export class SiteObject {
    hostname: string;
    urlInfo: UrlInfo;
    useIframe: boolean;
    recipeNodeIdentifiers: string[];
    recipeNameIdentifier: string;
    private htmlParser: Parser.HTMLElement;

    constructor(public url: string) {
    }
    getPrintUrl = () => {
        let mainUrl = '';
        let truncateIndex = this._nthIndex(this.url, '/', this.urlInfo.truncateCount);
        if (truncateIndex === -1) {
            truncateIndex = this.url.indexOf('?');
        }
        mainUrl = this.url.substr(0, truncateIndex);
        return `${mainUrl}/${this.urlInfo.printKeyword}`;
    }
    getRecipeName = () => {
        const nameNode = this.htmlParser.querySelector(this.recipeNameIdentifier);
        return nameNode.text;
      }
    private _nthIndex = (str, pat, numToGet) => {
        const L = str.length;
        let i = -1;
        let n = numToGet;
        while (n-- && i++ < L) {
            i = str.indexOf(pat, i);
            if (i < 0) { break; }
        }
        return i;
    }
    private _parseHtml = (content) => {
        //need to figure out this casting
        this.htmlParser = Parser.parse(content, {
            script: false,
            style: false,
            pre: false,
        });
      }


function _getRecipeBody(selectors) {
    let recipe = '';
    if (selectors.length === 0) {
      return htmlRoot.innerHTML.toString();
    }
    for (let i = 0; i < selectors.length; i++) {
      const foundElement = htmlRoot.querySelector(selectors[i]);
      if (foundElement) {
        recipe += htmlRoot.querySelector(selectors[i]).toString();
      }
    }
    return recipe;
  }
}

class UrlInfo {
    format: string;
    truncateCount: string;
    printKeyword: string;
}