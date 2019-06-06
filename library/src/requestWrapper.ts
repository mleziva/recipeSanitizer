import * as request from 'request-promise-native';

export default async function getRequest(url: string) {
    const options = {
        uri: url,
        headers: { 'User-Agent': 'Mozilla/4.0' },
        gzip: true,
    };
    return await request.get(options);
}
