import postgres from "pg"
import { databaseUrl, postgresConfig, production } from "../config/config.js"

const pg = new postgres.Client(
    production == 'true' ?
        {
            connectionString: databaseUrl,
            ssl: {
                rejectUnauthorized: false,
            },
            reconnect: true,
            connectionTimeoutMillis: 10000
        }
        :
        postgresConfig
)
pg.connect()
    .then(() => console.log(production == 'true' ? 'PostgreSQL (Neon) is connected' : 'PostgreSQL is connected'))
    .catch(err => console.error(err))


export default pg