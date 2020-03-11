'use strict';

const assert = require('assert');
const size = require('../index');
const AWS = require('aws-sdk');

// Fill in values for test files in your own buckets for testing
const region = 'FILL_ME_IN';
const validBucket = 'FILL_ME_IN';
const validKey = 'FILL_ME_IN';
const nonImageBucket = 'NON_IMAGE_BUCKET';
const nonImageKey = 'NON_IMAGE_KEY';

const s3 = new AWS.S3({ region: region });

const isSizeDetected = (dimensions, length) => {
  assert.strictEqual(typeof dimensions, 'object');
  assert.strictEqual(typeof dimensions.width, 'number');
  assert(dimensions.width > 0);
  assert.strictEqual(typeof dimensions.height, 'number');
  assert(dimensions.height > 0);
  assert.strictEqual(typeof length, 'number');
};

describe('http-image-size', function() {
  this.timeout(0); // disable timeouts completely

  it('should detect the size of an image on s3', async done => {
    const result = await size(s3, validBucket, validKey);
    isSizeDetected(result.dimensions, result.buffer);
    done();
  });

  it('should pass an error when the bucket is missing', async done => {
    try {
      await size(s3, null, validKey);
    } catch (e) {
      assert.equal(e.code, 'MissingRequiredParameter');
    }
    done();
  });

  it('should pass an error when the key is missing', async done => {
    try {
      await size(s3, validBucket, null);
    } catch (e) {
      assert.equal(e.code, 'MissingRequiredParameter');
    }
    done();
  });

  it('should pass an error when the image is not found', async done => {
    try {
      await size(s3, validBucket, 'noImageHere');
    } catch (e) {
      assert.equal(e.code, 'NoSuchKey');
    }
    done();
  });

  it('should pass an error when the object is not an image', async done => {
    try {
      const a = await size(s3, nonImageBucket, nonImageKey);
    } catch (e) {
      assert.equal(e.code, 'NoSuchBucket');
    }
    done();
  });
});
