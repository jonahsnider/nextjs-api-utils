import { expect, test } from 'bun:test';
import assert from 'node:assert';
import { z } from 'zod';
import { TO_RESPONSE } from '../../constants.js';
import { ExceptionCode } from '../enums/exceptions.enum.js';
import { InvalidQueryParametersException } from './invalid-query-parameters.exception.js';

test('serializes to a NextResponse', () => {
	const schema = z.object({ a: z.string() });
	const parsed = schema.safeParse({ a: 1 });

	assert(!parsed.success);

	const exception = new InvalidQueryParametersException(parsed.error);

	const response = exception[TO_RESPONSE]();

	expect(response.json()).resolves.toStrictEqual({
		statusCode: 422,
		code: ExceptionCode.InvalidQueryParameters,
		error: 'Unprocessable Content',
		message: 'Validation error: Expected string, received number at "a"',
	});
});
