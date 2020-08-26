// @ts-check

const express = require('express');
const Database = require('../persistence/mongo');
const { Router } = require('express');

/**
 * initializes the issues router and injects the db reference 
 * @param {Database} db database reference
 * @returns {Router} issues router
 */
const init = (db) => {
    const issuesRouter = express.Router();

    issuesRouter.route('/')
        .all((req, res, next) => {
            res.setHeader('Content-Type', 'application/json');
            next();
        })
        // get list of all issues
        .get((req, res, next) => {
            db.getIssues()
                .then(issues => res.json(issues))
                .catch(err => next(err));
        })
        // submit a new issue
        .post((req, res, next) => {
            db.postIssue(req.body)
                .then(issue => res.json(issue))
                .catch(err => next(err));
        });

    issuesRouter.route('/:id')
        .all((req, res, next) => {
            res.setHeader('Content-Type', 'application/json');
            next();
        })
        // get issue's details
        .get((req, res, next) => {
            const { id } = req.params;
            db.getIssue(id)
                .then(issue => res.json(issue))
                .catch(err => next(err));
        })
        // update an issue
        .put((req, res, next) => {
            const { id } = req.params;
            db.updateIssue(id, req.body)
                .then(issue => res.json(issue))
                .catch(err => next(err));
        });

    return issuesRouter;
}

module.exports = init;