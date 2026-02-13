# POST `/gauntlets/createGauntlet`
### Body:
- api_key: string,
- gauntlet:
    - name: string
    - bg_color: string[]
    - levels: number[]
    - releaseDate: Date | null

### Returns:
On Success: Gauntlet Object  
On Error: Error

# GET `/gauntlets/getGauntlet?gauntletID=?`