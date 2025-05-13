import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeRequest } from '../../utils/LavaTopClient';
import {INVOICE, INVOICE_CREATE} from "../../utils/constants";

interface ICreateInvoiceRequest {
	email: string;
	offerId: string;
	currency: Currency;
	paymentMethod?: PaymentMethod;
	periodicity?: Periodicity;
	buyerLanguage?: Language;
	clientUtm?: {
		utm_source?: string;
		utm_medium?: string;
		utm_campaign?: string;
		utm_term?: string;
		utm_content?: string;
	};
}

export async function executeCreate(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	// Get required fields
	const email = this.getNodeParameter('email', i) as string;
	const offerId = this.getNodeParameter('offerId', i) as string;
	const currency = this.getNodeParameter('currency', i) as Currency;
	const paymentMethod = this.getNodeParameter('paymentMethod', i) as PaymentMethod | undefined;

	// Get optional fields
	const additionalFields = this.getNodeParameter('options', i, {}) as {
		periodicity?: Periodicity;
		buyerLanguage?: Language;
		clientUtm?: {
			utm?: {
				utm_source?: string;
				utm_medium?: string;
				utm_campaign?: string;
				utm_term?: string;
				utm_content?: string;
			};
		};
	};

	// Prepare request body
	const body: ICreateInvoiceRequest = {
		email,
		offerId,
		currency,
		...(paymentMethod && { paymentMethod }),
		...(additionalFields.periodicity && { periodicity: additionalFields.periodicity }),
		...(additionalFields.buyerLanguage && { buyerLanguage: additionalFields.buyerLanguage }),
	};

	// Add UTM parameters if present
	if (additionalFields.clientUtm?.utm) {
		body.clientUtm = {
			...(additionalFields.clientUtm.utm.utm_source && { utm_source: additionalFields.clientUtm.utm.utm_source }),
			...(additionalFields.clientUtm.utm.utm_medium && { utm_medium: additionalFields.clientUtm.utm.utm_medium }),
			...(additionalFields.clientUtm.utm.utm_campaign && { utm_campaign: additionalFields.clientUtm.utm.utm_campaign }),
			...(additionalFields.clientUtm.utm.utm_term && { utm_term: additionalFields.clientUtm.utm.utm_term }),
			...(additionalFields.clientUtm.utm.utm_content && { utm_content: additionalFields.clientUtm.utm.utm_content }),
		};
	}

	// Make API request
	return await makeRequest.call(this, INVOICE, INVOICE_CREATE, body);
}
