# s3-image-size

I have updated the s3-image-size to upgrade the libraries and converted the code to Promise.

-----

[![NPM version](https://badge.fury.io/js/s3-image-size.svg)](http://badge.fury.io/js/s3-image-size)
[![Dependency Status](https://david-dm.org/chazmo03/s3-image-size.svg)](https://david-dm.org/chazmo03/s3-image-size)
[![devDependency Status](https://david-dm.org/chazmo03/s3-image-size/dev-status.svg)](https://david-dm.org/chazmo03/s3-image-size#info=devDependencies)

Detect image dimensions of images on Amazon S3.
It does so by trying to extract image size via [image-size](https://github.com/netroy/image-size)
on each chunk received. When the dimensions are present, the request is aborted.

Based on [http-image-size](https://www.npmjs.com/package/http-image-size).

## Usage
```js
const size = require('s3-image-size');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({region: 'some region'})
const result = size(s3, 'some bucket', 'some key');
console.log(result);
```

The callback receives three arguments: `err`, `dimensions`, `bytesRead`:

`dimensions` is in the form `{ height: 1063, width: 1600 }`

`bytesRead` is the number of bytes read from s3

## License
Copyright (c) 2015 Charles D. Augello
Licensed under the MIT license.
