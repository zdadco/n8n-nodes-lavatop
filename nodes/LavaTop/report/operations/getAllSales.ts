import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeRequest } from '../../utils/LavaTopClient';
import {REPORT, REPORT_GET_ALL_SALES} from "../../utils/constants";


export async function executeGetAllSales(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	// Get input parameters
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;

	// Prepare query parameters
	const qs: Record<string, any> = {};

	if (!returnAll) {
		qs.size = this.getNodeParameter('size', i) as number;
		qs.page = this.getNodeParameter('page', i) as number;
	}

	return await makeRequest.call(this, REPORT, REPORT_GET_ALL_SALES, {}, qs);

}
