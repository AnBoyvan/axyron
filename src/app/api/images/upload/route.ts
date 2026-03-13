import { type NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth/auth';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/r2/constants';
import { uploadFile } from '@/lib/r2/upload-file';

export const POST = async (req: NextRequest) => {
	const session = await auth.api.getSession({
		headers: req.headers,
	});
	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const formData = await req.formData();
	const file = formData.get('file') as File | null;
	const key = formData.get('key') as string | null;

	if (!file || !key) {
		return NextResponse.json({ error: 'Missing file or key' }, { status: 400 });
	}

	if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
		return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
	}

	if (file.size > MAX_IMAGE_SIZE) {
		return NextResponse.json({ error: 'File too large' }, { status: 400 });
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	const url = await uploadFile(key, buffer, file.type);

	return NextResponse.json({ url });
};
