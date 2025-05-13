// This file ensures n8n can find and load your nodes and credentials
const { LavaTop } = require("./nodes/LavaTop/LavaTop.node.js");
const { LavaTopApi } = require("./credentials/LavaTopApi.credentials.ts");

module.exports = {
	nodeTypes: {
		lavaTop: LavaTop,
	},
	credentialTypes: {
		lavaTopApi: LavaTopApi,
	},
};
