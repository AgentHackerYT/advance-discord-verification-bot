try{
const { Database } = require('easymapdb')

const SessionIDGenerator = require('./utils')

const fs = require('fs')

const Discord = require('discord.js')

const { MessageEmbed } = require('discord.js')

const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.DIRECT_MESSAGES]})

const token = process.env.TOKEN

client.login("token")

const db = new Database()

const express = require('express')

const app = express()

app.use(express.json())

client.on('ready', () =>{

    console.log('Bot Ready')

    client.application.commands.create({
        "name": "setup",
        description: "Setup verification for your server",
        "options": [
            {
                "name": "role",
                'description': "The Role to be given after verification",
                'type': 'ROLE',
                'required': true
            },
            {"choices": [
                {"name": "Basic Verification", "value": 'basic'}, 
                {"name": "Captcha Verification", value: "captcha"}
            ],
             "description": "Mode of verification", 
             "type": "STRING",
             "name": "choose",
             'required': true
            }
            ]
        })

        client.application.commands.create({
            name: "help",
            "description": "shows the help command"
        })

        client.application.commands.create({
            name: "verify",
            "description": "The command which verifies you and lets you access the server"
        })
})

client.on("interactionCreate", (interaction) => {

    if(!interaction.isCommand()) return;

    if(interaction.commandName == "setup"){

        const permEmbed = new MessageEmbed()

        .setTitle("Permissions Missing")

        .setDescription("You need `MANAGE_GUILD` Permission To Use this command")

        .setColor("RED");

        const posEmbed = new MessageEmbed()

        .setTitle("Role Postion")

        .setDescription("You Can't use a role which the same or more postion then yours")

        .setColor("RED");

        if(!interaction.member.permissions.has(["MANAGE_GUILD"])) return interaction.reply({embeds: [permEmbed]});

        let role = interaction.options.getRole("role")

        let type = interaction.options.getString("choose")

        if(!role) return interaction.reply({content: "Wrong Usage, \n\nMention A Role , `Usage: /setup <role> <type (captcha, verify)>`", ephemeral:true});

        if(!type) return interaction.reply({content: "Wrong Usage, \n\nMention A Type , `Usage: /setup <role> <type (captcha, verify)>`", ephemeral:true});

        if(type == "basic") type = "basic"
        else if(type == "captcha") type = "captcha"
        else return interaction.reply({content: "Wrong Usage, \n\nInvalid Type , `Usage: /setup <role> <type (captcha, verify)>`", ephemeral:true})

        if(interaction.member.roles.highest.position <= role.position) return interaction.reply({embeds: [posEmbed]});

        if(interaction.guild.me.roles.highest <= role.position) return interaction.reply({content: "Verified Role Must be below my highest role"});

        if(!interaction.guild.me.permissions.has("MANAGE_ROLES")) return interaction.reply({content: "Give me `MANAGE_ROLES` Permissions and try again"});

        db.set(`${interaction.guild.id}`, {
            role: role.id,
            type: type,
        })

        interaction.reply({embeds: [{"color": "GREEN", "description": `<@&${role.id}> is the role which users will get after verification.`, title: "Success"}]})

    }

    if(interaction.commandName == "verify"){
        

        if(!db.get(`${interaction.guild.id}`)) return interaction.reply({content: `${message.guild.name} has not completed/begin my setup`, ephemeral: true})

        if(!interaction.guild.me.permissions.has("MANAGE_ROLES")) return interaction.reply({content: "I don't have `MANAGE_ROLES` Permission and Contact the mod of the server", ephemeral:true})

        const id = SessionIDGenerator()

        if(db.get(`${interaction.guild.id}`).type == "basic"){

        db.set(id, { "id": interaction.user.id, "guildId": interaction.guild.id})

        interaction.reply({content: `Verify By Clicking Here: yoururl/session/${id}`, "ephemeral": true})

        }else if(db.get(`${interaction.guild.id}`).type == "captcha"){

            db.set(id, {"id": interaction.user.id, "guildId": interaction.guild.id})

            interaction.reply({content: `Verify By Clicking Here: yoururl/captcha/${id}`, "ephemeral": true})


        }
    }

  if(interaction.commandName == "help"){

    const embed = new MessageEmbed()
    
  }

})


const files = fs.readdirSync("./server")

files.forEach(file =>{

    const site = require(`./server/${file}`)

    console.log(site)

    app.get(site.endpoint, (req, res) => site.run(req, res, db, client))

})


app.use((req, res) =>{
    res.status(404)
    .send(`
    <div id="main">

    	<div class="fof">

        		<h1>Error 404</h1>

                <br>

                <h1>${req.url} doesn't exist</h1>

                <br>

                <h1 id="timer">Redirecting To Homepage in 5 seconds</h1>

            

    	</div>

</div>

<script>

window.onload = () =>{

    var i = 4
    setInterval(() => {

        document.getElementById("timer").innerHTML = 'Redirecting To Homepage in ' + i + ' seconds'
        
        i = i - 1

    }, 1000)

    setInterval(() =>{

    window.location.href = "/"

    }, 5000)
}

</script>

<style>
*{
    transition: all 0.6s;
}

html {
    height: 100%;
}

body{
    font-family: 'Lato', sans-serif;
    color: #888;A
    margin: 0;
}

#main{
    display: table;
    width: 100%;
    height: 100vh;
    text-align: center;
}

.fof{
	  display: table-cell;
	  vertical-align: middle;
}

.fof h1{
	  font-size: 50px;
	  display: inline-block;
	  padding-right: 12px;
	  animation: type .5s alternate infinite;
}

@keyframes type{
	  from{box-shadow: inset -3px 0px 0px #888;}
	  to{box-shadow: inset -3px 0px 0px transparent;}
}
<style/>
    `)


})

app.listen(8080, () => console.log("Server Ready"))

}catch(e){
  console.log(e)
}
