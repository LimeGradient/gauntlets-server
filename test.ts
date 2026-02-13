import axios from "axios";

axios.post("http://localhost:3000/gauntlets/createGauntlet", {
    api_key: "d8808851334ce811f4120392805961d8",
    gauntlet: {
        name: "test gauntlet",
        bg_color: ["#27F5F2", "#AD27F5"],
        levels: [
            1, 2, 3, 4, 5
        ]
    }
}).then((res) => {
    console.log(res.data)
})