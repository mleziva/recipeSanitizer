import { expect } from 'chai';
import { HtmlParser } from '../src/htmlParser';
import * as Parser from 'node-html-parser';

const someHtmlString = '<ul id="list"><li>Hello World</li></ul>';
describe('HtmlParser', () => {
    it('parses html on initialization', () => {
        const htmlParser = new HtmlParser(someHtmlString);
        const mainHtml = htmlParser.MainHtml.toString();
        expect(mainHtml).to.equal(someHtmlString);
    });
});