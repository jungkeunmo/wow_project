const express = require("express");
const db = require("../db");
const checkLogin = require("../middlewares/checkLogin");

const router = express.Router();

router.get("/noticelist", checkLogin, (req, res, next) => {
    const selectQuery = `
        SELECT 	A.id,
                A.title,
                B.name,
                A.createdAt
          FROM	notices	 A
         INNER  
          JOIN  users	 B
            ON  A.userId = B.id
         ORDER  BY	A.createdAt	 DESC
    `;

  const loggedIn = req.session.isLoggedIn;
  try {
    db.query(selectQuery, (err, rows) => {
      return res.render("screens/notice/noticelist", { loggedIn, noticeList: rows });
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send("데이터 조회에 실패했습니다.");
  };
});

router.get("/noticedetail", checkLogin, (req, res, next) => {
    const detailQuery = `
        SELECT 	A.id,
                A.title,
                A.content,
                B.name,
                A.createdAt
          FROM	notices	 A
         INNER  
          JOIN  users	 B
            ON  A.userId = B.id
         WHERE  A.id = ${req.query.bid}
    `;

    const loggedIn = req.session.isLoggedIn;

    try {
        db.query(detailQuery, (err, rows) => {
            res.render("screens/notice/noticedetail", { loggedIn, bData: rows[0] });
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send("작성하는데 실패하셨습니다.");
    };    
});

router.get("/noticecreate", checkLogin, (req, res, next) => {
    const loggedIn = req.session.isLoggedIn;
    res.render("screens/notice/noticecreate", {loggedIn});
});

router.post("/noticecreate", (req, res, next) => {
    const createQuery = `
        INSERT  INTO notices (
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
        db.query(createQuery, (error, notices) => {
            if(error){
                console.error(err);
                return res.redirect("/notice/noticelist");
            }
        res.redirect("/notice/noticelist");
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send("게시글 생성에 실패했습니다.");
    };
});

router.post("/delete", (req, res, next) => {
  const { noticeId } = req.body;

  try {
    const deleteQuery = `
            DELETE FROM notices
             WHERE  id =   ${noticeId}
        `;

    conn.query(deleteQuery, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(400).send("삭제 중 에러 발생!");
      }
      res.redirect("/notice/list");
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send("삭제에 실페했습니다.");
  }
});

module.exports = router;
