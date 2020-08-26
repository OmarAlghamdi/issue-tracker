const express = require('express');

const init = (db) => {
    const issuesRouter = express.Router();

    issuesRouter.route('/')
        .all((req, res, next) => {
            res.setHeader('Content-Type', 'application/json');
            next();
        })
        .get((req, res, next) => {
            db.getIssues()
                .then(issues => res.json(issues))
                .catch(err => next(err));
        })
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
        .get((req, res, next) => {
            const { id } = req.params;
            db.getIssue(id)
                .then(issue => res.json(issue))
                .catch(err => next(err));
        })
        .put((req, res, next) => {
            const { id } = req.params;
            db.updateIssue(id, req.body)
                .then(issue => res.json(issue))
                .catch(err => next(err));
        });

    return issuesRouter
}

module.exports = init;