const axios = require('axios');
class Gist {
    constructor(token) {
        this.access_token = token;

    }
    createGist(file, content, description, visibility) {
        return new Promise((resolve, reject) => {
            axios.post('https://api.github.com/gists', {
                "description": description || file,
                "public": visibility || true,
                "files": {
                    [file]: {
                        "content": content
                    }
                }
            }, {
                headers: {
                    'Authorization': 'bearer ' + this.access_token
                }
            }).then(response => {
                resolve(response.data.html_url);
            }).catch(error => {
                reject(error);
            })
        })
    }
}
module.exports = Gist;