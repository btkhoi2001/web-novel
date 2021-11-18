import aws from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";

export const uploadFile = (file) => {
    const bucketName = process.env.AWS_BUCKET_NAME + "/cover";
    const region = process.env.AWS_BUCKET_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY;
    const secretAccessKey = process.env.AWS_SECRET_KEY;
    const { originalname, buffer } = file;
    const readable = new Readable();

    readable.push(buffer);
    readable.push(null);

    const s3 = new aws.S3({
        region,
        accessKeyId,
        secretAccessKey,
    });

    const uploadParams = {
        ACL: "public-read",
        Bucket: bucketName,
        Body: readable,
        Key: uuidv4() + originalname.substr(originalname.lastIndexOf(".")),
    };

    return s3.upload(uploadParams).promise();
};
