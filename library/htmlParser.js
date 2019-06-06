"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser = require("node-html-parser");
class HtmlParser {
    constructor(htmlString) {
        this.getNodeByInnerHtml = (filterExpression) => {
            return this._getNodeByInnerHtml(filterExpression, this.MainHtml.childNodes);
        };
        this._getNodeByInnerHtml = (filterExpression, arrayOfNodes) => {
            for (const node of arrayOfNodes) {
                if (node.outerHTML) {
                    if (filterExpression.test(node.outerHTML)) {
                        return node;
                    }
                    if (node.childNodes) {
                        const foundNode = this._getNodeByInnerHtml(filterExpression, node.childNodes);
                        if (foundNode) {
                            return foundNode;
                        }
                    }
                }
            }
        };
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
}
exports.HtmlParser = HtmlParser;
