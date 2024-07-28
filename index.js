const app = require('./src/app');
const { sequelize } = require('./src/config/db');

const PORT = process.env.SERVER_PORT || 5001;

const startServer = async () => {
    try {
        await sequelize.sync();
        console.log('Database synced');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`Unable to start server: ${error.message}`);
    }
};

startServer();