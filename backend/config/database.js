const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
    constructor() {
        this.pool = null;
        this.isConnected = false;
    }

    createPool() {
        const dbConfig = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'webapp',
            password: process.env.DB_PASSWORD || 'webapp123',
            database: process.env.DB_NAME || 'comment_system',
            port: parseInt(process.env.DB_PORT) || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            acquireTimeout: 60000,
            timeout: 60000,
            reconnect: true,
            charset: 'utf8mb4',
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        };

        this.pool = mysql.createPool(dbConfig);
        return this.pool;
    }

    async initialize() {
        try {
            if (!this.pool) {
                this.createPool();
            }

            const connection = await this.pool.getConnection();
            console.log('✅ MySQL 연결 성공!');

            await this.createTables(connection);
            connection.release();

            this.isConnected = true;
            return true;
        } catch (err) {
            console.error('❌ 데이터베이스 초기화 실패:', err.message);

            if (process.env.NODE_ENV === 'production') {
                throw err;
            } else {
                console.warn('⚠️  개발 모드: 데이터베이스 없이 계속 실행됩니다.');
                return false;
            }
        }
    }

    async createTables(connection) {
        const tables = [
            {
                name: 'comments',
                query: `
                    CREATE TABLE IF NOT EXISTS comments (
                        id VARCHAR(16) PRIMARY KEY,
                        project_id VARCHAR(50) NOT NULL,
                        user_name VARCHAR(50) NOT NULL,
                        comment_text TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        is_deleted TINYINT(1) DEFAULT 0,
                        user_ip VARCHAR(45),
                        INDEX idx_project_id (project_id),
                        INDEX idx_created_at (created_at),
                        INDEX idx_is_deleted (is_deleted),
                        INDEX idx_user_ip (user_ip)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                `
            },
            {
                name: 'workdata',
                query: `
                    CREATE TABLE IF NOT EXISTS workdata (
                        id INT PRIMARY KEY,
                        badge VARCHAR(50),
                        badge_text VARCHAR(20),
                        image VARCHAR(500),
                        mall_name VARCHAR(100),
                        title VARCHAR(255) NOT NULL,
                        participants VARCHAR(100),
                        winners VARCHAR(100),
                        deadline VARCHAR(100),
                        type VARCHAR(50),
                        skills JSON,
                        url VARCHAR(500),
                        content TEXT,
                        category VARCHAR(50),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        INDEX idx_category (category),
                        INDEX idx_type (type)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                `
            },
            {
                name: 'inquiries',
                query: `
                    CREATE TABLE IF NOT EXISTS inquiries (
                        id INT(11) NOT NULL AUTO_INCREMENT,
                        inquiry_type ENUM('포트폴리오관련','협업제안','기타') NOT NULL,
                        name VARCHAR(100) NOT NULL,
                        email VARCHAR(255) NOT NULL,
                        title VARCHAR(255) NOT NULL,
                        content TEXT NOT NULL,
                        attachment_filename VARCHAR(255) DEFAULT NULL,
                        privacy_agreed TINYINT(1) DEFAULT 1,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        PRIMARY KEY (id),
                        INDEX idx_inquiry_type (inquiry_type),
                        INDEX idx_created_at (created_at)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                `
            }
        ];

        for (const table of tables) {
            await connection.execute(table.query);
            console.log(`✅ ${table.name} 테이블 확인/생성 완료`);
        }
    }

    async query(sql, params = []) {
        if (!this.pool) {
            throw new Error('데이터베이스 연결이 설정되지 않았습니다');
        }
        return await this.pool.execute(sql, params);
    }

    async close() {
        if (this.pool) {
            await this.pool.end();
            this.isConnected = false;
            console.log('✅ 데이터베이스 연결이 안전하게 종료되었습니다.');
        }
    }
}

const db = new Database();

module.exports = { db };