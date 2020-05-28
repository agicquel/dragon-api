const crypto = require('crypto');
const bl = require('bl');
const Discord = require("discord.js");

module.exports = function(options, imports, register) {
    const service = imports.service;

    const handler = function(req, emitData) {
        service.model().findOne({_id: req.params.id}, function (err, service) {
            if (!err && service !== undefined) {
                const id = service.meta.find(meta => meta.key === "discord-id");
                const token = service.meta.find(meta => meta.key === "discord-token");
                if(id !== undefined && token !== undefined) {
                    console.log(emitData);
                    const webhookClient = new Discord.WebhookClient(id.value, token.value);
                    const embed = new Discord.MessageEmbed()
                        .setTitle(emitData.event + " by " + emitData.payload.sender.login)
                        .setURL(emitData.payload.repository.html_url)
                        .setDescription('Repository : ' + emitData.payload.repository.full_name)
                        .setThumbnail(emitData.payload.sender.avatar_url)
                        .setTimestamp()
                        .setColor('#0099ff');

                    if(emitData.event === "push") {
                        embed.addField("Commit message", emitData.payload.head_commit.message, false);
                        embed.addField("Commit ID", emitData.payload.head_commit.id, false);
                        embed.addField("Pusher name", emitData.payload.pusher.name, false);
                        embed.addField("Pusher email", emitData.payload.pusher.email, false);
                    }

                    webhookClient.send('Github Notification /!\\', {
                        username: 'Dragon Bot Z',
                        avatarURL: 'https://i.imgur.com/3fE6MGJ.jpg',
                        embeds: [embed],
                    }).catch((error) => {
                        console.error(error);
                    });
                }
            }
        });
    };

    const sign = function(data) {
        return `sha1=${crypto.createHmac('sha1', process.env.GITHUB_TOKEN).update(data).digest('hex')}`
    }

    const verify = function(signature, data) {
        const sig = Buffer.from(signature)
        const signed = Buffer.from(sign(data))

        if (sig.length !== signed.length) {
            return false
        }
        return crypto.timingSafeEqual(sig, signed);
    };

    service.register("github-discord", "POST", function (req, res) {
        const sig = req.headers['x-hub-signature']
        const event = req.headers['x-github-event']
        const id = req.headers['x-github-delivery']

        if (!verify(sig, JSON.stringify(req.body))) {
            res.status(400).send("{\"error\":\"X-Hub-Signature does not match blob signature\"}");
        }
        else {
            res.status(200).send("{\"ok\":true}");
        }

        const emitData = {
            event: event,
            id: id,
            payload: req.body,
            protocol: req.protocol,
            host: req.headers.host,
            url: req.url,
        }

        handler(req, emitData);
    });

    register(null, {});
}
