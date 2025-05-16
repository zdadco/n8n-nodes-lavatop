import {Icon, ICredentialTestRequest, ICredentialType, INodeProperties} from 'n8n-workflow';

export class LavaTopApi implements ICredentialType {
	name = 'lavaTopApi';
	icon: Icon = {
		dark: 'file:../icons/LavaTop/icon_dark.svg',
		light: 'file:../icons/LavaTop/icon_light.svg'
	};

	displayName = 'LavaTop API';

	documentationUrl = 'https://gate.lava.top/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API key',
			name: 'apiKey',
			description: 'Lavatop X-Api-Key header value',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Base Url',
			name: 'baseUrl',
			type: 'hidden',
			default: 'https://gate.lava.top/api',
		}
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v2/products',
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}'
			}
		},
	};
}
