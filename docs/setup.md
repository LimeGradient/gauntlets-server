# Server Setup Guide

## Prerequisites
- [Node.JS](https://nodejs.org/en/download)
- [SQLite3](https://sqlite.org/download.html)

## First Time Setup
1. Clone the server and cd into it
```bash
git clone https://github.com/LimeGradient/gauntlets-server.git
cd gauntlets-server
```
2. Setup the database with required schemas
```bash
sqlite3 db/<database name>.db < db/schema/user.sql
sqlite3 db/<database name>.db < db/schema/gauntlets.sql
```
3. Run the server once to generate config file at `config/config.json`
```bash
npm run start
```

## Config File
```json
{
    "server_port": 3000,
    "database_name": "database",
    "admin_account": {
        "id": 1,
        "name": "admin",
        "email": "admin@admin.net",
        "password": "<random string>"
    },
    "logging_settings": {
        "show_admin_api_key_on_launch": true
    }
}
```
This is an example of the default config file the server will generate for you

- `server_port` - The port the server will run on. Defaults to 3000
- `database_name` - The name of your database file. Defaults to "database"
- `admin_account` - All the information of the admin account.
    - `id` - The ID of the admin account. Recommended to stay at 1 for simplicity purposes.
    - `name` - The name of the admin account. Defaults to "admin"
    - `email` - The email of the admin account. Defaults to "admin@admin.net"
    - `password` - The password of the admin account. Defaults to a random 16 character string.
- `logging_settings` - Optional console logging settings
    - `show_admin_api_key_on_launch` - Whether to log the admin accounts API key or not. Defaults to `true`