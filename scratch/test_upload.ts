import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import dotenv from "dotenv"

dotenv.config()

async function test() {
  console.log("ACCOUNT_ID:", process.env.CLOUDFLARE_ACCOUNT_ID)
  console.log("ACCESS_KEY:", process.env.CLOUDFLARE_ACCESS_KEY_ID)
  console.log("BUCKET:", process.env.CLOUDFLARE_BUCKET_NAME)

  const S3 = new S3Client({
    region: "us-east-1",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || "",
    },
  })

  try {
    const res = await S3.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: "test-upload.txt",
      Body: Buffer.from("hello world"),
      ContentType: "text/plain",
    }))
    console.log("Success!", res)
  } catch (err: any) {
    console.error("Error:", err.message)
    console.error("Code:", err.Code)
    console.error("Status:", err.$metadata?.httpStatusCode)
  }
}

test()
