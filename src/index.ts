import { getAdminAPIKey, loadConfigFile } from "./lib/config.ts";

import express from "express"
import bodyParser from "body-parser"
import { gauntletRouter } from "./routes/gauntlets.ts";

const config = loadConfigFile()

const app = express()
app.use(express.json())

app.use("/gauntlets", gauntletRouter)

app.get("/", (req, res) => {
    res.send("made by limegradient")
})

app.listen(config.server_port, () => {
    if (config.logging_settings.show_admin_api_key_on_launch) {
        console.log(`
        *********************************************************************
        ADMIN API KEY: ${getAdminAPIKey(config.admin_account.id)}
        *********************************************************************    
        `)
    }
    console.log(`Server started: http://localhost:${config.server_port}`)
})