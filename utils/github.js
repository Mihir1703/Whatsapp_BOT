const { MessageType, Mimetype } = require('@adiwajshing/baileys');
const { default: axios } = require("axios")
const github_api = "https://api.github.com/users/"

module.exports = async (client, controller, args) => {
    let fetch = await controller.sendMessage(client, "Please wait while I fetch the data..(❁´◡`❁)", MessageType.text);
    let query = github_api + String(args).toLocaleLowerCase();
    axios.get(query).then(async (data) => {
        data = data.data;
        if (data.message === "Not Found") {
            await controller.sendMessage(client, "User not found!!(┬┬﹏┬┬)", MessageType.text);
        } else {
            let message = `*Name* : ${data.name} \n*Username* : ${data.login} \n\n*Followers* : ${data.followers} \n*Following* : ${data.following} \n*Public Repos* : ${data.public_repos} \n*Public Gists* : ${data.public_gists} \n*Location* : ${data.location} \n*Bio* : ${data.bio} \n*Company* : ${data.company} \n*Website* : ${data.blog == "" ? "Don't Have any" : data.blog} \n*Joined* : ${new Date(data.created_at).toLocaleDateString()}`;
            try {
                let repo_url = await axios.get(query + '/repos');
                repo_url = repo_url.data;
                if (repo_url.length == 0) {

                } else {
                    Array.from(repo_url).map((element) => {
                        message += `\n*Repo Name* : ${element.name} \n*Repo URL* : ${element.html_url}`;
                    })
                }
            } catch (err) {
                console.log(err)
            }
            await controller.sendMessage(client, {
                url: data.avatar_url
            }, MessageType.image, {
                mimetype: Mimetype.png,
                caption: message,
            });
            await controller.deleteMessage(client, {
                id: fetch.key.id,
                remoteJid: client,
                fromMe: true,
            });
        }
    }).catch(async (err) => {
        await controller.sendMessage(client, {text:"User not found!!(┬┬﹏┬┬)"});
        // await controller.deleteMessage(client, {
        //     id: fetch.key.id,
        //     remoteJid: client,
        //     fromMe: true,
        // });
    })

}