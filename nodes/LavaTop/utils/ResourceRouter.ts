import {
	NodeOperationError,
	type IExecuteFunctions,
	type INodeExecutionData, IDataObject,
} from 'n8n-workflow';
import {ProductOperations} from "../product";
import {InvoiceOperations} from "../invoice";
import {ReportOperations} from "../report";
import {SubscriptionOperations} from "../subscription";
import {DonateOperations} from "../donate";
import {DONATE, INVOICE, PRODUCT, REPORT, SUBSCRIPTION} from "./constants";

export async function router(this: IExecuteFunctions) {
	this.logger.info("Execute router")
	const returnData: INodeExecutionData[] = [];

	const items = this.getInputData();

	const resource = this.getNodeParameter('resource', 0) as Resource;
	const operation = this.getNodeParameter('operation', 0) as string;

	let execute;
	this.logger.info(`Find ${resource} operations`)
	switch (resource) {
		case PRODUCT:
			execute = ProductOperations[operation as ProductOperation];
			break;
		case INVOICE:
			execute = InvoiceOperations[operation as InvoiceOperation];
			break;
		case REPORT:
			execute = ReportOperations[operation as ReportOperation];
			break;
		case SUBSCRIPTION:
			execute = SubscriptionOperations[operation as SubscriptionOperation];
			break;
		case DONATE:
			execute = DonateOperations[operation as DonateOperation];
			break;
		default:
			throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported!`);
	}

	for (let i = 0; i < items.length; i++) {
		try {
			this.logger.info(`Execute ${resource}:${operation}`)
			const responseData = await execute.call(this, i);
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData as IDataObject[]),
				{ itemData: { item: i } },
			);
			returnData.push(...executionData);
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
				continue;
			}

			throw new NodeOperationError(this.getNode(), error, {
				itemIndex: i,
				description: error.description,
			});
		}
	}

	return [returnData];
}
