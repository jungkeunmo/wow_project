const express = require("express");
const db = require("../db");
const checkLogin = require("../middlewares/checkLogin");

const router = express.Router();

router.get("/eventlist", checkLogin, (req, res, next) => {
  const selectQuery = `
        SELECT 	A.id,
                A.title,
                B.name,
                A.createdAt
        FROM	events	 A
        INNER  
        JOIN  users	 B
        ON  A.userId = B.id
        ORDER  BY	A.createdAt	 DESC
    `;
  const loggedIn = req.session.isLoggedIn;
  try {

    db.query(selectQuery, (err, rows) => {
      return res.render("screens/event/eventlist", {
        loggedIn,
        eventList: rows,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send("데이터 조회에 실패했습니다.");
  }
});

router.get("/eventdetail", checkLogin, (req, res, next) => {
  const detailQuery = `
        SELECT 	A.id,
                A.title,
                A.content,
                B.name,
                A.createdAt
          FROM	events	 A
         INNER  
          JOIN  users	 B
            ON  A.userId = B.id
         WHERE  A.id = ${req.query.bid}
    `;

  const loggedIn = req.session.isLoggedIn;
  
  try {
    db.query(detailQuery, (err, rows) => {
      res.render("screens/event/eventdetail", { loggedIn, bData: rows[0] });
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send("접속 실패");
  }
});

router.get("/eventcreate", checkLogin, (req, res, next) => {
  const loggedIn = req.session.isLoggedIn;
  res.render("screens/event/eventcreate", {loggedIn});
});

router.post("/eventcreate", (req, res, next) => {
  const createQuery = `
    INSERT  INTO events (
        title,
        content,
        createdAt,
        updatedAt,
        userId
    ) VALUES (
        "${req.body.input_title}",
        "${req.body.input_content}",
        now(),
        now(),  
        ${req.session.userId}
    )
    `;

  try {
    db.query(createQuery, (error, events) => {
      if (error) {
        console.error(err);
        return res.redirect("/event/eventlist");
      }
      res.redirect("/event/eventlist");
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send("게시글 생성에 실페했습니다.");
  }
});

router.post("/eventdelete", (req, res, next) => {

  const { bDataId } = req.body;

  try {
    const deleteQuery = `
            DELETE FROM events
             WHERE  id = ${bDataId}
        `;
    db.query(deleteQuery, (error, bData) => {
      if (error) {
        console.error(error);
        return res.status(400).send("삭제 중 애러 발생!");
      }
      res.redirect("/event/eventlist");
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send("삭제에 실페했습니다.");
  }
});

router.get("/update", (req, res, next) => {
  res.render("screens/event/eventupdate");
});

module.exports = router;
