import { expect } from 'chai';
import { HtmlParser } from '../src/htmlParser';
import * as fs from 'fs';
import * as path from 'path';

const someHtmlString = '<ul id="list"><li>Hello World</li></ul>';
const h2Element = '<h2 class="uppercase padding-bottom border-dotted--bottom border--gray light" data-min-font-size="24px">Ingredients</h2>';
describe('HtmlParser', () => {
    it('parses html on initialization', () => {
        const htmlParser = new HtmlParser(someHtmlString);
        const mainHtml = htmlParser.MainHtml.toString();
        expect(mainHtml).to.equal(someHtmlString);
    });
    it('getNodeByInnerHtml returns node', () => {
        fs.readFile( path.join(__dirname, './html/html1.html'), 'utf8', (error, data) => {
            const htmlParser = new HtmlParser(data);
            const h2Node = htmlParser.getNodeByInnerHtml(new RegExp('(^<h\\d(.*)?>Ingredients\\W?<\\/h\\d>$)', 'gmi'));
            expect(h2Node.outerHTML).to.equal(h2Element);
        });
    });
});
