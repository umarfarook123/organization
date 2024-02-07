const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendResponse = require("../helpers/send_response");
const fs = require('fs');
const path = require('path');
const common = require("../helpers/common");
const {
    create,
    find,
    findOne,
    updateOne,
    deleteOne, aggregation,
    countDocuments, insertmany
} = require("../helpers/query_helper");
const async = require('async');

const config = require('../config/config')


exports.signUp = async (req, res) => {

    const { userName, email, firstName, lastName, password, dob, role } = req.body;

    let insertData = {}

    try {

        let validator = await common.validateField(['userName', 'email', 'firstName', 'lastName', 'password', 'dob'], req.body);
        if (!validator.status) return sendResponse(res, 472, '', validator.message, '', validator.errors);


        let { data: userData } = await findOne('employee', { email });

        if (!userData) {

            insertData['userName'] = userName;
            insertData['email'] = email;
            insertData['role'] = role;
            insertData['firstName'] = firstName;
            insertData['lastName'] = lastName;
            insertData['dob'] = dob;
            insertData['password'] = await bcrypt.hash(password, 12);

            let userNameData = await common.UserNameCheck(req.body, 'employee');
            if (!userNameData) return sendResponse(res, false, '', "Username already taken!");

            let { status, data: empDataCreate } = await create('employee', insertData);
            if (!status) return sendResponse(res, false, '', "Something wrong!");

            return sendResponse(res, true, '', "Signup Succesfully!")
        }
        else {
            return sendResponse(res, false, '', "Email already exists!")
        }

    }
    catch (err) {

        return sendResponse(res, false, '', 'Error Occured' + err.message)
    }

}

exports.login = async (req, res) => {

    const { findField, password } = req.body;

    try {

        let validator = await common.validateField(['findField', 'password'], req.body);
        if (!validator.status) return sendResponse(res, 472, '', validator.message, '', validator.errors);

        let { ipAddress, location, browser_name, os } = await common.getIPAddressLocation(req);

        let { data: userData } = await findOne('employee', { $and: [{ $or: [{ email: findField }, { userName: findField }] }] }, { email: 1, password: 1, role: 1 });


        if (!userData) return sendResponse(res, false, '', 'Invalid email or employee Id');

        let passCheck = await bcrypt.compare(password, userData.password);

        if (!passCheck) return sendResponse(res, false, '', 'Invalid password!');

        const accessToken = await jwt.sign({ userId: String(userData._id) }, config.jwtSecret, { expiresIn: '1h' });

        let logHistory = { userId: userData._id, ipAddress, location, browser_name, os, role: userData.role }


        let { status, data: logHistoryData } = await create('EMPLOYEE_LOG_HSTRY', logHistory);

        return sendResponse(res, true, accessToken, 'Login Successfully!')

    }
    catch (err) {

        return sendResponse(res, 501, '', 'Error Occured' + err.message)
    }

}

exports.organizationData = async (req, res) => {

    let api = req.originalUrl;
    let { count, _id } = req.body;

    try {

        if (api == '/organization/add-fake-data') {

            let validator = await common.validateField(['count'], req.body);
            if (!validator.status) return sendResponse(res, 472, '', validator.message, '', validator.errors);

            const fakeUsers = await Array.from({ length: count }, common.generateFakeData);

            let addFakeData = await insertmany('employee', fakeUsers);
            if (!addFakeData.status) return sendResponse(res, false, "", addFakeData.message);

            return sendResponse(res, true, '', "Fake Data added successfully");

        }
        else if (api == '/organization/user-data-list') {

            let options = common.pagination(req.body);

            let findQuery = { role: { $ne: 'admin' } }

            async.parallel({
                getData: async function () {
                    let { data } = await find('employee', findQuery, { userName: 1, email: 1, dob: 1, employeeId: 1, createdAt: 1 }, options); if (!data) return

                    return data
                },
                getCount: async function () {
                    let count = await countDocuments('employee', findQuery);
                    return count

                },
            }, function (err, results) {

                if (results.getData) return sendResponse(res, true, results.getData, "", results.getCount)
            });


        }

        else if (api == '/organization/get-single-data') {

            let validator = await common.validateField(['_id'], req.body);
            if (!validator.status) return sendResponse(res, 472, '', validator.message, '', validator.errors);

            let { data: userData } = await findOne('employee', { _id }, { password: 0 });
            return sendResponse(res, true, userData);

        }



    } catch (err) {

        return sendResponse(res, false, "", err.message);

    }

}

exports.myProfile = async (req, res) => {

    let { id: _id } = req.user;

    try {
        let validator = await common.validateField(['id'], req.user);
        if (!validator.status) return sendResponse(res, 472, '', validator.message, '', validator.errors);

        const pipeline = [
            {
                $match: { _id }
            },

            {
                $lookup: {
                    from: "SCIEMPLOYEE_LOG_HSTRY",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$$userId", "$userId"] }
                            }
                        },

                        {
                            $sort: { _id: -1 }
                        },
                        {
                            $limit: 5
                        },
                    ],
                    as: "logHistory",


                },
            },
            {
                $project: {

                    password: 0
                }
            }

        ];

        let data = await aggregation('employee', pipeline); if (!data) return;

        return sendResponse(res, true, data);

    } catch (err) {
        return sendResponse(res, false, "", err.message);

    }
}

exports.seedAdmin = async (req, res) => {


    let insertData = {}

    try {

        let { data: adminData } = await findOne('employee', { role: 'admin' });

        if (adminData) return sendResponse(res, false, '', "Admin already exist");


        const file = path.join(__dirname, '../helpers/admindata.json');
        let seedData = await fs.readFileSync('./helpers/admindata.json', 'utf8');
        seedData = JSON.parse(seedData);
        const { userName, email, firstName, lastName, password, dob, role } = seedData;

        let validator = await common.validateField(['userName', 'email', 'firstName', 'lastName', 'password', 'dob'], seedData);
        if (!validator.status) return sendResponse(res, 472, '', validator.message, '', validator.errors);




        insertData['userName'] = userName;
        insertData['email'] = email;
        insertData['role'] = role;
        insertData['firstName'] = firstName;
        insertData['lastName'] = lastName;
        insertData['dob'] = dob;
        insertData['password'] = await bcrypt.hash(password, 12);

        let { status, data: empDataCreate } = await create('employee', insertData);
        if (!status) return sendResponse(res, false, '', "Something wrong!");

        return sendResponse(res, true, '', "Admin data Seeded Succesfully!")


    }
    catch (err) {
        ('err: ', err);

        return sendResponse(res, 501, '', 'Error Occured' + err.message)
    }

}