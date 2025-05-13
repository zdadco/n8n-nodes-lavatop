import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeRequest } from '../../utils/LavaTopClient';
import {INVOICE, INVOICE_GET_ALL} from "../../utils/constants";

// Interface for request parameters
interface IGetAllInvoicesRequest {
	returnAll?: boolean;
	size?: number;
	page?: number;
	filters?: {
		beginDate?: Date;
		endDate?: Date;
		buyerEmail?: string;
		currencies?: string[];
		last4CardDigits?: string;
		productName?: string;
		invoiceTypes?: string[];
		invoiceStatuses?: string[];
	};
}

export async function executeGetAll(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	// Get input parameters
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const requestParams: IGetAllInvoicesRequest = {
		returnAll,
		filters: this.getNodeParameter('filters', i, {}) as IGetAllInvoicesRequest['filters']
	};

	// Prepare query parameters
	const qs: Record<string, any> = {};

	if (!returnAll) {
		qs.size = this.getNodeParameter('size', i) as number;
		qs.page = this.getNodeParameter('page', i) as number;
	}

	if (requestParams.filters) {
		if (requestParams.filters.beginDate) {
			qs.beginDate = requestParams.filters.beginDate.toISOString();
		}
		if (requestParams.filters.endDate) {
			qs.endDate = requestParams.filters.endDate.toISOString();
		}
		if (requestParams.filters.buyerEmail) {
			qs.buyerEmail = requestParams.filters.buyerEmail;
		}
		if (requestParams.filters.currencies?.length) {
			qs.currencies = requestParams.filters.currencies.join(',');
		}
		if (requestParams.filters.last4CardDigits) {
			qs.last4CardDigits = requestParams.filters.last4CardDigits;
		}
		if (requestParams.filters.productName) {
			qs.productName = requestParams.filters.productName;
		}
		if (requestParams.filters.invoiceTypes?.length) {
			qs.invoiceTypes = requestParams.filters.invoiceTypes.join(',');
		}
		if (requestParams.filters.invoiceStatuses?.length) {
			qs.invoiceStatuses = requestParams.filters.invoiceStatuses.join(',');
		}
	}

	return await makeRequest.call(this, INVOICE, INVOICE_GET_ALL, {}, qs);
}
