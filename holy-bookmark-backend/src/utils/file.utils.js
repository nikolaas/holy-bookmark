import mime from 'mime';

export function contentTypeToExt(contentType) {
    return mime.extension(contentType);
}
