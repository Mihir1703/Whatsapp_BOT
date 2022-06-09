const { default: axios } = require("axios")

module.exports = async (client, controller, args) => {
    let alert = await controller.sendMessage(client, { text: "Please wait while I fetch the data..." });
    let query = "https://geeks-for-geeks-api.vercel.app/" + String(args).split(" ").join("").toLocaleLowerCase();
    let response = await axios.get(query);
    response = response.data;
    console.log(Object.keys(response))
    if (Object.keys(response).length === 2) {
        let dsa_450 = 0;
        response.solvedStats.school.questions.map(item => {
            if (item.fromBabbar450Sheet) {
                dsa_450++;
            }
        })
        response.solvedStats.basic.questions.map(item => {
            if (item.fromBabbar450Sheet) {
                dsa_450++;
            }
        })
        response.solvedStats.easy.questions.map(item => {
            if (item.fromBabbar450Sheet) {
                dsa_450++;
            }
        })
        response.solvedStats.medium.questions.map(item => {
            if (item.fromBabbar450Sheet) {
                dsa_450++;
            }
        })
        response.solvedStats.hard.questions.map(item => {
            if (item.fromBabbar450Sheet) {
                dsa_450++;
            }
        })
        let message = `*Name* : ${response.info.name} \n*Institute* : ${response.info.institution}\n*Score* : ${response.info.codingScore} (questions == ${response.info.solved}) \n\n*School* == ${response.solvedStats.school.count} \n*Basic* == ${response.solvedStats.basic.count} \n*Easy* == ${response.solvedStats.easy.count} \n*Medium* == ${response.solvedStats.medium.count} \n*Hard* == ${response.solvedStats.hard.count} \n\n*DSA 450 Score* == ${((dsa_450 * 100) / 450).toFixed(2)}%`
        const final_message = await controller.sendMessage(client, { text: message });
        const reactionMessage = {
            react: {
                text: "😉",
                key: final_message.key
            }
        }
        await controller.sendMessage(client, reactionMessage)
    } else {
        const final_message = await controller.sendMessage(client, { text: "User not found!!(┬┬﹏┬┬)" });
        const reactionMessage = {
            react: {
                text: "😒",
                key: final_message.key
            }
        }
        await controller.sendMessage(client, reactionMessage)
    }
    await controller.sendMessage(client, {
        delete: alert.key
    })
}