import {executeGetAll} from "./operations/getAll";
import {executeGet} from "./operations/get";
import {executeCreate} from "./operations/create";

export const InvoiceOperations = {
	getAll: executeGetAll,
	get: executeGet,
	create: executeCreate
}
