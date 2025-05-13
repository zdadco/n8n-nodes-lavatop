import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeRequest } from '../../utils/LavaTopClient';
import {SUBSCRIPTION, SUBSCRIPTION_DELETE} from "../../utils/constants";

export async function executeDelete(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	// Get required parameters
	const contractId = this.getNodeParameter('contractId', i) as string;
	const email = this.getNodeParameter('email', i) as string;

	// Prepare query parameters
	const qs: Record<string, string> = {
		contractId,
		email,
	};

	// Make API request
	return await makeRequest.call(this, SUBSCRIPTION, SUBSCRIPTION_DELETE, {}, qs);
}
