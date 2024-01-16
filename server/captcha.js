var svgCaptcha = require('svg-captcha');

module.exports = {

  endpoint: '/captcha/:sessionId',

  run: (req, res, db, client) => {

    var captcha = svgCaptcha.create();
    const width = captcha.data.replace("height=\"50\"", "height=\"300\"")
    const height = width.replace("width=\"150\"", "width=\"500\"")
    const id = req.params.sessionId
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
                      <p>"${req.url.replace("/captcha/", "")}" This ID Doesnt Exist</p>
                    </div>
                  </body>
              </html>
              <script>
              console.log('%cStop!', 'color: red; font-size: 30px; font-weight: bold;  -webkit-text-stroke-width: 1px;-webkit-text-stroke-color: black;');
              </script>
              `);
    res.type("html");
    res.status(200).send(`
        <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet">
        <center>
        <div class="card">
        ${height}
        <br>
        <h2 style="font-family: 'Quicksand', sans-serif;">Type the letters written in the image</h2>
        <br>
        <input type="text" id="gg" style="font-family: 'Quicksand', sans-serif;">
        <button id="submit">Submit</button>
        </div>
            <script>
            window.onload = () =>{
            document.getElementById("submit").onclick = () =>{
            const input = document.getElementById("gg").value
            if(input.toLowerCase() == "${captcha.text.toLowerCase()}") {
               window.location.href = "yoururl/session/" + "${id}"
              }else{

                alert("The Letters Doesn't match, try again")

              }
            }
          }
            </script>
        </center>
        <style>
        .card {
          background: white;
          padding: 60px;
          border-radius: 4px;
          box-shadow: 0 2px 3px #C8D0D8;
          display: inline-block;
          margin: 0 auto;
        }
        body {
          text-align: center;
          padding: 40px 0;
          background: #EBF0F5;
        }
        input[type=text] {
            width: 200px;
            height:50px;
            font-size: 30px;
            transition: ease-in-out, width .35s ease-in-out;
          }
          
          input[type=text]:focus {
            width: 300px;
            height:50px;
          }
        </style>
        `);
  }
}
