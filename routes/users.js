// @ts-check

const express = require('express');
const Database = require('../persistence/mongo');
const { Router } = require('express');

/**
 * initializes the users router and injects the db reference 
 * @param {Database} db database reference
 * @returns {Router} users router
 */
const init = (db) => {
    const usersRouter = express.Router();

    usersRouter.route('/')
        .all((req, res, next) => {
            res.setHeader('Content-Type', 'application/json');
            next();
        })
        // get list of all users
        .get((req, res, next) => {
            db.getUsers()
                .then(users => res.json(users))
                .catch(err => next(err));
        })
        // add new user
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
        // get user's details
        .get((req, res, next) => {
            const { id } = req.params;
            db.getUser(id)
                .then(user => res.json(user))
                .catch(err => next(err));
        })
        // update user
        .put((req, res, next) => {
            const { id } = req.params;
            db.updateUser(id, req.body)
                .then(user => res.json(user))
                .catch(err => next(err));
        })
        // mark user 'inactive'. user data stays in the database to be able to get his/her old activity history 
        .delete((req, res, next) => {
            const { id } = req.params;
            db.deleteUser(id)
                .then(user => res.json(user))
                .catch(err => next(err));
        });

    return usersRouter;
}

module.exports = init;