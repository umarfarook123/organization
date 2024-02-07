# organization

cmd :

cd backend
npm i
run cmd: pm2 start 

Intial Seed for admin :
    
API :

curl --location --request GET 'localhost:1233/organization/admin-seed' \
--header 'Content-Type: application/json' 

sample response:
{
    "status": true,
    "message": "Admin data Seeded Succesfully!"
}

user signup

   curl --location 'localhost:1233/organization/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"umarfarook@gmail.com",
    "userName":"umarfarook",
    "password":"Osiz@123",
    "firstName":"Umar",
    "lastName":"farook",
    "dob":"1999-10-19"
}'

//username & email must be unique

response:

{
    "status": true,
    "message": "Signup Succesfully!"
}


user & admin login


curl --location 'localhost:1233/organization/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "findField":"umarfarook@gmail.com",  
    "password":"Osiz@123"
}'

user & admin can login with username or either mail to login to get token

{
    "status": true,
    "message": "Login Successfully!",
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMzYzQ5MjE2YzIwY2JiMjM2MjQ4ZGYiLCJpYXQiOjE3MDczMjg4NjcsImV4cCI6MTcwNzMzMjQ2N30.W_N0fabRfzsv-LnkHkaoRZ6EhAblFPCpuERLTah4Bdk"
}


My profile -- user & admin both can view profile with responsive token

curl --location --request POST 'localhost:1233/organization/my-profile' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMzYzQ5MjE2YzIwY2JiMjM2MjQ4ZGYiLCJpYXQiOjE3MDczMjg4NjcsImV4cCI6MTcwNzMzMjQ2N30.W_N0fabRfzsv-LnkHkaoRZ6EhAblFPCpuERLTah4Bdk' \

 user response :

 

{
    "status": true,
    "message": "Success",
    "data": [
        {
            "_id": "65c3c49216c20cbb236248df",
            "userName": "umarfarook",
            "email": "umarfarook@gmail.com",
            "firstName": "Umar",
            "lastName": "farook",
            "role": "user",
            "dob": "1999-10-19T00:00:00.000Z",
            "employeeId": "SCI_00003",
            "logHistory": [
                {
                    "_id": "65c3c56316c20cbb236248eb",
                    "userId": "65c3c49216c20cbb236248df",
                    "ipAddress": "1",
                    "location": null,
                    "browser_name": "PostmanRuntime",
                    "os": "unknown"
                },
                {
                    "_id": "65c3c52b16c20cbb236248e8",
                    "userId": "65c3c49216c20cbb236248df",
                    "ipAddress": "1",
                    "location": null,
                    "browser_name": "PostmanRuntime",
                    "os": "unknown"
                }
            ]
        }
    ]
}

admin token response :
 
{
    "status": true,
    "message": "Success",
    "data": [
        {
            "_id": "65c3bd2717c94ccef73cca55",
            "userName": "admin",
            "email": "admin@gmail.com",
            "firstName": "admin",
            "lastName": "main",
            "role": "admin",
            "dob": "1999-10-19T00:00:00.000Z",
            "employeeId": "SCI_00002",
            "logHistory": [
                {
                    "_id": "65c3c6b9f4e1b51124dce475",
                    "userId": "65c3bd2717c94ccef73cca55",
                    "ipAddress": "1",
                    "location": null,
                    "browser_name": "PostmanRuntime",
                    "os": "unknown"
                }
            ]
        }
    ]
}



Admin add Fake data:

curl --location 'localhost:1233/organization/add-fake-data' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMzYmQyNzE3Yzk0Y2NlZjczY2NhNTUiLCJpYXQiOjE3MDczMjkyMDksImV4cCI6MTcwNzMzMjgwOX0.3zknjLVnEDhhWUYbXWIKUBZkyqjHaO1GW8p0rCZ3Q2Q' \
--header 'Content-Type: application/json' \
--data '{
    "count":5
}'

response for admin login token:

{
    "status": true,
    "message": "Fake Data added successfully"
}
sample response for user login token:

{
    "status": false,
    "message": "you are not allowed"
}


view user data list -- only admin can view this

curl --location 'localhost:1233/organization/user-data-list' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMzYmQyNzE3Yzk0Y2NlZjczY2NhNTUiLCJpYXQiOjE3MDczMjkyMDksImV4cCI6MTcwNzMzMjgwOX0.3zknjLVnEDhhWUYbXWIKUBZkyqjHaO1GW8p0rCZ3Q2Q' \
--header 'Content-Type: application/json' \
--data '{
    "page":0,
    "size":3
}'

sample response

{
    "status": true,
    "message": "Success",
    "data": [
        {
            "_id": "65c3c72ff4e1b51124dce480",
            "userName": "edward99",
            "email": "vicky_kovacek@gmail.com",
            "dob": "2023-07-19T01:04:27.025Z"
        },
        {
            "_id": "65c3c72af4e1b51124dce47d",
            "userName": "wendy_rogahn",
            "email": "dandre.boyle@gmail.com",
            "dob": "2023-04-25T15:33:02.488Z"
        },
        {
            "_id": "65c3c4a716c20cbb236248e4",
            "userName": "umarfaook1",
            "email": "umarfarook@gm11ail.com",
            "dob": "1999-10-19T00:00:00.000Z",
            "employeeId": "SCI_00004"
        }
    ],
    "count": 5
}


user get single data - only admin can view this

curl --location 'localhost:1233/organization/get-single-data' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMzYmQyNzE3Yzk0Y2NlZjczY2NhNTUiLCJpYXQiOjE3MDczMjkyMDksImV4cCI6MTcwNzMzMjgwOX0.3zknjLVnEDhhWUYbXWIKUBZkyqjHaO1GW8p0rCZ3Q2Q' \
--header 'Content-Type: application/json' \
--data '{
    "_id":"65c3c4a716c20cbb236248e4"
}'

{
    "status": true,
    "message": "Success",
    "data": {
        "_id": "65c3c4a716c20cbb236248e4",
        "userName": "umarfaook1",
        "email": "umarfarook@gm11ail.com",
        "firstName": "Umar",
        "lastName": "farook",
        "role": "user",
        "dob": "1999-10-19T00:00:00.000Z",
        "employeeId": "SCI_00004"
    }
}













