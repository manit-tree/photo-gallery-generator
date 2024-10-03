#!/usr/bin/node

import fs from 'node:fs';
import path from 'node:path';
import Twig from 'twig';
import sharp from 'sharp';


let arr = fs.readdirSync('./images/').filter(filename => {
    console.log(filename);

    let [_filename, _ext] = filename.split('.');

    if (['jpg','webp','png','jpeg','jfif'].includes(_ext)) {
        return true;
    }

    return false;
})

// generate thumbnail

if (!fs.existsSync('./thumbs')) {
    fs.mkdirSync('./thumbs');
} else {
    // remove files in ./thumbs

    fs.readdir('./thumbs', (err, files) => {
        if (err) throw err;

        for (const file of files) {
            try {
                fs.unlinkSync(path.join('./thumbs', file));
            } catch (err) {
                console.log(err);
            }
        }
    })
}

let items = new Array();
let promises = new Array();

arr.forEach(filename => {
    let [_filename, _ext] = filename.split('.');

    let p = (() => {
        return new Promise(async resolve => {
            let sharp_image = await sharp('./images/' + filename);
            let metadata = await sharp_image.metadata();

            await sharp_image.resize(400, 400, {
                    fit: sharp.fit.inside,
                    withoutEnlargement: true
                })
                .webp({effort: 6})
                .toFile('./thumbs/' + _filename + '.webp');

            console.log('generate thumb ' + _filename + '.webp [ok!]');

            resolve({
                image: filename,
                width: metadata.width,
                height: metadata.height,
                thumb: _filename + '.webp'    
            })
        })
    })()

    promises.push(p);
})

Promise.all(promises).then(res => {
    Twig.renderFile('./index.template.html', {items: res}, (err, html) => {
        fs.writeFile('./index.html', html, err => {
            if (err) {
                console.log(err);
            }
        })
    })

    console.log('done!');    
})
