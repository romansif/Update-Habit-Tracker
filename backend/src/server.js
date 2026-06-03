import app from './app.js';

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        console.log('✓ База данных загружена');

        app.listen(port, () => {
            console.log(`✓ Сервер запущен на http://localhost:${port}`);
            console.log(`  API: http://localhost:${port}/api`);
        });
    } catch (error) {
        console.error('✗ Ошибка запуска сервера:', error);
        process.exit(1);
    }
};

start();
