// BUILD YOUR SERVER HERE
const express = require('express')
const server = express()
const User = require('./users/model')

server.use(express.json())

server.post('api/users', async (req, res) => {
    const user = req.body
    if (!user.name || !user.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" })
    } else {
        try {
            const newUser = await User.create(user)
            res.status(201).json(newUser)
        } catch (err) {
            res.status(500).json({ message: "There was an error while saving the user to the database" })

        }
    }
})

server.get('api/users', (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({ message: "The users information could not be retrieved" })
        })
})

server.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    User.delete(id)
        .then((deleted) => {
            if (!deleted) {
                res
                    .status(404)
                    .json({ message: "The user with the specified ID does not exist." });
            } else {
                res.status(200).json(deleted);
            }
        })
        .catch((err) => {
            res.status(500).json({ errorMessage: `The user could not be removed --- ${err}` });
        });
});

server.put("/api/users/:id", async (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    if (!changes.name || !changes.bio || changes.adoopter_id === undefined) {
        res
            .status(400)
            .json({ errorMessage: "Please provide name and bio for the user." });
    } else {
        try {
            const updated = await User.update(id, changes);
            if (!updated) {
                res
                    .status(404)
                    .json({ message: "The user with the specified ID does not exist." });
            } else {
                res.status(200).json(updated);
            }
        } catch (error) {
            res
                .status(500)
                .json({ errorMessage: "The user information could not be modified." });
        }
    }
});

server.get("*", (req, res) => {
    res
        .status(404)
        .json({ message: "The page you are looking for could not be found." })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
