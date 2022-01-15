/*********************************************************************************
* WEB700 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or 
* distributed to other students.
* 
* Name: Sarthak Vashistha Student ID: ______________ Date: ________________
*
* Online (Heroku) Link: https://shrouded-garden-80402.herokuapp.com/
*
********************************************************************************/ 


var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
var app = express();

const nData = require("./modules/collegeData");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// handlebar configuration

app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        }        // ADD STUDENT LINK NOT APPEARING
        ,
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
        ,
        stuNumRedirect: function (stuNum, options) {
            let ahref = "";
            ahref += '<a href="/student/' + stuNum + '">' + options.fn(this) + '</a>';
            return ahref;
        }
        ,
        mailToStuEmail: function (stuEmail, options) {
            let ahref = "";
            ahref += '<a href="mailto:' + stuEmail + '">' + options.fn(this) + '</a>';
            return ahref;
        }
        ,
        stuCourseRedirect: function (courseId, options) {
            let ahref = "";
            ahref += '<a href="/students?course=' + courseId + '">' + options.fn(this) + '</a>';
            return ahref;
        }
        ,
        courseIDRedirect: function (courseId, options) {
            let ahref = "";
            ahref += '<a href="/course/' + courseId + '">' + options.fn(this) + '</a>';
            return ahref;
        }
    }
}));

app.set("view engine", ".hbs");

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.get("/students", (req, res) => {

    if (req.query.course) {
        nData.getStudentsByCourse(req.query.course).then(function (courseStudents) {
            res.render("students", {
                students: courseStudents
            });
        }).catch(function (err) {
            res.render("students", {
                message: "No results"
            });
        });
    }
    else {
        nData.getAllStudents().then(function (students) {
            if (students.length > 0) {
                res.render("students", { students: students });
            }
            else {
                res.render("students", { message: "No Results!" });
            }
        }).catch(function (err) {
            res.render("students", {
                message: "No results : " + err
            });
        });
    }

});


// app.get("/tas", (req, res) => {

//             nData.getTAs().then(function(arrTA){
//                 res.json(arrTA);
//             }).catch(function(err){
//                 res.json({message : err});
//             });

// });


app.get("/courses", (req, res) => {

    nData.getCourses().then(function (courses) {
        if (courses.length > 0) {
            res.render("courses", {
                courses: courses
            });
        }
        else {
            res.render("courses", {
                message: "No Results!"
            });
        }

    }).catch(function (err) {
        res.render("courses", {
            message: "No results : " + err
        });
    });
});

// app.get("/student/:studentNum", (req, res) => {

//     nData.getStudentByNum(req.params.studentNum).then(function (courseStudents) {
//         res.render("student", {
//             data: courseStudents
//         });
//     }).catch(function (err) {
//         res.render("student", {
//             message: "No results : " + err
//         });
//     });

// });


app.get("/student/:studentNum", (req, res) => {

    // initialize an empty object to store the values

    let viewData = {};

    nData.getStudentByNum(req.params.studentNum).then((studentData) => {
        if (studentData) {
            viewData.student = studentData; //store student data in the "viewData" object as "student"
        }
        else {
            viewData.student = null; // set student to null if none were returned
        }
    }).catch(() => {

        viewData.student = null; // set student to null if there was an error

    }).then(nData.getCourses)
        .then((courses) => {
            viewData.courses = courses;
            // store course data in the "viewData" object as "courses"
            // loop through viewData.courses and once we have found the courseId that matches
            // the student's "course" value, add a "selected" property to the matching
            // viewData.courses object

            for (let i = 0; i < viewData.courses.length; i++) {
                if (viewData.courses[i].courseId == viewData.student.course) {
                    viewData.courses[i].selected = true;
                }
            }
        }).catch(() => {

            viewData.courses = []; // set courses to empty if there was an error

        }).then(() => {
            if (viewData.student == null) { // if no student - return an error
                res.status(404).send("Student Not Found");
            }
            else {
                res.render("student", { viewData: viewData }); // render the "student" view
            }
        });
});


app.get("/course/:courseId", (req, res) => {

    nData.getCoursebyID(req.params.courseId).then(function (course) {
        res.render("course", {
            courses: course
        });
    }).catch(function (err) {
        res.render("course", {
            message: "No results : " + err
        });
    });
});


app.get("/course/delete/:courseId", (req, res) => {

    nData.deleteCourse(req.params.courseId).then(() => {
        res.redirect("/courses");
    }).catch(err => {
        res.status(500).send("Unable to delete course / Course not found. ")
    });
})

app.get("/student/delete/:studentNum", (req, res) => {

    nData.deleteStudent(req.params.studentNum).then((students) => {
        res.redirect("/students");
    }).catch(err => {
        res.status(500).send("Unable to delete student / Student not found. ")
    });
})


// setup a 'route' to listen on the default url path


app.get("/", (req, res) => {

    res.render("home");

});

app.get("/about", (req, res) => {

    res.render("about");

});

app.get("/htmlDemo", (req, res) => {

    res.render("htmlDemo");

});

app.get("/students/add", (req, res) => {

    nData.getCourses().then(allCourses => {
        res.render("addStudent", { courses: allCourses });
    }).catch(() => {
        res.render("addStudent", { courses: [] });
    });
});

app.post("/students/add", (req, res) => {

    nData.addStudent(req.body).then(() => {
        res.redirect("/students");
    });
});

app.post("/student/update", (req, res) => {

    nData.updateStudent(req.body).then(() => {
        res.redirect("/students");
    });

});


app.get("/courses/add", (req, res) => {

    res.render("addCourse");

});


app.post("/courses/add", (req, res) => {

    nData.addCourse(req.body).then(() => {
        res.redirect("/courses");
    });
});

app.post("/course/update", (req, res) => {

    nData.updateCourse(req.body).then(() => {
        res.redirect("/courses");
    });

});



app.use((req, res, next) => {
    res.status(404).send("404: Not Found");
});

// setup http server to listen on HTTP_PORT

nData.initialize().then(function (msg) {

    app.listen(HTTP_PORT, () => { console.log("server listening on port: " + HTTP_PORT) });

}).catch(function (err) {
    console.log("Unable to read college data. Error : " + err)
});
