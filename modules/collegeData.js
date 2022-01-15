
const Sequelize = require('sequelize');
var connection = new Sequelize('dtatoh4do0q17', 'fsmnrybluibaqj', '43cd9915c6b0c6c30a770d5b1b0d89dbf983690fb47c430180dbcde5f426829e', {
    host: 'ec2-3-232-22-121.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});


var Student = connection.define("Student", {

    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING

});


var Course = connection.define("Course", {

    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
})


Course.hasMany(Student, { foreignKey: 'course' });


module.exports.initialize = function () {

    return new Promise((resolve, reject) => {

        connection.sync().then(() => {
            resolve("DB connection successful");
        }).catch(err => {
            reject("Unable to sync the database : " + err);
        });


    });
}


module.exports.getAllStudents = function () {

    return new Promise((resolve, reject) => {

        Student.findAll().then(allStudents => {
            resolve(allStudents);
        }).catch(err => {
            reject("No results returned : " + err);
        });
    });
}


module.exports.getCourses = function () {

    return new Promise((resolve, reject) => {

        Course.findAll().then(allCourses => {
            resolve(allCourses);
        }).catch(err => {
            reject("No results returned : " + err);
        });
    });
}

module.exports.getTAs = function () {

    return new Promise(function (resolve, reject) {

        Student.findAll({
            where: {
                TA: 'true'
            }
        }).then(TAs => {
            resolve(TAs);
        }).catch(err => {
            reject("No results returned : " + err)
        });

    });
}


module.exports.getStudentsByCourse = function (course) {

    return new Promise(function (resolve, reject) {

        Student.findAll({
            where: {
                course: course
            }
        }).then(studentsByCourse => {
            resolve(studentsByCourse);
        }).catch(err => {
            reject("No results returned : " + err)
        });
    });
}


module.exports.getStudentByNum = function (num) {

    return new Promise(function (resolve, reject) {

        Student.findAll({
            where: {
                studentNum: num
            }
        }).then(studentByNum => {
            resolve(studentByNum[0]);
        }).catch(err => {
            reject("No results returned : " + err)
        });
    });
}


module.exports.getCoursebyID = function (courseID) {

    return new Promise(function (resolve, reject) {

        Course.findAll({
            where: {
                courseId: courseID
            }
        }).then(courseById => {
            resolve(courseById[0]);
        }).catch(err => {
            reject("No results returned : " + err)
        });
    });
}



module.exports.addStudent = function (studentData) {
    studentData.TA = (studentData.TA) ? true : false;

    for (let i in studentData) {
        if (studentData[i] == "") {
            studentData[i] = null;
        }
    }

    return new Promise(function (resolve, reject) {

        Student.create(studentData).then(newStudent => {
            resolve("New Student Added : " + newStudent);
        }).catch(err => {
            reject("Unable to add new student : " + err);
        });
    });
}

module.exports.updateStudent = function (studentData) {
    studentData.TA = (studentData.TA) ? true : false;

    for (let i in studentData) {
        if (studentData[i] == "") {
            studentData[i] = null;
        }
    }

    return new Promise(function (resolve, reject) {

        Student.update(studentData, {
            where: {
                studentNum: studentData.studentNum
            }
        }).then(updatedStudent => {
            resolve("Student Details updated successfully : " + updatedStudent);
        }).catch(err => {
            reject("Unable to update student details : " + err)
                ;
        })
    });

}

module.exports.addCourse = function (courseData) {

    for (let i in courseData) {
        if (courseData[i] == "") {
            courseData[i] = null;
        }
    }

    return new Promise(function (resolve, reject) {

        Course.create(courseData).then(newCourse => {
            resolve("New Course Added : " + newCourse);
        }).catch(err => {
            reject("Unable to add new course : " + err);
        });
    });
}


module.exports.updateCourse = function (courseData) {

    for (let i in courseData) {
        if (courseData[i] == "") {
            courseData[i] = null;
        }
    }

    return new Promise(function (resolve, reject) {

        Course.update(courseData, {
            where: {
                courseId: courseData.courseId
            }
        }).then(updatedCourse => {
            resolve("Course Details updated successfully : " + updatedCourse);
        }).catch(err => {
            reject("Unable to update course details : " + err)
                ;
        })
    });
}

module.exports.deleteCourse = function (courseId) {

    return new Promise((resolve, reject) => {

        Course.destroy({
            where: {
                courseId: courseId
            }
        }).then(() => {
            resolve("Course is successfully deleted.")
        }).catch(err => {
            reject("Unable to delete course : " + err);
        });
    })
}

module.exports.deleteStudent = function (studentNum) {

    return new Promise((resolve, reject) => {

        Student.destroy({
            where: {
                studentNum: studentNum
            }
        }).then(() => {
            resolve("Student is successfully deleted.")
        }).catch(err => {
            reject("Unable to delete student : " + err);
        });
    })
}

