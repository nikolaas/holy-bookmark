import { toPairs } from 'ramda';
import formidable from 'formidable';

export function parseForm(req, formParams) {
    const form = new formidable.IncomingForm();
    if (formParams) {
        toPairs(formParams)
            .forEach(([param, value]) => {
               form[param] = value;
            });
    }
    return new Promise((resolve, reject) => {
        form.parse(req, function(err, fields, files) {
            if (err) {
                reject(err);
            } else {
                resolve([fields, files]);
            }
        });
    });
}