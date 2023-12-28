/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the cs142 collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const async = require("async");

const express = require("express");
const app = express();

// Load the Mongoose schema for User, Photo, and SchemaInfo
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const requireAuth = require("./middleware/auth.middleware.js");
const upload = require("./middleware/multer.middleware.js");
const saltRound = 12;

// XXX - Your submission should work without this line. Comment out or delete
// this line for tests and before submission!
const cs142models = require("./modelData/photoApp.js").cs142models;
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/cs142project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

app.use(express.static("public"));
app.use(
  "/images",
  express.static(__dirname + "public/images", {
    maxAge: 5000,
    etag: false,
  })
);

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(bodyParser.json());

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 *
 * If implement the get as follows:
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get("/test/:p1", function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params
  // objects.
  console.log("/test called with param1 = ", request.params.p1);

  const param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will
    // match it.
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        // Query returned an error. We pass it back to the browser with an
        // Internal Service Error (500) error code.
        console.error("Error in /user/info:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object -
        // This is also an internal error return.
        response.status(500).send("Missing SchemaInfo");
        return;
      }

      // We got the object - return it in JSON format.
      console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    // In order to return the counts of all the collections we need to do an
    // async call to each collections. That is tricky to do so we use the async
    // package do the work. We put the collections into array and use async.each
    // to do each .count() query.
    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          const obj = {};
          for (let i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      }
    );
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400)
    // status.
    response.status(400).send("Bad param " + param);
  }
});

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", requireAuth, async function (request, response) {
  // response.status(200).send(cs142models.userListModel());

  const userData = await User.find();
  if (!userData)
    return response.status(400).json({
      status: 400,
      message: "not found",
    });
  response.status(200).send(userData);
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", async function (request, response) {
  const id = request.params.id;
  if (id.length != 24) {
    return response.status(400).json({
      status: 400,
      message: "ID is not valid",
    });
  }
  const userData = await User.findById(id);

  if (!userData)
    return response.status(400).json({
      status: 400,
      message: "not found",
    });
  response.status(200).send(userData);
});

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get("/photosOfUser/:id", async function (request, response) {
  var id = request.params.id;
  Photo.find({ user_id: id }, function (err, photosModel) {
    if (err) {
      console.error("Doing /photosOfUser/:id error: ", err);
      response.status(400).send(JSON.stringify(err));
      return;
    }
    if (photosModel === null || photosModel === undefined) {
      console.log("Photos with _id:" + id + " not found.");
      response.status(400).send("Not found");
      return;
    }

    let photosArr = [];
    var photos = JSON.parse(JSON.stringify(photosModel));
    for (var i = 0; i < photos.length; i++) {
      let commentsArr = [];
      for (var j = 0; j < photos[i].comments.length; j++) {
        var comment = {
          comment: photos[i].comments[j].comment,
          date_time: photos[i].comments[j].date_time,
          _id: photos[i].comments[j]._id,
          user: { _id: photos[i].comments[j].user_id },
        };
        commentsArr.push(comment);
      }
      var photo = {
        _id: photos[i]._id,
        user_id: photos[i].user_id,
        comments: commentsArr,
        file_name: photos[i].file_name,
        date_time: photos[i].date_time,
        likedUsers: photos[i].likedUsers,
      };
      photosArr.push(photo);
    }
    async.each(photosArr, addUserDetails, allDone);

    function addUserDetails(photosFile, callback1) {
      async.each(
        photosFile.comments,
        function (commentsFile, callback2) {
          var user_id = commentsFile.user._id;
          User.findOne({ _id: user_id }, function (err, author) {
            if (!err) {
              var author_detail = {
                _id: author._id,
                first_name: author.first_name,
                last_name: author.last_name,
              };
              commentsFile.user = author_detail;
            }
            callback2(err);
          });
        },
        function (error) {
          callback1(error);
        }
      );
    }

    function allDone(error) {
      if (error) {
        response.status(500).send(error);
      } else {
        console.log("Returned the user photos with id: " + id);
        response.status(200).send(photosArr);
      }
    }
  });
});

app.post("/commentsOfPhoto/:photo_id", async function (request, response) {
  const photo_id = request.params.photo_id;
  var session_user_id = request.session.userId;

  console.log("PHOTO ID: ", photo_id);
  console.log("SESSIES:: ", session_user_id);

  if (session_user_id === undefined) {
    return response.status(400).send("Unauthorized");
  }

  if (request.body.comment === "") {
    return response.status(400).send("Please enter comment!!!");
  }

  const userPhotos = await Photo.findById(photo_id);

  var newComment = {
    comment: request.body.comment,
    date_time: Date.now(),
    user_id: session_user_id,
  };

  userPhotos.comments.push(newComment);

  userPhotos.save();

  response.status(200).send("Success");
});

app.post("/admin/login", async function (request, response) {
  const username = request.body.username;
  const password = request.body.password;

  const user = await User.findOne({ login_name: username });
  if (!user) return response.status(400).send("user not found!");

  const isValid = bcrypt.compare(password, user.password);

  if (!isValid) {
    return response.status(400).send("password is incorrect!");
  }
  request.session.userId = user.id;

  console.log("session", request.session);
  response
    .status(200)
    .json({ message: "success", userName: user.login_name, userId: user.id });
});

app.post("/admin/register", async function (request, response) {
  const loginName = request.body.loginName;
  const password = String(request.body.password);
  const fname = request.body.fname;
  const lname = request.body.lname;
  const location = request.body.location;
  const description = request.body.description;
  const occupation = request.body.occupation;

  if (
    !loginName ||
    !password ||
    !fname ||
    !lname ||
    !location ||
    !description ||
    !occupation
  ) {
    return response.status(400).send("Enter fields");
  }

  const isExistUser = await User.findOne({ login_name: loginName });

  if (isExistUser) {
    return response.status(400).send("Already exists");
  }

  const user = new User();
  user.login_name = loginName;
  user.password = await bcrypt.hash(password, saltRound);
  user.first_name = fname;
  user.last_name = lname;
  user.location = location;
  user.description = description;
  user.occupation = occupation;

  await user.save();

  response.status(200).json({ user: user });
});

const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});

app.post(
  "/photos/new",
  upload.single("image"),
  async function (request, response) {
    var session_user_id = request.session.userId;

    if (!request.file) {
      return response.status(400).send({ message: "No file chosen" });
    }

    if (session_user_id === undefined) {
      return response.status(400).send("Unauthorized");
    }

    console.log("SESSION: ", session_user_id);
    const photo = new Photo();

    photo.file_name = `http://localhost:3000/${request.file.destination}/${request.file.filename}`;
    photo.date_time = Date.now();
    photo.user_id = session_user_id;
    photo.comments = [];

    photo.save();

    return response.status(200).send("SUCCESS");
  },

  app.post("/likePhoto", async function (request, response) {
    const photo_id = request.body.photo_id;
    var session_user_id = request.session.userId;

    const photoResponse = await Photo.findOneAndUpdate(
      { _id: photo_id },
      { $push: { likedUsers: session_user_id } },
      { new: true }
    );

    console.log("photoResponse", photoResponse);

    if (photoResponse) {
      response.status(200).send({
        message: "success",
        code: "200",
        result: photoResponse,
      });
      return;
    } else {
      response
        .status(200)
        .send({ message: "success", code: "200", result: [] });
      return;
    }
  }),

  app.post("/unlikePhoto", async function (request, response) {
    const photo_id = request.body.photo_id;
    var session_user_id = request.session.userId;

    const photoResponse = await Photo.findOneAndUpdate(
      { _id: photo_id },
      { $pull: { likedUsers: session_user_id } },
      { new: true }
    );

    console.log("photoResponse", photoResponse);

    if (photoResponse) {
      response.status(200).send({
        message: "success",
        code: "200",
        result: photoResponse,
      });
      return;
    } else {
      response
        .status(200)
        .send({ message: "success", code: "200", result: [] });
      return;
    }
  })
);

app.post("/add_favorites", async function (request, response) {
  const photo_id = request.body.photo_id;
  var session_user_id = request.session.userId;

  const user = await User.findOneAndUpdate(
    { _id: session_user_id },
    { $push: { favorites: photo_id } },
    { new: true }
  );

  console.log("user", user);

  if (user) {
    response.status(200).send({
      message: "success",
      code: "200",
      result: user,
    });
    return;
  } else {
    response.status(200).send({ message: "success", code: "200", result: [] });
    return;
  }
});

app.post("/delete_favorites", async function (request, response) {
  const photo_id = request.body.photo_id;
  var session_user_id = request.session.userId;

  const user = await User.findOneAndUpdate(
    { _id: session_user_id },
    { $pull: { favorites: photo_id } },
    { new: true }
  );

  console.log("user", user);

  if (user) {
    response.status(200).send({
      message: "success",
      code: "200",
      result: user,
    });
    return;
  } else {
    response.status(200).send({ message: "success", code: "200", result: [] });
    return;
  }
});
