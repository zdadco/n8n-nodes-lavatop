import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeRequest } from '../../utils/LavaTopClient';
import {PRODUCT, PRODUCT_GET_ALL} from "../../utils/constants";

interface IProductGetProductsRequest {
	beforeCreatedAt?: string;
	contentCategories?: 'POST' | 'PRODUCT';
	productTypes?: Array<
		| 'COURSE'
		| 'DIGITAL_PRODUCT'
		| 'BOOK'
		| 'GUIDE'
		| 'SUBSCRIPTION'
		| 'AUDIO'
		| 'MODS'
		| 'CONSULTATION'
	>;
	feedVisibility?: 'ALL' | 'ONLY_VISIBLE' | 'ONLY_HIDDEN';
	showAllSubscriptionPeriods?: boolean;
}

export async function executeGetAll(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const requestParams = this.getNodeParameter('options', i, {}) as IProductGetProductsRequest;

	// Convert parameters to query string format expected by API
	const qs: Record<string, any> = {};
	if (requestParams) {
		if (requestParams.beforeCreatedAt) {
			qs.beforeCreatedAt = requestParams.beforeCreatedAt;
		}
		if (requestParams.contentCategories) {
			qs.contentCategories = requestParams.contentCategories;
		}
		if (requestParams.productTypes) {
			qs.productTypes = requestParams.productTypes.join(',');
		}
		if (requestParams.feedVisibility) {
			qs.feedVisibility = requestParams.feedVisibility;
		}
		if (requestParams.showAllSubscriptionPeriods !== undefined) {
			qs.showAllSubscriptionPeriods = requestParams.showAllSubscriptionPeriods;
		}
	}

	return await makeRequest.call(this, PRODUCT, PRODUCT_GET_ALL, {}, qs);

}
