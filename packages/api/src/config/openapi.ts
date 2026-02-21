import openapi from '@elysiajs/openapi';
import { OpenAPI } from '@/lib/http/plugins';

export const openapiConfig = openapi({
	documentation: {
		components: await OpenAPI.components,
		paths: await OpenAPI.getPaths(),
	},
});
