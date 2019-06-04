"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser = require("node-html-parser");
class HtmlParser {
    constructor(htmlString) {
        this.findNodeByClass = (wordToFind, arrayOfNodes) => {
            for (const node of arrayOfNodes) {
                if (node.classNames) {
                    for (const className of node.classNames) {
                        if (className.indexOf(wordToFind) > -1) {
                            return node;
                        }
                    }
                    if (node.childNodes) {
                        const foundNode = this.findNodeByClass(wordToFind, node.childNodes);
                        if (foundNode) {
                            return foundNode;
                        }
                    }
                }
            }
        };
        this.MainHtml = Parser.parse(htmlString);
    }
    getNodesByContents() {
        // add this sometime
    }
}
exports.HtmlParser = HtmlParser;
