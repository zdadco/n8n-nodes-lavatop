import {executeGetAllSales} from "./operations/getAllSales";
import {executeGetAllSalesByProduct} from "./operations/getAllSalesByProduct";

export const ReportOperations = {
	getAllSales: executeGetAllSales,
	getAllSalesByProduct: executeGetAllSalesByProduct
}
