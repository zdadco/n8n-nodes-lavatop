import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeRequest } from '../../utils/LavaTopClient';
import {REPORT, REPORT_GET_ALL_SALES_BY_PRODUCT} from "../../utils/constants";

interface IGetSalesByProductRequest {
	fromDate?: Date;
	toDate?: Date;
	currency?: Currency;
	status?: Status;
	search?: string;
}

export async function executeGetAllSalesByProduct(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	// Get required product ID
	const productId = this.getNodeParameter('productId', i) as string;

	// Get pagination parameters
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;

	const qs: Record<string, any> = {};

	if (!returnAll) {
		qs.size = this.getNodeParameter('size', i) as number;
		qs.page = this.getNodeParameter('page', i) as number;
	}

	const requestParams = this.getNodeParameter('filters', i, {}) as IGetSalesByProductRequest;

	// Prepare query parameters
	if (requestParams) {
		// Convert dates to UTC ISO format
		if (requestParams.fromDate) {
			qs.fromDate = requestParams.fromDate.toISOString();
		}
		if (requestParams.toDate) {
			qs.toDate = requestParams.toDate.toISOString();
		}
		if (requestParams.currency) {
			qs.currency = requestParams.currency;
		}
		if (requestParams.status) {
			qs.status = requestParams.status;
		}
		if (requestParams.search) {
			qs.search = requestParams.search;
		}
	}

	return await makeRequest.call(this, REPORT, REPORT_GET_ALL_SALES_BY_PRODUCT, {}, qs, productId);
}
