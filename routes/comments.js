// @ts-check

const express = require('express');
const Database = require('../persistence/mongo');
const { Router } = require('express');

/**
 * initializes the comments router and injects the db reference
 * @param {Database} db database reference
 * @returns {Router} comments router
 */
const init = (db) => {
    const commentsRouter = express.Router();

    commentsRouter.route('/:id')
    .all((req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    // get all comments or get a specific comment by id from query
    .get((req, res, next) => {
        const { id } = req.params;
        const { comment } = req.query;
        if (comment) {
            // @ts-ignore
            db.getComment(comment)
                .then(comm => {
                    res.json(comm);
                })
                .catch(err => next(err));
        } else {
            db.getComments(id)
            .then(comments => res.json(comments))
            .catch(err => next(err));
        }
    })
    // add comment to issue
    .post((req, res, next) => {
        const { id } = req.params;
        db.addComment(id, req.body)
            .then(comment => res.json(comment))
            .catch(err => next(err));
    });

    return commentsRouter;
}

module.exports = init