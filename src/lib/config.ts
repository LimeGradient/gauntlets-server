import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { db } from "./util.ts"
import type { User } from "../types/user.ts"

interface ConfigFile {
    server_port: number,
    database_name: string,
    admin_account: {
        id: number
        name: string,
        email: string,
        password: string
    },
    logging_settings: {
        show_admin_api_key_on_launch: boolean
    }
}

export function loadConfigFile(): ConfigFile {
    // Check if config file exists
    if (!fs.existsSync(path.join(import.meta.dirname, "../../config/config.json"))) {
        if (!fs.existsSync(path.join(import.meta.dirname, "../../config/"))) {
            fs.mkdirSync(path.join(import.meta.dirname, "../../config/"))
        }
        generateConfigFile()
    }

    const fileData = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "../../config/config.json"), "utf-8")) as ConfigFile

    const adminRow: User = db.prepare("SELECT * FROM users WHERE id = ?").get(fileData.admin_account.id) as User
    if (adminRow === undefined) {
        generateAdminAccount(fileData)
    } else {
        if (adminRow.name !== fileData.admin_account.name) {
            db.prepare("UPDATE users SET name = ? WHERE id = ?").run(fileData.admin_account.name, adminRow.id)
        }

        if (adminRow.email !== fileData.admin_account.email) {
            db.prepare("UPDATE users SET email = ? WHERE id = ?").run(fileData.admin_account.email, adminRow.id)
        }

        if (adminRow.password !== fileData.admin_account.password) {
            db.prepare("UPDATE users SET password = ? WHERE id = ?").run(fileData.admin_account.password, adminRow.id)
        }
    }

    return fileData
}

function generateConfigFile() {
    const defaultConfig: ConfigFile = {
        server_port: 3000,
        database_name: "database",
        admin_account: {
            id: 1,
            name: "admin",
            email: "admin@admin.net",
            password: crypto.randomBytes(16).toString('hex')
        },
        logging_settings: {
            show_admin_api_key_on_launch: true
        }
    }

    fs.writeFileSync(path.join(import.meta.dirname, "../../config/config.json"), JSON.stringify(
        defaultConfig, null, 4
    ))
}

async function generateAdminAccount(config: ConfigFile) {
    try {
        db.prepare("INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)").run(
            config.admin_account.id,
            config.admin_account.name,
            config.admin_account.email,
            config.admin_account.password
        )
    } catch (error) {
        console.error("Error generating admin account: " + error)
    }
}

export function getAdminAPIKey(admin_user_id: number) {
    const apiKeyRow = db.prepare("SELECT * FROM apiKeys WHERE createdBy = ?").get(admin_user_id)
    if (apiKeyRow === undefined) {
        const key = crypto.randomBytes(16).toString('hex')
        db.prepare("INSERT INTO apiKeys (createdBy, key) VALUES (?, ?)").run(admin_user_id, key)
        return key
    } else {
        return (apiKeyRow as any).key as string
    }
}

export function verifyAPIKey(api_key: string): boolean {
    const apiKeyRow = db.prepare("SELECT * FROM apiKeys WHERE key = ?").get(api_key)
    if (apiKeyRow === undefined) {
        return false
    } else {
        return true
    }
}

export function getConfigKey(key: string) {
    if (fs.existsSync(path.join(import.meta.dirname, "../../config/config.json"))) {
        const fileData = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "../../config/config.json"), "utf-8"))
        return fileData[key]
    }
}