import "server-only";

export type StorageBody = string | Uint8Array | ArrayBuffer;

export type StorageGetResult = {
  key: string;
  body: Uint8Array;
  contentType?: string;
  contentLength?: number;
  etag?: string;
  lastModified?: Date;
};

export type StorageUploadInput = {
  key: string;
  body: StorageBody;
  contentType?: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
};

export type StorageUploadResult = {
  key: string;
  etag?: string;
  url?: string;
};

export type StorageDeleteResult = {
  key: string;
  deleted: boolean;
};

export type StorageAdapter = {
  get(key: string): Promise<StorageGetResult | null>;
  upload(input: StorageUploadInput): Promise<StorageUploadResult>;
  delete(key: string): Promise<StorageDeleteResult>;
  getPublicUrl?(key: string): string | null;
};

function createNotConfiguredError() {
  return new Error(
    "Storage is not configured. Install an S3 client, uncomment the S3 adapter in src/server/core/storage.ts, and set the storage environment variables.",
  );
}

function createDisabledStorageAdapter(): StorageAdapter {
  return {
    async get() {
      throw createNotConfiguredError();
    },
    async upload() {
      throw createNotConfiguredError();
    },
    async delete() {
      throw createNotConfiguredError();
    },
    getPublicUrl() {
      return null;
    },
  };
}

export const storage: StorageAdapter = createDisabledStorageAdapter();

export async function getStorageObject(key: string) {
  return storage.get(key);
}

export async function uploadStorageObject(input: StorageUploadInput) {
  return storage.upload(input);
}

export async function deleteStorageObject(key: string) {
  return storage.delete(key);
}

export function getStoragePublicUrl(key: string) {
  return storage.getPublicUrl?.(key) ?? null;
}

/**
 * S3-compatible storage template.
 *
 * Works for:
 * - AWS S3
 * - MinIO
 * - Cloudflare R2
 * - Backblaze B2 S3
 * - DigitalOcean Spaces
 *
 * To enable it:
 * 1. Install `@aws-sdk/client-s3`
 * 2. Uncomment the imports and adapter setup below
 * 3. Set the environment variables referenced in `storageConfig`
 *
 * Notes for MinIO and other S3-compatible providers:
 * - Set `endpoint`, for example `http://127.0.0.1:9000`
 * - Set `forcePathStyle: true` when the provider does not support bucket subdomains
 * - Optionally set `publicUrl` if file URLs should resolve to a CDN or custom domain
 */

// import {
//   DeleteObjectCommand,
//   GetObjectCommand,
//   NoSuchKey,
//   PutObjectCommand,
//   S3Client,
// } from "@aws-sdk/client-s3";
//
// type S3StorageConfig = {
//   bucket: string;
//   region: string;
//   endpoint?: string;
//   publicUrl?: string;
//   forcePathStyle?: boolean;
//   credentials?: {
//     accessKeyId: string;
//     secretAccessKey: string;
//   };
// };
//
// const storageConfig: S3StorageConfig = {
//   bucket: process.env.STORAGE_BUCKET ?? "",
//   region: process.env.STORAGE_REGION ?? "us-east-1",
//   endpoint: process.env.STORAGE_ENDPOINT,
//   publicUrl: process.env.STORAGE_PUBLIC_URL,
//   forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE === "true",
//   credentials: process.env.STORAGE_ACCESS_KEY_ID && process.env.STORAGE_SECRET_ACCESS_KEY
//     ? {
//         accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
//         secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
//       }
//     : undefined,
// };
//
// const s3Client = new S3Client({
//   region: storageConfig.region,
//   endpoint: storageConfig.endpoint,
//   forcePathStyle: storageConfig.forcePathStyle,
//   credentials: storageConfig.credentials,
// });
//
// function normalizeBody(body: StorageBody): Uint8Array {
//   if (typeof body === "string") {
//     return new TextEncoder().encode(body);
//   }
//
//   if (body instanceof Uint8Array) {
//     return body;
//   }
//
//   return new Uint8Array(body);
// }
//
// function trimSlashes(value: string) {
//   return value.replace(/^\/+|\/+$/g, "");
// }
//
// function getPublicUrlFromConfig(config: S3StorageConfig, key: string) {
//   if (!config.publicUrl) {
//     return null;
//   }
//
//   const base = config.publicUrl.replace(/\/+$/, "");
//   const normalizedKey = trimSlashes(key);
//   return `${base}/${normalizedKey}`;
// }
//
// async function readBodyAsUint8Array(body: unknown): Promise<Uint8Array> {
//   if (!body) {
//     return new Uint8Array();
//   }
//
//   if (body instanceof Uint8Array) {
//     return body;
//   }
//
//   if (typeof Blob !== "undefined" && body instanceof Blob) {
//     return new Uint8Array(await body.arrayBuffer());
//   }
//
//   if (
//     typeof body === "object" &&
//     body !== null &&
//     "transformToByteArray" in body &&
//     typeof body.transformToByteArray === "function"
//   ) {
//     return Uint8Array.from(await body.transformToByteArray());
//   }
//
//   if (
//     typeof body === "object" &&
//     body !== null &&
//     "transformToWebStream" in body &&
//     typeof body.transformToWebStream === "function"
//   ) {
//     const stream = body.transformToWebStream();
//     const reader = stream.getReader();
//     const chunks: Uint8Array[] = [];
//     let totalLength = 0;
//
//     while (true) {
//       const result = await reader.read();
//       if (result.done) {
//         break;
//       }
//
//       const chunk = result.value instanceof Uint8Array ? result.value : new Uint8Array(result.value);
//       chunks.push(chunk);
//       totalLength += chunk.length;
//     }
//
//     const combined = new Uint8Array(totalLength);
//     let offset = 0;
//
//     for (const chunk of chunks) {
//       combined.set(chunk, offset);
//       offset += chunk.length;
//     }
//
//     return combined;
//   }
//
//   throw new Error("Unsupported S3 object body type.");
// }
//
// function createS3StorageAdapter(config: S3StorageConfig): StorageAdapter {
//   return {
//     async get(key) {
//       try {
//         const response = await s3Client.send(
//           new GetObjectCommand({
//             Bucket: config.bucket,
//             Key: key,
//           }),
//         );
//
//         return {
//           key,
//           body: await readBodyAsUint8Array(response.Body),
//           contentType: response.ContentType,
//           contentLength: response.ContentLength,
//           etag: response.ETag,
//           lastModified: response.LastModified,
//         };
//       } catch (error) {
//         if (error instanceof NoSuchKey) {
//           return null;
//         }
//
//         throw error;
//       }
//     },
//
//     async upload(input) {
//       const body = normalizeBody(input.body);
//
//       const response = await s3Client.send(
//         new PutObjectCommand({
//           Bucket: config.bucket,
//           Key: input.key,
//           Body: body,
//           ContentType: input.contentType,
//           CacheControl: input.cacheControl,
//           Metadata: input.metadata,
//         }),
//       );
//
//       return {
//         key: input.key,
//         etag: response.ETag,
//         url: getPublicUrlFromConfig(config, input.key) ?? undefined,
//       };
//     },
//
//     async delete(key) {
//       await s3Client.send(
//         new DeleteObjectCommand({
//           Bucket: config.bucket,
//           Key: key,
//         }),
//       );
//
//       return {
//         key,
//         deleted: true,
//       };
//     },
//
//     getPublicUrl(key) {
//       return getPublicUrlFromConfig(config, key);
//     },
//   };
// }
//
// export const storage: StorageAdapter = createS3StorageAdapter(storageConfig);
