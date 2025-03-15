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
        await pool.query(`
            CREATE TABLE IF NOT EXISTS arrays (
                id SERIAL PRIMARY KEY,
                nums INTEGER[]
            )
        `)
    }

    async save(nums: number[]) {
        const { rows } = await pool.query(
            'INSERT INTO arrays (nums) VALUES ($1) RETURNING id',
            [nums]
        )
        return rows[0].id
    }

    async get(id: number) {
        const { rows } = await pool.query(
            'SELECT nums FROM arrays WHERE id = $1',
            [id]
        )
        return rows[0]?.nums || null
    }
}

export default new DbController() 