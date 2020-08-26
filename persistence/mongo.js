const mongoose = require('mongoose');
const utils = require('../utils');

class Database {
    
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
        
        const [ issueSchema, userSchema ] = this.createSchemas();

        this.issue = mongoose.model('Issue', issueSchema);
        this.user = mongoose.model('User', userSchema);
    }

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
        
        userSchema.virtual('name').get(() => {
            return this.firstName + ' ' + this.lastName;
        });

        return [ issueSchema, userSchema ];
    }

    // issue queries
    getIssues() {
        return this.issue.find({}, '_id title status').exec();
    }

    getIssue(id) {
        return this.issue.findById(id).exec();
    }

    postIssue({ issue }) {
        const { title, desc, priority, deadline } = issue;
        return this.issue.create({ title, desc, status: 'open', priority, deadline });
    }

    updateIssue(id, { issue }) {
        const { title, desc, status, priority, deadline } = issue;
        return this.issue.findById(id).exec()
            .then(doc => {
                doc.title = title? title : doc.title;
                doc.desc = desc? desc : doc.desc;
                doc.status = status? status : doc.status;
                doc.priority = priority? priority : doc.priority;
                doc.deadline = deadline? deadline : doc.deadline;
                
                return doc.save();
            })
            .then(() => this.issue.findById(id).exec())
            .catch(err => console.error(err));
    }

    // user queries
    getUsers() {
        return this.user.find({}, '_id name role').exec();
    }

    getUser(id) {
        return this.user.findById(id).exec();
    }

    addUser({ user }) {
        const { role, firstName, lastName, email } = user;
        this.user.create({ role, firstName, lastName, email, status: 'active' });
    }

    updateUser(id, { user }) {
        const { role, firstName, lastName, email, status } = user;
        this.user.findById(id).exec()
            .then(doc => {
                doc.role = role? role : doc.role;
                doc.firstName = firstName? firstName : doc.firstName;
                doc.lastName = lastName? lastName : doc.lastName;
                doc.email = email? email : doc.email;

                return doc.save();
            })
            .then(() => this.user.findById(id).exec())
            .catch(err => console.error(err));
    }

    deleteUser(id) {
        return this.user.findByIdAndUpdate(id, { status: 'inactive' }).exec()
            .then(() => this.user.findById(id).exec());
    }
}

module.exports = Database;