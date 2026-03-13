import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import { r2 } from './client';

export const deleteFile = async (key: string) => {
	await r2
		.send(
			new DeleteObjectCommand({
				Bucket: process.env.R2_BUCKET_NAME,
				Key: key,
			}),
		)
		.catch(() => null);
};
