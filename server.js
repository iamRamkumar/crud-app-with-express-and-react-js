const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors())

const userList = require('./userList.json');
const userAuth = require('./userAuth.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/auth/login', (req, res) => {
    const { body } = req;
    const { username, password } = body;
    const userObj = userAuth.find(user => user.email === username && password === user.password);
    console.log(userObj);
    if (userObj) {
        res.send({
            userDetail: userObj,
            isSuccess: true,
        });
    } else {
        res.send({
            userDetail: null,
            isSuccess: false,
        });
    }
});

app.post('/api/user/get-user-list', (req, res) => {
    if (userList) {
        res.send({
            userList,
            isSuccess: true,
        });
    } else {
        res.send({
            userList: null,
            isSuccess: false,
        });
    }
});

app.post('/api/contact/remove', (req, res) => {
    const { id } = req.body;
    if (id) {
        const userObj = userList.filter(user => user._id !== id);
        res.send({
            userList: userObj,
            isSuccess: true,
        });
    } else {
        res.send({
            userList: null,
            isSuccess: false,
        });
    }
});

app.post('/api/contact/copy', (req, res) => {
    const { id, name } = req.body;
    if (id && name) {
        const newuserList = JSON.parse(JSON.stringify(userList));
        const userObj = userList.find(user => user._id === id);
        const newUserObj = JSON.parse(JSON.stringify(userObj));

        newUserObj['_id']= newUserObj._id + '1';
        newUserObj['name']= name;
        newUserObj['registered']= new Date();

        newuserList.push(newUserObj);
        res.send({
            userList: newuserList,
            isSuccess: true,
        });
    } else {
        res.send({
            userList: null,
            isSuccess: false,
        });
    }
});

app.post('/api/contact/rename', (req, res) => {
    const { id, name } = req.body;
    if (id && name) {
        const userObj = userList.find(user => user._id === id);
        userObj['name']= name;
        console.log(userList, userObj);
        res.send({
            userList,
            isSuccess: true,
        });
    } else {
        res.send({
            userList: null,
            isSuccess: false,
        });
    }
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));