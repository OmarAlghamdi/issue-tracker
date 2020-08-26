const express = require('express');

const init = (db) => {
    const usersRouter = express.Router();

    usersRouter.route('/')
        .all((req, res, next) => {
            res.setHeader('Content-Type', 'application/json');
            next();
        })
        .get((req, res, next) => {
            db.getUsers()
                .then(users => res.json(users))
                .catch(err => next(err));
        })
        .post((req, res, next) => {
            db.addUser(req.body)
                .then(user => res.json(user))
                .catch(err => next(err));
        });

    usersRouter.route('/:id')
        .all((req, res, next) => {
            res.setHeader('Content-Type', 'application/json');
            next();
        })
        .get((req, res, next) => {
            const { id } = req.params;
            db.getUser(id)
                .then(user => res.json(user))
                .catch(err => next(err));
        })
        .put((req, res, next) => {
            const { id } = req.params;
            db.updateUser(id, req.body)
                .then(user => res.json(user))
                .catch(err => next(err));
        })
        .delete((req, res, next) => {
            const { id } = req.params;
            db.deleteUser(id)
                .then(user => res.json(user))
                .catch(err => next(err));
        });

    return usersRouter;
}

module.exports = init;