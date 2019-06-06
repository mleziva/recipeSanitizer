import { Recipe } from '../recipe';
import { ConfigLoader } from '../fileManager/configLoader';
import { SiteObject } from './siteObject';
import * as requestWrapper from '../requestWrapper';
import * as fs from 'fs';
import * as path from 'path';
const recipeSites = require('./recipeSiteIndex').recipeSites; // delete require.cache[require.resolve('recipeSiteIndex.json')]

export abstract class IndexedRecipe {
static recipeSiteIndex: SiteObject[];
public static tryGetRecipe = async (url: string) => {
      // given a url, create a recipe object and return that recipe object
    // use the url to load the correct site object if it exists
    // use the site object to parse the html and return required recipe details
    const recipe = new Recipe(url);
    const siteObject = await IndexedRecipe.tryGetSiteObject(url);
    if (siteObject == null) {
        return null;
    }
    recipe.printUrl = siteObject.getPrintUrl();
    recipe.contentsHtml = await requestWrapper.default(recipe.printUrl);
    _parseHtml(fullSiteContents);
    const recipeName = _getRecipeName(siteObject.recipeNameIdentifier);
    const recipeContents = _getRecipeBody(siteObject.recipeNodeIdentifiers);
    recipe.useIframe = siteObject.useIframe;

    return recipe;
}
private static tryGetSiteObject = (url: string) => {
    const str = await ConfigLoader.GetConfig('./mypathtomyitem')
    const siteObjects: Array<SiteObject> = JSON.parse(str);
    const hostName = new URL(url).hostname;
    for (const siteObject of siteObjects) {
        if (siteObject.hostname === hostName) {
            siteObject.url = url;
            return siteObject;
         }
    }
    return null;
}

}
