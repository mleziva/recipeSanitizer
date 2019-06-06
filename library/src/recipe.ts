import {IndexedRecipe} from './recipeGetters/indexedRecipe';
import getContentsRecipe from './recipeGetters/contentsRecipe';
import getPrintPreviewRecipe from './recipeGetters/printPreviewRecipe';

export class Recipe {
  url: string;
  recipeContents: string;
  recipeName: string;
  printUrl: string;
  contentsHtml: string;
  useIframe = false;
  isSuccess = false;

  constructor(url: string) {
    this.url = url;
  }
  getRecipe = async () => {
    // maybe do something different here eventually
    // is myRecipe = this or is it a copy?
    let myRecipe =  await IndexedRecipe.tryGetRecipe(this);
    if (myRecipe.isSuccess) {
      return myRecipe;
    }
    myRecipe =  await getPrintPreviewRecipe(myRecipe);
    // does get for contents
    // then does get for print contents
    if (myRecipe.isSuccess) {
      return myRecipe;
    }
    myRecipe =  await getContentsRecipe(myRecipe);
    // does get for contents
    if (myRecipe.isSuccess) {
      return myRecipe;
    }
    return myRecipe;
  }
}
