[![npm](https://img.shields.io/npm/dm/n8n-nodes-lavatop?color=blue&label=downloads)](https://www.npmjs.com/package/n8n-nodes-lavatop)
[![npm version](https://img.shields.io/npm/v/n8n-nodes-lavatop)](https://www.npmjs.com/package/n8n-nodes-lavatop)
[![license](https://img.shields.io/npm/l/n8n-nodes-lavatop)](https://github.com/zdadco/n8n-nodes-lavatop/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/zdadco/n8n-nodes-lavatop)](https://github.com/zdadco/n8n-nodes-lavatop/stargazers)

# n8n-nodes-lavatop

This is a n8n community node that provides integration with LavaTop platform for digital product sales and subscriptions.

[LavaTop](https://app.lava.top/) is a platform for creators to sell digital products, courses, and subscriptions with built-in payment processing and analytics.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.


## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Invoice Operations
- **Create Invoice:** Generate new payment invoices
- **Get Invoice:** Retrieve invoice details by ID 
- **Get All Invoices:** List all invoices with filtering options

### Product Operations
- **Get Products:** List available products
- **Update Product:** Modify product details and pricing

### Report Operations
- **Get All Sales:** Retrieve complete sales reports
- **Get Sales by Product:** Get sales data for specific products

### Subscription Operations
- **Delete Subscription:** Cancel existing subscriptions

### Donate Operations
- **Get Donate Link:** Generate donation links for creators

## Credentials

To use this node, you need to configure API credentials:
1. Go to your LavaTop Account Settings 
2. Generate a new API key 
3. In n8n:
   1. Add LavaTop credentials 
   2. Enter your API key

## Compatibility

n8n version - 1.86.1

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## Version history

### 1.0.0
- Basic operations for invoices, products, and subscriptions
- Support for all LavaTop payment methods
