module.exports = {
	// production settings
	SERVER_URL: process.env.SERVER_URL || 'http://localhost:3000/',
	MONGODB: process.env.MONGODB || 'mongodb://localhost:27017/codeTouch',
	SECRET_KEY: process.env.SECRET_KEY || 'spmek-alf56-RodE0-92134-46fsnv-woR4z',
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'TestTestTestTestTestTestTestTest',
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'TestTestTestTestTestTestTestTest',
	GOOGLE_AUTH_CB: process.env.GOOGLE_AUTH_CB || 'http://localhost:3000/users/login/google/callback', // google auth callback
	GMAIL_ACCOUNT: process.env.GMAIL_ACCOUNT || '',
	GMAIL_PASSWORD: process.env.GMAIL_PASSWORD || '',
	
	// Mailjet config
	MJ_APIKEY_PUBLIC: process.env.MJ_APIKEY_PUBLIC || '',
	MJ_APIKEY_PRIVATE: process.env.MJ_APIKEY_PRIVATE || ''
};