import type {Database as BetterDatabase} from "better-sqlite3"
import Database from "better-sqlite3"
import path from "node:path"
import { getConfigKey } from "./config.ts"

export const db: BetterDatabase = new Database(path.resolve(`db/${getConfigKey("database_name")}.db`))