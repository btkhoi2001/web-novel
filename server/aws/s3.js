import aws from "aws-sdk";
import { Readable } from "stream";

export const uploadFile = (file) => {
    const { key, buffer } = file;
    const readable = new Readable();

    const s3 = new aws.S3({
        region: process.env.AWS_BUCKET_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    readable.push(buffer);
    readable.push(null);

    const uploadParams = {
        ACL: "public-read",
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: readable,
        Key: key,
        CacheControl: "no-cache",
    };

    return s3.upload(uploadParams).promise();
};

export const deleteFile = (key) => {
    const s3 = new aws.S3({
        region: process.env.AWS_BUCKET_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    };

    console.log(deleteParams);

    return s3.deleteObject(deleteParams).promise();
};
