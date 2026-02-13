import {Router} from "express"
import { verifyAPIKey } from "../lib/config.ts"
import { createGauntlet } from "../lib/gauntlets.ts"
import { db } from "../lib/util.ts"

export const gauntletRouter: Router = Router()

gauntletRouter.post("/createGauntlet", async (req, res) => {
    const data = req.body

    if (!verifyAPIKey(data.api_key)) {
        return res.status(403).send("API Key not recognized")
    }

    const gauntlet = createGauntlet(
        data.gauntlet.id,
        data.gauntlet.name,
        data.gauntlet.bg_color,
        data.gauntlet.levels
    )

    try {
        db.prepare("INSERT INTO gauntlets (id, name, bgColor, levels) VALUES (?, ?, ?, ?)")
            .run(gauntlet.id, gauntlet.name, gauntlet.bgColor.join(";"), gauntlet.levels.join(";"))

        return res.json({
            gauntlet: gauntlet
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

gauntletRouter.get("/getGauntlet", async (req, res) => {
    const id = req.query.gauntletID

    if (id === undefined) {
        return res.status(500).send("No gauntletID provided.")
    }

    try {
        const gauntletRow = db.prepare("SELECT * FROM gauntlets WHERE id = ?").get(id) as any

        const gauntlet = createGauntlet(
            gauntletRow.id, gauntletRow.name, gauntletRow.bgColor.split(";"), gauntletRow.levels.split(";")
        )
        return res.json({
            gauntlet: gauntlet
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

gauntletRouter.get('/getGauntlets', async (req, res) => {
    try {
        const allGauntlets = db.prepare("SELECT * FROM gauntlets").all()

        return res.json({
            gauntlets: allGauntlets
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})