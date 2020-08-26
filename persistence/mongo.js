// @ts-check

const mongoose = require('mongoose');
const utils = require('../utils');

class Database {
    
    /**
     * 
     * @param {string} url MongoDB connection URL
     * @param {string} port MongoDB port number
     * @param {string} dbName database name
     */
    constructor(url, port, dbName){
        mongoose.connect(`${url}:${port}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(db => {
                console.log(`connected to mongodb at ${url}:${port}/${dbName}`);
                this.db = db;
            })
            .catch(err => {
                console.error(`failed to connect to mongodb at ${url}:${port}/${dbName}`);
                console.error(err);
            });
        
        // create mongoose models
        const [ issueSchema, userSchema ] = this.createSchemas();

        this.issue = mongoose.model('Issue', issueSchema);
        this.user = mongoose.model('User', userSchema);
    }

    /**
     * creates mongoose schemas
     * @returns {Array.<mongoose.Schema>} array of schemas
     */
    createSchemas() {
        const commentSchema = new mongoose.Schema({
            content:    { type: String, required: true },
            writer:     { type: String, required: true }
        }, { timestamps: true });

        const issueSchema = new mongoose.Schema({
            title:      { type: String, required: true },
            desc:       { type: String },
            status:     { type: String, required: true, enum: ['open', 'closed', 'in progress', 'testing'] },
            priority:   { type: String, enum: ['high', 'medium', 'low'] },
            deadline:   { type: Date },
            comments: [commentSchema]
    
        }, { timestamps: true });

        const userSchema = new mongoose.Schema({
            role:       { type: String, required: true, enum: ['admin', 'project manager', 'developer', 'support'] },
            firstName:  { type: String, required: true },
            lastName:   { type: String, required: true },
            email:      { type: String, required: true, validate: utils.validateEmail },
            status:     { type: String, required: true, enum: ['active', 'inactive'] } 
        }, { timestamps: true });
        
        // creates virtual properties (not stored in the DB)
        userSchema.virtual('name').get(() => {
            // @ts-ignore
            return this.firstName + ' ' + this.lastName;
        });

        return [ issueSchema, userSchema ];
    }

    // issue queries

    /**
     * get list of all issues. not full details only _id, title and status.
     * @returns {Promise}
     */
    getIssues() {
        return this.issue.find({}, '_id title status').exec();
    }

    /**
     * get details of and issue
     * @param {string} id issue _id
     * @returns {Promise}
     */
    getIssue(id) {
        return this.issue.findById(id).exec();
    }

    /**
     * creates a new issue. default status is open
     * @param {*} param0 request body
     *  @returns {Promise}
     */
    postIssue({ issue }) {
        const { title, desc, priority, deadline } = issue;
        return this.issue.create({ title, desc, status: 'open', priority, deadline });
    }

    /**
     * updates an issue
     * @param {string} id issue _id
     * @param {*} param1 request body
     * @returns {Promise}
     */
    updateIssue(id, { issue }) {
        const { title, desc, status, priority, deadline } = issue;
        return this.issue.findById(id).exec()
            .then(doc => {
                // @ts-ignore
                doc.title = title? title : doc.title;
                // @ts-ignore
                doc.desc = desc? desc : doc.desc;
                // @ts-ignore
                doc.status = status? status : doc.status;
                // @ts-ignore
                doc.priority = priority? priority : doc.priority;
                // @ts-ignore
                doc.deadline = deadline? deadline : doc.deadline;
                
                return doc.save();
            })
            .then(() => this.issue.findById(id).exec())
            .catch(err => console.error(err));
    }

    // user queries

    /**
     * get list of all users. not full details only _id, name and role.
     * @returns {Promise}
     */
    getUsers() {
        return this.user.find({}, '_id name role').exec();
    }

    /**
     * get details of an user
     * @param {string} id user _id
     * @returns {Promise}
     */
    getUser(id) {
        return this.user.findById(id).exec();
    }

    /**
     * creates a new user. default status is 'active'
     * @param {*} param0 request body
     * @returns {Promise}
     */
    addUser({ user }) {
        const { role, firstName, lastName, email } = user;
        return this.user.create({ role, firstName, lastName, email, status: 'active' });
    }

    /**
     * updates user
     * @param {string} id user _id
     * @param {*} param1 request body
     * @returns {Promise}
     */
    updateUser(id, { user }) {
        const { role, firstName, lastName, email, status } = user;
        return this.user.findById(id).exec()
            .then(doc => {
                // @ts-ignore
                doc.role = role? role : doc.role;
                // @ts-ignore
                doc.firstName = firstName? firstName : doc.firstName;
                // @ts-ignore
                doc.lastName = lastName? lastName : doc.lastName;
                // @ts-ignore
                doc.email = email? email : doc.email;

                return doc.save();
            })
            .then(() => this.user.findById(id).exec())
            .catch(err => console.error(err));
    }

    /**
     * changes user's status to 'inactive'
     * @param {string} id user _id
     */
    deleteUser(id) {
        return this.user.findByIdAndUpdate(id, { status: 'inactive' }).exec()
            .then(() => this.user.findById(id).exec());
    }
}

module.exports = Database;