import assert from 'assert';
import { z } from 'zod';
import { TO_RESPONSE } from '../../constants.js';
import { ExceptionCode } from '../enums/exceptions.enum.js';
import { InvalidBodyException } from './invalid-body.exception.js';
import { expect, test } from 'bun:test';

test('serializes to a NextResponse', () => {
	const schema = z.object({ a: z.string() });
	const parsed = schema.safeParse({ a: 1 });

	assert(!parsed.success);

	const exception = new InvalidBodyException(parsed.error);

	const response = exception[TO_RESPONSE]();

	expect(response.json()).resolves.toStrictEqual({
		statusCode: 422,
		code: ExceptionCode.InvalidBody,
		error: 'Unprocessable Content',
		message: 'Validation error: Expected string, received number at "a"',
	});
});
