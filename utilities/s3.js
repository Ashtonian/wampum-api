var aws = require('aws-sdk');

var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

function getSignedPutUrl(fileName, fileExtension) {
  // TODO: extract s3 code and use promises
  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_ACCESS_KEY
  });
  var s3 = new aws.S3();
  var s3_params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 10,
    ContentType: GetMimeTypeFromExtension(fileExtension),
    ACL: 'public-read'
  };
  return s3.getSignedUrl('putObject', s3_params);
}

function getS3Path(fileName) {
  return 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + fileName;
}

function GetMimeTypeFromExtension(fileExtension) {
  if (fileExtension === '.png')
    return "image/png";
  if (fileExtension === '.jpeg' || fileExtension === '.jpg')
    return "image/jpeg";
}

module.exports = {
  getS3Path: getS3Path,
  getSignedPutUrl: getSignedPutUrl
};
