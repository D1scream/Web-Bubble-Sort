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
                    nums INTEGER[],
                    array_id INTEGER
                )
            `)
        } catch (err) {
            console.error('Error connecting to DB:', err)
            throw err
        }
    }

    async save(nums: number[]) {
        const maxIdResult = await pool.query(
            'SELECT COALESCE(MAX(array_id), 0) as max_id FROM sorted_arrays'
        );
        const nextArrayId = maxIdResult.rows[0].max_id + 1;

        const result = await pool.query(
            'INSERT INTO sorted_arrays (nums, array_id) VALUES ($1, $2) RETURNING array_id',
            ['{' + nums.join(',') + '}', nextArrayId]
        );
        return result.rows[0].array_id;
    }

    async get(id: number) {
        const result = await pool.query(
            'SELECT nums FROM sorted_arrays WHERE array_id = $1',
            [id]
        )
        console.log('Result:', result.rows[0]?.nums);
        return result.rows[0]?.nums || null
    }
}

export default new DbController() 