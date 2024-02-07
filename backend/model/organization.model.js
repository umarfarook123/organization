const mongoose = require("mongoose");
const dbPrefix = require('../config/config').dbPrefix;

const employee = new mongoose.Schema({

    userName: { type: String, required: true, lowercase: true, index: 1 },
    email: { type: String, required: true, lowercase: true, index: 1 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'admin'], index: 1, default: 'user' },
    employeeId: { type: String },
    dob: { type: Date, required: true },

}, { "versionKey": false }, { timestamps: true });

employee.pre('save', async function (next) {

    if (!this.employeeId) {

        const latestDocument = await this.constructor.findOne({}, { employeeId: 1 }, { sort: { _id: -1 } });
        const latestCustomId = latestDocument && latestDocument.employeeId ? latestDocument.employeeId : '00000'; // Initial value
        const numericPart = parseInt(latestCustomId.replace(/^SCI_/, ''));
        const newNumericPart = (numericPart + 1).toString().padStart(5, '0');
        this.employeeId = `SCI_${newNumericPart}`;
    }

    next();
});

module.exports = mongoose.model(dbPrefix + 'EMPLOYEE', employee, dbPrefix + 'EMPLOYEE');