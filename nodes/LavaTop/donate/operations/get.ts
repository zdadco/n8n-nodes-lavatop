import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeRequest } from '../../utils/LavaTopClient';
import {DONATE, DONATE_GET} from "../../utils/constants";


export async function executeGet(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	return await makeRequest.call(this, DONATE, DONATE_GET);
}
