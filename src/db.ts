/**
 * Модуль работы с PostgreSQL.
 * Хранит отсортированные массивы, где каждый элемент - отдельная запись.
 */

import { Pool } from 'pg';

// Пул для создания базы данных
const initPool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
});

async function createDatabase() {
    try {
        await initPool.query('CREATE DATABASE sort_db');
    } catch (err: any) {
        if (err.code === '42P04') {
            console.log('БД уже существует');
        } else throw err;
    } finally {
        await initPool.end();
    }
}

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'sort_db'
});

export async function initDatabase() {
    await createDatabase();
    await pool.query(`
        CREATE TABLE IF NOT EXISTS sorted_arrays (
            id SERIAL PRIMARY KEY,
            value INTEGER,
            array_id INTEGER
        )
    `);
}

/**
 * Создает таблицу для хранения отсортированных массивов
 */
export async function createArrayTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS sorted_arrays (
            id SERIAL PRIMARY KEY,    -- Уникальный идентификатор
            value INTEGER,           -- Значение элемента массива
            array_id INTEGER         -- ID массива, к которому принадлежит элемент
        )
    `;
    await pool.query(query);
}


export async function saveSort(arr: number[]) {
    const maxIdResult = await pool.query('SELECT MAX(array_id) FROM sorted_arrays');
    const arrayId = (maxIdResult.rows[0].max || 0) + 1;

    for (let i = 0; i < arr.length; i++) {
        await pool.query(
            'INSERT INTO sorted_arrays (array_id, value) VALUES ($1, $2)',
            [arrayId, arr[i]]
        );
    }
    return arrayId;
}

export async function getArray(arrayId: number) {
    const result = await pool.query(
        'SELECT value FROM sorted_arrays WHERE array_id = $1',
        [arrayId]
    );
    return result.rows.map(row => row.value);
}


