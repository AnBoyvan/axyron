import { PutObjectCommand } from '@aws-sdk/client-s3';

import { r2 } from './client';

export const uploadFile = async (
	key: string,
	file: Buffer,
	contentType: string,
) => {
	await r2.send(
		new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME,
			Key: key,
			Body: file,
			ContentType: contentType,
		}),
	);

	return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
};
