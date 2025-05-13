type Resource = 'invoice' | 'product' | 'report' | 'subscription' | 'donate';

type ProductOperation = 'getAll' | 'update';
type InvoiceOperation = 'getAll' | 'get' | 'create';
type ReportOperation = 'getAllSales' | 'getAllSalesByProduct';
type SubscriptionOperation = 'delete';
type DonateOperation = 'get';

type Currency = 'RUB' | 'USD' | 'EUR';
type Status =
	| 'NEW'
	| 'IN_PROGRESS'
	| 'COMPLETED'
	| 'FAILED'
	| 'SUBSCRIPTION_ACTIVE'
	| 'SUBSCRIPTION_EXPIRED'
	| 'SUBSCRIPTION_CANCELLED'
	| 'SUBSCRIPTION_FAILED';
type PaymentMethod = 'BANK131' | 'UNLIMINT' | 'PAYPAL' | 'STRIPE';
type Periodicity = 'ONE_TIME' | 'MONTHLY' | 'PERIOD_90_DAYS' | 'PERIOD_180_DAYS' | 'PERIOD_YEAR';
type Language = 'EN' | 'RU' | 'ES';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
