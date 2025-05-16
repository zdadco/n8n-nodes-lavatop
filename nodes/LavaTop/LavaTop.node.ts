import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { router } from './utils/ResourceRouter';
import {
	DONATE, DONATE_GET,
	INVOICE, INVOICE_CREATE, INVOICE_GET, INVOICE_GET_ALL,
	PRODUCT, PRODUCT_GET_ALL, PRODUCT_UPDATE,
	REPORT, REPORT_GET_ALL_SALES, REPORT_GET_ALL_SALES_BY_PRODUCT,
	SUBSCRIPTION, SUBSCRIPTION_DELETE
} from "./utils/constants";

export class LavaTop implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LavaTop',
		name: 'lavatop',
		icon: {
			dark: 'file:../../icons/LavaTop/icon_dark.svg',
			light: 'file:../../icons/LavaTop/icon_light.svg',
		},
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ":" + $parameter["operation"]}}',
		description: 'Sends data to LavaTop',
		defaults: {
			name: 'LavaTop',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'lavaTopApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Product',
						value: PRODUCT,
					},
					{
						name: 'Invoice',
						value: INVOICE,
					},
					{
						name: 'Report',
						value: REPORT,
					},
					{
						name: 'Subscription',
						value: SUBSCRIPTION,
					},
					{
						name: 'Donate',
						value: DONATE,
					},
				],
				default: PRODUCT,
			},

			// ----------------------------------
			//         operations
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [PRODUCT],
					},
				},
				options: [
					{
						name: 'Get Products',
						value: PRODUCT_GET_ALL,
						description: 'Get all products',
						action: 'Get products',
					},
					{
						name: 'Update Product',
						value: PRODUCT_UPDATE,
						description: 'Update product by ID',
						action: 'Update product',
					},
				],
				default: PRODUCT_GET_ALL,
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [INVOICE],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: INVOICE_GET_ALL,
						description: 'Get all invoices',
						action: 'Get invoices',
					},
					{
						name: 'Get',
						value: INVOICE_GET,
						description: 'Get invoice by ID',
						action: 'Get invoice',
					},
					{
						name: 'Create',
						value: INVOICE_CREATE,
						description: 'Create invoice',
						action: 'Create invoice',
					},
				],
				default: INVOICE_GET_ALL,
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [REPORT],
					},
				},
				options: [
					{
						name: 'Get All Sales',
						value: REPORT_GET_ALL_SALES,
						action: 'Get sales',
					},
					{
						name: 'Get Sales by Product',
						value: REPORT_GET_ALL_SALES_BY_PRODUCT,
						description: 'Get sales by product ID',
						action: 'Get sales by product',
					},
				],
				default: REPORT_GET_ALL_SALES,
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [SUBSCRIPTION],
					},
				},
				options: [
					{
						name: 'Delete',
						value: SUBSCRIPTION_DELETE,
						description: 'Delete a subscription',
						action: 'Delete a subscription',
					},
				],
				default: SUBSCRIPTION_DELETE,
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [DONATE],
					},
				},
				options: [
					{
						name: 'Get',
						value: DONATE_GET,
						description: 'Get link for donation',
						action: 'Get a donation link',
					},
				],
				default: DONATE_GET,
			},

			// ----------------------------------
			//         fields
			// ----------------------------------

			// ----------------------------------
			//         shared
			// ----------------------------------
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: [INVOICE, REPORT],
						operation: [INVOICE_GET_ALL, REPORT_GET_ALL_SALES, REPORT_GET_ALL_SALES_BY_PRODUCT],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'size',
				type: 'number',
				displayOptions: {
					show: {
						resource: [INVOICE, REPORT],
						operation: [INVOICE_GET_ALL, REPORT_GET_ALL_SALES, REPORT_GET_ALL_SALES_BY_PRODUCT],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				description: 'Max number of results in page to return',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				displayOptions: {
					show: {
						resource: [INVOICE, REPORT],
						operation: [INVOICE_GET_ALL, REPORT_GET_ALL_SALES, REPORT_GET_ALL_SALES_BY_PRODUCT],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Page of results to return',
			},

			// ----------------------------------
			//         product:getAll
			// ----------------------------------
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add option',
				default: {},
				options: [
					{
						displayName: 'Before Created At',
						name: 'beforeCreatedAt',
						type: 'dateTime',
						description: 'Filter products/posts created before this date',
						default: '',
					},
					{
						displayName: 'Content Categories',
						name: 'contentCategories',
						type: 'options',
						options: [
							{
								name: 'Post',
								value: 'POST',
							},
							{
								name: 'Product',
								value: 'PRODUCT',
							},
						],
						description: 'Filter by content type',
						default: 'PRODUCT',
					},
					{
						displayName: 'Product Types',
						name: 'productTypes',
						type: 'multiOptions',
						description: 'Filter by product type',
						options: [
							{ name: 'Course', value: 'COURSE' },
							{ name: 'Digital Product', value: 'DIGITAL_PRODUCT' },
							{ name: 'Book', value: 'BOOK' },
							{ name: 'Guide', value: 'GUIDE' },
							{ name: 'Subscription', value: 'SUBSCRIPTION' },
							{ name: 'Audio', value: 'AUDIO' },
							{ name: 'Mods', value: 'MODS' },
							{ name: 'Consultation', value: 'CONSULTATION' },
						],
						default: [],
					},
					{
						displayName: 'Feed Visibility',
						name: 'feedVisibility',
						type: 'options',
						description: 'Filter by content visibility',
						options: [
							{ name: 'All', value: 'ALL' },
							{ name: 'Only Visible', value: 'ONLY_VISIBLE' },
							{ name: 'Only Hidden', value: 'ONLY_HIDDEN' },
						],
						default: 'ONLY_VISIBLE',
					},
					{
						displayName: 'Show All Subscription Periods',
						name: 'showAllSubscriptionPeriods',
						type: 'boolean',
						description:
							'Show offers with subscription periods longer than a month (for subscriptions)',
						default: false,
					},
				],
				displayOptions: {
					show: {
						resource: [PRODUCT],
						operation: [PRODUCT_GET_ALL],
					},
				},
			},

			// ----------------------------------
			//         product:update
			// ----------------------------------
			{
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				required: true,
				default: '',
				description: 'UUID of the product to update',
				displayOptions: {
					show: {
						resource: [PRODUCT],
						operation: [PRODUCT_UPDATE],
					},
				},
			},
			{
				displayName: 'Offers',
				name: 'offers',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Offer',
				default: [],
				displayOptions: {
					show: {
						resource: [PRODUCT],
						operation: [PRODUCT_UPDATE],
					},
				},
				options: [
					{
						displayName: 'Offer',
						name: 'offer',
						values: [
							{
								displayName: 'Offer ID',
								name: 'id',
								type: 'string',
								required: true,
								default: '',
								description: 'UUID of the offer to update',
							},
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'New name for the offer',
							},
							{
								displayName: 'Description',
								name: 'description',
								type: 'string',
								default: '',
								description: 'New description for the offer',
							},
							{
								displayName: 'Prices',
								name: 'prices',
								type: 'fixedCollection',
								typeOptions: {
									multipleValues: true,
								},
								placeholder: 'Add Price',
								default: [],
								description: 'Price configuration for the offer',
								options: [
									{
										displayName: 'Price',
										name: 'price',
										values: [
											{
												displayName: 'Amount',
												name: 'amount',
												type: 'number',
												required: true,
												default: 0,
												description: 'Price amount',
											},
											{
												displayName: 'Currency',
												name: 'currency',
												type: 'options',
												required: true,
												options: [
													{ name: 'RUB', value: 'RUB' },
													{ name: 'USD', value: 'USD' },
													{ name: 'EUR', value: 'EUR' },
												],
												default: 'RUB',
												description: 'Currency for the price',
											},
											{
												displayName: 'Periodicity',
												name: 'periodicity',
												type: 'options',
												options: [
													{ name: 'One Time', value: 'ONE_TIME' },
													{ name: 'Monthly', value: 'MONTHLY' },
													{ name: 'Every 90 Days', value: 'PERIOD_90_DAYS' },
													{ name: 'Every 180 Days', value: 'PERIOD_180_DAYS' },
													{ name: 'Yearly', value: 'PERIOD_YEAR' },
												],
												default: 'ONE_TIME',
												description: 'Billing periodicity',
											},
										],
									},
								],
							},
						],
					},
				],
			},

			// ----------------------------------
			//         invoice:getAll
			// ----------------------------------
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: [INVOICE],
						operation: [INVOICE_GET_ALL],
					},
				},
				options: [
					{
						displayName: 'Begin Date',
						name: 'beginDate',
						type: 'dateTime',
						default: '',
						description: 'Start date for filtering contracts (UTC+0)',
					},
					{
						displayName: 'End Date',
						name: 'endDate',
						type: 'dateTime',
						default: '',
						description: 'End date for filtering contracts (UTC+0)',
					},
					{
						displayName: 'Buyer Email',
						name: 'buyerEmail',
						type: 'string',
						default: '',
						description: 'Filter by buyer email (supports pattern matching)',
					},
					{
						displayName: 'Currencies',
						name: 'currencies',
						type: 'multiOptions',
						options: [
							{ name: 'RUB', value: 'RUB' },
							{ name: 'USD', value: 'USD' },
							{ name: 'EUR', value: 'EUR' },
						],
						default: [],
						description: 'Filter by transaction currency',
					},
					{
						displayName: 'Last 4 Card Digits',
						name: 'last4CardDigits',
						type: 'string',
						default: '',
						description: 'Filter by last 4 digits of payment card',
					},
					{
						displayName: 'Product Name',
						name: 'productName',
						type: 'string',
						default: '',
						description: 'Filter by product name (supports pattern matching)',
					},
					{
						displayName: 'Invoice Types',
						name: 'invoiceTypes',
						type: 'multiOptions',
						options: [
							{ name: 'One Time', value: 'ONE_TIME' },
							{ name: 'Recurring', value: 'RECURRING' },
						],
						default: [],
						description: 'Filter by invoice type',
					},
					{
						displayName: 'Invoice Statuses',
						name: 'invoiceStatuses',
						type: 'multiOptions',
						options: [
							{ name: 'New', value: 'NEW' },
							{ name: 'In Progress', value: 'IN_PROGRESS' },
							{ name: 'Completed', value: 'COMPLETED' },
							{ name: 'Failed', value: 'FAILED' },
						],
						default: ['COMPLETED'],
						description: 'Filter by invoice status',
					},
				],
			},

			// ----------------------------------
			//         invoice:get
			// ----------------------------------
			{
				displayName: 'Invoice ID',
				name: 'id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: [INVOICE],
						operation: [INVOICE_GET],
					},
				},
				default: '',
				description: 'The UUID of the invoice to retrieve',
				placeholder: '7ea82675-4ded-4133-95a7-a6efbaf165cc',
			},


			// ----------------------------------
			//         invoice:create
			// ----------------------------------
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				required: true,
				displayOptions: {
					show: {
						resource: [INVOICE],
						operation: [INVOICE_CREATE],
					},
				},
				default: '',
				description: 'Payer email',
			},
			{
				displayName: 'Offer ID',
				name: 'offerId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: [INVOICE],
						operation: [INVOICE_CREATE],
					},
				},
				default: '',
				description: 'Идентификатор оффера',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: [INVOICE],
						operation: [INVOICE_CREATE],
					},
				},
				default: 'RUB',
				options: [
					{ name: 'RUB', value: 'RUB' },
					{ name: 'USD', value: 'USD' },
					{ name: 'EUR', value: 'EUR' },
				],
				description: 'Валюта покупки',
			},
			{
				displayName: 'Payment Method',
				name: 'paymentMethod',
				type: 'options',
				options: [
					{ name: 'BANK131', value: 'BANK131' },
					{ name: 'UNLIMINT', value: 'UNLIMINT' },
					{ name: 'PAYPAL', value: 'PAYPAL' },
					{ name: 'STRIPE', value: 'STRIPE' },
				],
				displayOptions: {
					show: {
						resource: [INVOICE],
						operation: [INVOICE_CREATE],
					},
				},
				default: 'BANK131',
				hint: 'Depends on selected currency: BANK131 for RUB, others for USD/EUR',
				typeOptions: {
					loadOptionsDependsOn: ['currency'],
					loadOptionsMethod: 'getPaymentMethods',
				},
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add option',
				default: {},
				options: [
					{
						displayName: 'Periodicity',
						name: 'periodicity',
						type: 'options',
						default: 'ONE_TIME',
						options: [
							{ name: 'One Time', value: 'ONE_TIME' },
							{ name: 'Monthly', value: 'MONTHLY' },
							{ name: 'Every 90 Days', value: 'PERIOD_90_DAYS' },
							{ name: 'Every 180 Days', value: 'PERIOD_180_DAYS' },
							{ name: 'Yearly', value: 'PERIOD_YEAR' },
						],
						description: 'Periodicity (only for subscription)',
					},
					{
						displayName: 'Buyer Language',
						name: 'buyerLanguage',
						type: 'options',
						default: 'RU',
						options: [
							{ name: 'English', value: 'EN' },
							{ name: 'Russian', value: 'RU' },
							{ name: 'Spanish', value: 'ES' },
						],
					},
					{
						displayName: 'UTMs',
						name: 'clientUtm',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: false,
						},
						default: {},
						options: [
							{
								name: 'utm',
								displayName: 'UTM',
								values: [
									{
										displayName: 'Utm Source',
										name: 'utm_source',
										type: 'string',
										default: '',
									},
									{
										displayName: 'Utm Medium',
										name: 'utm_medium',
										type: 'string',
										default: '',
									},
									{
										displayName: 'Utm Campaign',
										name: 'utm_campaign',
										type: 'string',
										default: '',
									},
									{
										displayName: 'Utm Term',
										name: 'utm_term',
										type: 'string',
										default: '',
									},
									{
										displayName: 'Utm Content',
										name: 'utm_content',
										type: 'string',
										default: '',
									},
								],
							},
						],
						description: 'Client UTM-tags',
					},
				],
				displayOptions: {
					show: {
						resource: [INVOICE],
						operation: [INVOICE_CREATE],
					},
				},
			},

			// ----------------------------------
			//         report:getAllSales
			// ----------------------------------

			// ----------------------------------
			//         report:getAllSalesByProduct
			// ----------------------------------
			{
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: [REPORT],
						operation: [REPORT_GET_ALL_SALES_BY_PRODUCT],
					},
				},
				default: '',
				description: 'The UUID of the product to get sales for',
				placeholder: 'd31384b8-e412-4be5-a2ec-297ae6666c8f',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: [REPORT],
						operation: [REPORT_GET_ALL_SALES_BY_PRODUCT],
					},
				},
				options: [
					{
						displayName: 'From Date',
						name: 'fromDate',
						type: 'dateTime',
						default: '',
						description: 'Start date for the sales period',
					},
					{
						displayName: 'To Date',
						name: 'toDate',
						type: 'dateTime',
						default: '',
						description: 'End date for the sales period',
					},
					{
						displayName: 'Currency',
						name: 'currency',
						type: 'options',
						options: [
							{ name: 'RUB', value: 'RUB' },
							{ name: 'USD', value: 'USD' },
							{ name: 'EUR', value: 'EUR' },
						],
						default: 'RUB',
						description: 'Filter by transaction currency',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{ name: 'New', value: 'NEW' },
							{ name: 'In Progress', value: 'IN_PROGRESS' },
							{ name: 'Completed', value: 'COMPLETED' },
							{ name: 'Failed', value: 'FAILED' },
							{ name: 'Cancelled', value: 'CANCELLED' },
							{ name: 'Subscription Active', value: 'SUBSCRIPTION_ACTIVE' },
							{ name: 'Subscription Expired', value: 'SUBSCRIPTION_EXPIRED' },
							{ name: 'Subscription Cancelled', value: 'SUBSCRIPTION_CANCELLED' },
							{ name: 'Subscription Failed', value: 'SUBSCRIPTION_FAILED' },
						],
						default: 'COMPLETED',
						description: 'Filter by contract status',
					},
					{
						displayName: 'Search Term',
						name: 'search',
						type: 'string',
						default: '',
						description: 'Search term to filter within product sales',
					},
				],
			},

			// ----------------------------------
			//         subscription:delete
			// ----------------------------------
			{
				displayName: 'Contract ID',
				name: 'contractId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: [SUBSCRIPTION],
						operation: [SUBSCRIPTION_DELETE],
					},
				},
				default: '',
				description: 'The parent contract ID (UUID) from the initial subscription purchase',
				placeholder: 'c5a0cacc-3453-44b0-9532-aa492f1ba191',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: [SUBSCRIPTION],
						operation: [SUBSCRIPTION_DELETE],
					},
				},
				default: '',
				description: 'Email address of the subscription owner',
				placeholder: 'user@example.com',
			},

			// ----------------------------------
			//         donate:get
			// ----------------------------------
		],
	};

	methods = {
		loadOptions: {
			async getPaymentMethods(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const currency = this.getNodeParameter('currency') as string;

				const rubMethods = [{ name: 'BANK131', value: 'BANK131' }];

				const foreignMethods = [
					{ name: 'UNLIMINT', value: 'UNLIMINT' },
					{ name: 'PAYPAL', value: 'PAYPAL' },
					{ name: 'STRIPE', value: 'STRIPE' },
				];

				return currency === 'RUB' ? rubMethods : foreignMethods;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await router.call(this);
	}
}
