import { Pool } from 'pg'

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'sort_db'
})

class DbController {
    async init() {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS sorted_arrays (
                    id SERIAL PRIMARY KEY,
                    value DOUBLE PRECISION,
                    array_id INTEGER
                )
            `)
        } catch (err) {
            console.error('Error connecting to DB:', err)
            throw err
        }
    }

    async save(nums: number[]) {
        // Получение свободного array_id
        const result = await pool.query('SELECT MAX(array_id) FROM sorted_arrays')
        const id = (result.rows[0].max || 0) + 1
        for (const num of nums) {
            await pool.query('INSERT INTO sorted_arrays (value, array_id) VALUES ($1, $2)', [num, id])
        }
        return id;
    }

    async get(id: number) {
        const result = await pool.query('SELECT value FROM sorted_arrays WHERE array_id = $1', [id])
        return result.rows.map(row => row.value)
    }
}

// SingleTon
export default new DbController() 