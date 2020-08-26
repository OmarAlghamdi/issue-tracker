const mongoose = require('mongoose');

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
        
        const [ issueSchema ] = this.createSchemas();

        this.issue = mongoose.model('Issue', issueSchema);
    }

    createSchemas() {
        const issueSchema = new mongoose.Schema({
            title:      { type: String, required: true },
            desc:       { type: String },
            status:     { type: String, required: true, enum: ['open', 'closed'] },
            priority:   { type: String, enum: ['high', 'low'] },
            deadline:   { type: Date }
    
        }, { timestamps: true });

        return [ issueSchema ];
    }

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
}

module.exports = Database;