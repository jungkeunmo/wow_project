const express = require("express");
const db = require("../db");
const checkLogin = require("../middlewares/checkLogin");

const router = express.Router();

router.get("/fqalist", checkLogin, (req, res, next) => {
  const selectQuery = `
        SELECT  A.id,
                A.title,
                B.name,
                A.createdAt
          FROM  fqa     A
         INNER
          JOIN  users   B
            ON  A.userId = B.id
         ORDER  BY A.createdAt  DESC
    `;

  const loggedIn = req.session.isLoggedIn;

  try {
    db.query(selectQuery, (err, rows) => {
      return res.render("screens/fqa/fqalist", { loggedIn, fqaList: rows });
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send("데이터 조회에 실패했습니다.");
  }
});

router.get("/fqadetail", checkLogin, (req, res, next) => {
  const detailQuery = `
        SELECT  A.id,
                A.title,
                A.content,
                B.name,
                A.createdAt
          FROM  fqa    A
         INNER  
          JOIN  users   B
            ON  A.userId = B.id
         WHERE  A.id = ${req.query.bid}
    `;

  const loggedIn = req.session.isLoggedIn;

  try {
    db.query(detailQuery, (err, rows) => {
      res.render("screens/fqa/fqadetail", { loggedIn, bData: rows[0] });
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send("detail page에 접근할수 없습니다.");
  }
});

router.get("/fqacreate", checkLogin, (req, res, next) => {
  const loggedIn = req.session.isLoggedIn;
  res.render("screens/fqa/fqacreate", { loggedIn });
});

router.post("/fqacreate", (req, res, next) => {
  const createQuery = `
        INSERT  INTO    fqa (
            title,
            content,
            createdAt,
            updatedAt,
            userId
        )   VALUES  (
            "${req.body.input_title}",
            "${req.body.input_content}",
            now(),
            now(),
            ${req.session.userId}
        )
    `;

  try {
    db.query(createQuery, (error, fqa) => {
      if (error) {
        console.error(error);
        return res.redirect("/fqa/fqalist");
      }
      res.redirect("/fqa/fqalist");
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send("게시글 생성에 실패했습니다.");
  }
});

router.get("/fqaupdate", (req, res, next) => {
  res.render("screens/fqa/fqaupdate");
});

router.post("/fqaupdate", (req, res, next) => {
  const { fqaId } = req.body;
  const { fqatitle, fqacontent } = req.body;

  const updateQuery = `
        UPDATE  fqa
           SET  title = "${fqatitle}",
                content = "${fqacontent}",
                updatedAt = now()
         WHERE  id = ${fqaId}
    `;
  try {
    db.query(updateQuery, (error, fqa) => {
      if (error) {
        console.error(error);
        return res.status(400).send("게시글 수정중 애러 발생!");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(400).send("게시글을 수정할 수 없습니다.");
  }
  res.redirect("/faq/faqlist");
});

router.post("/fqadelete", (req, res, next) => {
  const { bDataId } = req.body;

  try {
    const deleteQuery = `
            DELETE  FROM    fqa
             WHERE  id = ${bDataId}
        `;
    db.query(deleteQuery, (error, bData) => {
      if (error) {
        console.error(error);
        return res.status(400).send("삭제 중 애러 발생!");
      }
      res.redirect("/fqa/fqalist");
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send("삭제에 실패했습니다.");
  }
});

module.exports = router;
