import {ICredentialDataDecryptedObject, IExecuteFunctions, INodeExecutionData} from "n8n-workflow";

interface ICredentials extends ICredentialDataDecryptedObject {
	apiKey: string;
	baseUrl: string;
}

interface IRequestOptions {
	method: HttpMethod;
	uri: string;
	json: boolean;
	headers: {
		'X-Api-Key': string;
		'Content-Type': string;
	};
	body?: any;
	qs?: any;
}

export async function makeRequest(
	this: IExecuteFunctions,
	resource: Resource,
	operation: string,
	body: Record<string, any> = {},
	qs: Record<string, any> = {},
	id?: string
): Promise<INodeExecutionData[]> {
	let credentials = await this.getCredentials('lavaTopApi') as ICredentials;

	const options: IRequestOptions = {
		method: getMethod(resource, operation),
		uri: credentials.baseUrl + getEndpoint(resource, operation, id),
		json: true,
		headers: {
			'X-Api-Key': credentials.apiKey,
			'Content-Type': 'application/json',
		},
	};

	if (Object.keys(body).length) {
		options.body = body;
	}

	if (Object.keys(qs).length) {
		options.qs = qs;
	}

	this.logger.info(`Request: ${options.method} | ${options.uri}`)
	this.logger.info(`Query: ${JSON.stringify(options.qs)}`)
	this.logger.info(`Body: ${JSON.stringify(options.body)}`)

	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new Error(`Lava.top API Error: ${(error as Error).message}`);
	}
}

function getMethod(resource: Resource, operation: string): HttpMethod {
		const routeMap: Record<Resource, Record<string, HttpMethod>> = {
			invoice: {
				create: 'POST',
				get: 'GET',
				getAll: 'GET',
			},
			product: {
				getProducts: 'GET',
				updateProduct: 'PATCH',
			},
			report: {
				getAllSales: 'GET',
				getByProduct: 'GET',
			},
			subscription: {
				delete: 'DELETE',
			},
			donate: {
				get: 'GET',
			},
		};

		return routeMap[resource]?.[operation] ?? 'GET';
	}

function getEndpoint(resource: Resource, operation: string, id?: string): string {
		type EndpointFunction = (id?: string) => string;
		type EndpointMap = Record<string, string | EndpointFunction>;

		const endpoints: Record<Resource, EndpointMap> = {
			invoice: {
				create: `/v2/invoice`,
				get: (id) => `/v1/invoices/${id}`,
				getAll: `/v1/invoices`,
			},
			product: {
				getAll: `/v2/products`,
				update: (id) => `/v2/products/${id}`,
			},
			report: {
				getAllSales: `/v1/sales`,
				getAllSalesByProduct: (id) => `/v1/sales/${id}`,
			},
			subscription: {
				delete: `/v1/subscriptions`,
			},
			donate: {
				get: `/v1/donate`,
			},
		};

		const endpoint = endpoints[resource]?.[operation];
		return typeof endpoint === 'function' ? endpoint(id) : endpoint;
	}
