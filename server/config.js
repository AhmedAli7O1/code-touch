module.exports = {
	// production settings
	SERVER_URL: process.env.SERVER_URL || 'http://localhost:3000/',
	MONGODB: process.env.MONGODB || 'mongodb://localhost:27017/codeTouch',
	SECRET_KEY: process.env.SECRET_KEY || 'spmek-alf56-RodE0-92134-46fsnv-woR4z',
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'TestTestTestTestTestTestTestTest',
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'TestTestTestTestTestTestTestTest',
	GOOGLE_AUTH_CB: process.env.GOOGLE_AUTH_CB || '' // google auth callback
};