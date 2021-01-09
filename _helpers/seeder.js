const Status = require('../components/status/statusModel')
const User = require('../components/users/usersModel')
const request = require('request');

exports.seedStatus = async () => {
    let data = await Status.find()
    if (data.length < 1) {
        Status.create([{ status: 'publish' }, { status: 'unpublish' }])
    }
}

exports.seedAuth = async () => {
    let data = await User.find()
    if (data.length < 1) {
        const formData = [
            {
                username: "admin",
                email: "admin@mail.com",
                password: "admin",
            }, {
                username: "author",
                email: "author@mail.com",
                password: "author",
            }
        ]
        formData.forEach(form => {
            let options1 = {
                url: 'http://0.0.0.0/api/v1/auth/register',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: form
            }
            request.post(options1, (err, res, body) => {
                if (err) {
                    console.log('ini error message nya' + err)
                } else {
                    console.log(res.body)
                }
            })
        })
    }
}