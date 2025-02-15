import "dotenv/config";

const env = {
	port: process.env.SERVER_PORT,
	db_url: process.env.DATABASE_URL,
	server_url: process.env.SERVER_URL,
};

export default env;
