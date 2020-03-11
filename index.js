'use strict';

const sizeOf = require('image-size');

const size = async (s3, bucket, key) => {
  return new Promise(async (resolve, reject) => {
    const req = await s3.getObject({
      Bucket: bucket,
      Key: key
    });
    let buffer = new Buffer.from([]);
    let dimensions;
    let imageTypeDetectionError;
    let abortedRequest = false;

    req.on('error', err => {
      if (abortedRequest) {
        return;
      }
      reject(err);
    });

    req.createReadStream().on('data', chunk => {
      buffer = Buffer.concat([buffer, chunk]);
      try {
        dimensions = sizeOf(buffer);
      } catch (err) {
        imageTypeDetectionError = err;
        reject(imageTypeDetectionError);
      }
      abortedRequest = true;
      req.abort();
    }).on('error', err => {
      if (dimensions) {
        return;
      }
      imageTypeDetectionError = err;
      reject(imageTypeDetectionError);
    }).on('end', () => {
      if (!dimensions) {
        reject(imageTypeDetectionError);
      }
      resolve({ dimensions, buffer: buffer.length });
    });
  });
};

module.exports = size;
