const mongoose = require('mongoose');
const chalk = require('chalk');

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

exports.connect = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION, mongooseOptions);
        console.log(chalk.green('Successfully connected to mongoDB'));
    } catch (error) {
        console.log(chalk.red(error));
    }
}