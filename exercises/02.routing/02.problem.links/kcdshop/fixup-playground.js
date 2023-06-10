// update the .env file to use the proper database path
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envExamplePath = path.join(__dirname, '..', '.env.example')
const envPath = path.join(__dirname, '..', '.env')
const databasePath = path.join(__dirname, '..', '..', 'data.db')
const env = fs.readFileSync(envExamplePath, 'utf8')

const newEnv = env
	.replace(
		/DATABASE_PATH=.*\n/,
		`DATABASE_PATH=${JSON.stringify(databasePath)}\n`,
	)
	.replace(
		/DATABASE_URL=.*\n/,
		`DATABASE_URL=${JSON.stringify(
			`file:${databasePath}?connection_limit=1`,
		)}\n`,
	)

fs.writeFileSync(envPath, newEnv)
