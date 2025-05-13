import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeRequest } from '../../utils/LavaTopClient';
import {PRODUCT, PRODUCT_UPDATE} from "../../utils/constants";

interface IPrice {
	amount: number;
	currency: Currency;
	periodicity: Periodicity;
}

interface IOffer {
	id: string;
	name?: string;
	description?: string;
	prices: IPrice[];
}

export async function executeUpdate(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const productId = this.getNodeParameter('productId', i) as string;
	const offers = this.getNodeParameter('offers', i, []) as IOffer[];

	const body = {
		offers: offers.map(offer => ({
			id: offer.id,
			...(offer.name && { name: offer.name }),
			...(offer.description && { description: offer.description }),
			...(offer.prices && {
				prices: offer.prices.map(price => ({
					amount: price.amount,
					currency: price.currency,
					periodicity: price.periodicity,
				})),
			}),
		})),
	};

	return await makeRequest.call(this, PRODUCT, PRODUCT_UPDATE, body, {}, productId);
}
