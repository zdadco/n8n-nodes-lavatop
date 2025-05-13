import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeRequest } from '../../utils/LavaTopClient';
import {INVOICE, INVOICE_GET} from "../../utils/constants";

export async function executeGet(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	// Get required invoice ID
	const invoiceId = this.getNodeParameter('id', i) as string;

	return await makeRequest.call(this, INVOICE, INVOICE_GET, {}, {}, invoiceId);
}
