const db = require("../db");
const express = require("express");
const checkLogin = require("../middlewares/checkLogin");

const router = express.Router();

router.get("/", checkLogin, (req, res, next) => {
  const loggedIn = req.session.isLoggedIn;

  console.log(req.session);

  res.render("screens/home", { loggedIn });
});

router.get("/signin", checkLogin, (req, res, next) => {
  const loggedIn = req.session.isLoggedIn;
  res.render("screens/signin", {loggedIn});
});

router.post("/signin", (req, res) => {
  const selectQuery = `
    SELECT  id,
            name,
            email,
            password,
            birth,
            phone_number
      FROM  users
     WHERE  email = "${req.body.signinEmail}"
       AND  password = "${req.body.signinPassword}" 
    `;

try {
  db.query(selectQuery, (error, rows) => {
      if (error) {
          console.error(error);
          return res.redirect("/signin");
      }

      if (rows.length === 0) {
          return res.redirect("/signin");
      }

      req.session.isLoggedIn = true;
      req.session.userId = rows[0].id;
      return res.redirect("/");
  })

} catch (error) {
  console.log(error);
  return res.redirect("/signin");
};
});

router.get("/signup", checkLogin, (req, res, next) => {
  const loggedIn = req.session.isLoggedIn;
  res.render("screens/signup", {loggedIn});
});

router.post("/signup", (req, res, next) => {
  const userCheckQuery = `
        SELECT email
          FROM users
         WHERE email="${req.body.email}"`;

  db.query(userCheckQuery, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(403).send("다시 시도해주세요");
    } else {
      if (result.length > 0) {
        return res.status(403).send("이메일 이미 존재합니다.");
      } else {
        const signupQuery = `
                    INSERT INTO users (
                        name,
                        birth,
                        gender,
                        phone_number,
                        email,
                        password
                    )VALUES (
                        "${req.body.name}",
                        "${req.body.birth}",
                        "${req.body.gender}",
                        ${req.body.phone_number},
                        "${req.body.email}",
                        "${req.body.password}"
                )`;

        db.query(signupQuery, (error, resutl) => {
          if (error) {
            console.error(error);
            return res.status(400).send("회원가입 실패");
          } else {
            res.redirect("/");
          };
        });
      };
    };
  });
});

router.get("/user", checkLogin, (req, res, next) => {
  const loggedIn = req.session.isLoggedIn;
  res.render("screens/user", {loggedIn});
});

router.get("/profile", checkLogin, (req, res, next) => {
  const loggedIn = req.session.isLoggedIn;
  res.render("screens/profile", {loggedIn});
});

router.get("/logout", (req, res, next) => {
  req.session.isLoggedIn = false;
  req.session.userId = null;
  return res.redirect("/");
});

router.get("/help", checkLogin, (req, res, next) => {
  const loggedIn = req.session.isLoggedIn;
  res.render("screens/help", {loggedIn});
});

router.get("/partcipants", (req, res, next) => {
  res.render("screens/partcipants");
});

router.get("/termsofuse", (req, res, next) => {
  res.render("screens/termsofuse");
});

router.get("/development", checkLogin,(req, res, next) => {
  const loggedIn = req.session.isLoggedIn;
  res.render("screens/development", {loggedIn});
});

router.get("/suggestion", checkLogin,(req, res, next) => {
  const loggedIn = req.session.isLoggedIn;
  res.render("screens/suggestion", {loggedIn});
});

module.exports = router;
