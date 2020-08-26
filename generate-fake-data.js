const faker = require('faker');
const fs = require('fs').promises;

const generateUsers = (x) => {
    const roles = ['developer', 'support', 'project manager'];
    const users = [];

    for (let i = 0; i < x; i++) {
        let user = {};
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.role = roles[Math.floor(Math.random() * 3)];
        user.email = faker.internet.email();

        users.push(user);
    }

    fs.writeFile('./fake-data/users.json', JSON.stringify(users))
        .then(() => console.log('generated fake users'))
        .catch(err => console.error(err));
}

const generateIssues = (x) => {
    const statuses = ['open', 'closed', 'in progress', 'testing'];
    const priorities = ['high', 'medium', 'low'];
    const issues = [];

    for (let i = 0; i < x; i++) {
        let issue = {};
        issue.title = faker.lorem.sentence(5);
        issue.desc = faker.lorem.sentences(5);
        issue.status = statuses[Math.floor(Math.random() * 4)];
        issue.priority = priorities[Math.floor(Math.random() * 3)];
        issue.deadline = faker.date.future();

        issues.push(issue);
    }

    fs.writeFile('./fake-data/issues.json', JSON.stringify(issues))
        .then(() => console.log('generated fake issues'))
        .catch(err => console.error(err));
}

const generateComments = (x) => {
    const comments = [];

    for (let i = 0; i < x; i++) {
        let comment = {};
        comment.content = faker.lorem.sentences(3);

        comments.push(comment);
    }

    fs.writeFile('./fake-data/comments.json', JSON.stringify(comments))
        .then(() => console.log('generated fake comments'))
        .catch(err => console.error(err));
}

fs.mkdir('./fake-data')
    .then(() => {
        generateUsers(10);
        generateIssues(10)
        generateComments(10);
    })
    .catch(err => console.error(err));