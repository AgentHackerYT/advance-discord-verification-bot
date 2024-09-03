try {
  module.exports = {

    endpoint: '/session/:sessionId',

    run: async (req, res, db, client) => {

    if(req.headers['user-agent'] == 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)') return;
      
      const id = req.params.sessionId

      if (!id) return res.status(400).send(`
        <html>
                <head>
                  <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
                </head>
                  <style>
                    body {
                      text-align: center;
                      padding: 40px 0;
                      background: #EBF0F5;
                    }
                      h1 {
                        color: #ff0000;
                        font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                        font-weight: 900;
                        font-size: 40px;
                        margin-bottom: 10px;
                      }
                      p {
                        color: #404F5E;
                        font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                        font-size:20px;
                        margin: 0;
                      }
                    i {
                      color: #ff0000;
                      font-size: 100px;
                      line-height: 200px;
                      margin-left:-15px;
                    }
                    .card {
                      background: white;
                      padding: 60px;
                      border-radius: 4px;
                      box-shadow: 0 2px 3px #C8D0D8;
                      display: inline-block;
                      margin: 0 auto;
                    }
                  </style>
                  <body>
                    <div class="card">
                    <div style="border-radius:200px; height:200px; width:200px; background:#fcdcdc; margin:0 auto;">
                      <i class="cross">✘</i>
                    </div>
                      <h1>Missing</h1> 
                      <p>Session ID Parameter Missing</p>
                    </div>
                    <img src="${require("../models/ads")()[0].link}" href="${require("../models/ads")()[0].redirect}" width="10%" height="10%">
                  </body>
              </html>
              <script>
              console.log('%cStop!', 'color: red; font-size: 30px; font-weight: bold;  -webkit-text-stroke-width: 1px;-webkit-text-stroke-color: black;');
              </script>
        `);

      const data = db.get(id)

      if (!data) return res.status(400).send(`
        <html>
                <head>
                  <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
                </head>
                  <style>
                    body {
                      text-align: center;
                      padding: 40px 0;
                      background: #EBF0F5;
                    }
                      h1 {
                        color: #ff0000;
                        font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                        font-weight: 900;
                        font-size: 40px;
                        margin-bottom: 10px;
                      }
                      p {
                        color: #404F5E;
                        font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                        font-size:20px;
                        margin: 0;
                      }
                    i {
                      color: #ff0000;
                      font-size: 100px;
                      line-height: 200px;
                      margin-left:-15px;
                    }
                    .card {
                      background: white;
                      padding: 60px;
                      border-radius: 4px;
                      box-shadow: 0 2px 3px #C8D0D8;
                      display: inline-block;
                      margin: 0 auto;
                    }
                  </style>
                  <body>
                    <div class="card">
                    <div style="border-radius:200px; height:200px; width:200px; background:#fcdcdc; margin:0 auto;">
                      <i class="cross">✘</i>
                    </div>
                      <h1>Invalid</h1> 
                      <p>"${req.url.replace("/session/", "")}" This ID Doesnt Exist</p>
                    </div>
                  </body>
              </html>
              <script>
              console.log('%cStop!', 'color: red; font-size: 30px; font-weight: bold;  -webkit-text-stroke-width: 1px;-webkit-text-stroke-color: black;');
              </script>
              `);

      const guild = await client.guilds.cache.get(data.guildId)
      const member = await guild.members.cache.get(data.id)
      if (!member) return res.send("Error Try Again")

      //if(!db.get(`role_${guild.id}`)) return member.send({content:`${guild.name} has not set me up yet`});
      const roo = await db.get(`${guild.id}`)
      const role = await guild.roles.cache.find(r => r.id == roo.role)

      db.delete(id)
      var i = 0
      member.roles.cache.forEach(async (roles) => {
        try {
          if (roles.id == role.id) {

            member.send({
              "content": `You Already Have The Role Set for verification in ${guild.name}`
            })

            res.send(`<html>
                <head>
                  <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
                </head>
                  <style>
                    body {
                      text-align: center;
                      padding: 40px 0;
                      background: #EBF0F5;
                    }
                      h1 {
                        color: #ff0000;
                        font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                        font-weight: 900;
                        font-size: 40px;
                        margin-bottom: 10px;
                      }
                      p {
                        color: #404F5E;
                        font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                        font-size:20px;
                        margin: 0;
                      }
                    i {
                      color: #ff0000;
                      font-size: 100px;
                      line-height: 200px;
                      margin-left:-15px;
                    }
                    .card {
                      background: white;
                      padding: 60px;
                      border-radius: 4px;
                      box-shadow: 0 2px 3px #C8D0D8;
                      display: inline-block;
                      margin: 0 auto;
                    }
                  </style>
                  <body>
                    <div class="card">
                    <div style="border-radius:200px; height:200px; width:200px; background:#fcdcdc; margin:0 auto;">
                      <i class="cross">✘</i>
                    </div>
                      <h1>Fail</h1> 
                      <p>${member.user.username}, You Already Have The Role set for verification in ${guild.name}</p>
                    </div>
                  </body>
              </html>
              <script>
              console.log('%cStop!', 'color: red; font-size: 30px; font-weight: bold;  -webkit-text-stroke-width: 1px;-webkit-text-stroke-color: black;');
              </script>
              `)
            return;

          } else {
            if (i != 1) {
              i++
              res.send(`
                    <html>
              <head>
                <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
              </head>
                <style>
                  body {
                    text-align: center;
                    padding: 40px 0;
                    background: #EBF0F5;
                  }
                    h1 {
                      color: #88B04B;
                      font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                      font-weight: 900;
                      font-size: 40px;
                      margin-bottom: 10px;
                    }
                    p {
                      color: #404F5E;
                      font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                      font-size:20px;
                      margin: 0;
                    }
                  i {
                    color: #9ABC66;
                    font-size: 100px;
                    line-height: 200px;
                    margin-left:-15px;
                  }
                  .card {
                    background: white;
                    padding: 60px;
                    border-radius: 4px;
                    box-shadow: 0 2px 3px #C8D0D8;
                    display: inline-block;
                    margin: 0 auto;
                  }
                </style>
                <body>
                  <div class="card">
                  <div style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">
                    <i class="checkmark">✓</i>
                  </div>
                    <h1>Success</h1> 
                    <p>Now You Can Access ${guild}<br/></p>
                  </div>
                </body>
            </html>
            <script>
            console.log('%cStop!', 'color: red; font-size: 30px; font-weight: bold;  -webkit-text-stroke-width: 1px;-webkit-text-stroke-color: black;');
            </script>
                    `)
              await member.roles.add(role)
              await member.send({
                content: `${member.user.username}, You Have been Successfully Verified, Now you can access ${guild.name}`
              })
              //setTimeout(async() =>{
                //await member.roles.remove(role)
              //}, 86400000)
            }

          }

        } catch (e) {

          console.log(e)

        }
      })



    }

  }
} catch (e) {}
