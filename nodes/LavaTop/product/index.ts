import {executeGetAll} from "./operations/getAll";
import {executeUpdate} from "./operations/update";

export const ProductOperations = {
	getAll: executeGetAll,
	update: executeUpdate
}
