const axios = require('axios');
const express = require('express');
const config = require('./config');
const term = require('terminal-kit').terminal;
const GistClient = require('./gist');
const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let app = express();
let description, visibility;

axios.defaults.headers.common['Accept'] = 'application/json';

app.get('/login', (req, res) => {
    let code = req.query.code;
    if (!code) {
        res.redirect(`https://github.com/login/oauth/authorize?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&scope=gist`)
        return res.end();
    }
    axios.post('https://github.com/login/oauth/access_token?client_id=' + config.client_id + '&client_secret=' + config.client_secret + '&code=' + code + '&redirect_uri=' + config.redirect_uri)
        .then(response => {
            if (!response) return;
            if (response.data && response.data.error) {
                res.redirect(`https://github.com/login/oauth/authorize?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&scope=gist`)
                return res.end();
            }
            let access_token = response.data.access_token;
            let gist = new GistClient(access_token);
            res.send("You can now close this window");
            let files =  fs.readdirSync( process.cwd() )
            term.gridMenu(files, function(_error, response) {
                //readline.question("Description:\n", (description) => {
                    //console.log(description);
                    //  readline.close()
                //})
                //term.cyan('Do you want it public? [Y/n]: ');
                //term.yesOrNo( { yes: [ 'y' , 'ENTER' ] , no: [ 'n' ], default: 'y' } , function( _error , result ) {
                    // visibility = result
                        //process.exit()
                    //})
            gist.createGist(files[response.selectedIndex], fs.readFileSync(files[response.selectedIndex], 'utf8'), description, visibility).then(link => console.log(`Gist created: ${link}\n`)).catch(error => console.log(error));   
        }) ;
    }).catch(error => {
        console.log(error)
    })
})

app.listen(3000, () => {
    console.log("Click the link below to get started");
    console.log("Link: " +config.redirect_uri);
})