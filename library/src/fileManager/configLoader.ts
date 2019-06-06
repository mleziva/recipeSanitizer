import * as FS from 'fs';
import * as Path from 'path';
/*
example:
var str = ConfigLoader.GetConfig('./mypathtomyitem')
recipeSiteIndex = JSON.parse(str);
*/
export abstract class ConfigLoader {
    static recipeSiteIndex: SiteObject[];
    private static items: FileItem[] = [];
    public static GetConfig = async (path: string)  => {
        const item = ConfigLoader.tryGetItem(path);
        if ( item !== null) {
            return item;
        }
        return ConfigLoader.loadAndAddToItems(path);
    }
    private static tryGetItem = (path: string) => {
        for (const item of ConfigLoader.items) {
            if (item.path === path) { return item.fileValue; }
        }
        return null;
    }
    private static loadAndAddToItems = async (path: string) => {
        const fileValue = await ConfigLoader.loadFile(path);
        ConfigLoader.items.push({path, fileValue});
        return fileValue;
    }
    private static loadFile(filePath): Promise<string> {
        return new Promise(((resolve) => {
            const route = Path.resolve(process.cwd(), filePath);
            FS.readFile(route, 'utf8', (err, data) => resolve(data));
        }));
    }
}
class FileItem {
    path: string;
    fileValue: string;
}
