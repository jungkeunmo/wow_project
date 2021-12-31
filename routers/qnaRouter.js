const express = require("express");
const db = require("../db");
const checkLogin = require("../middlewares/checkLogin");

const router = express.Router();

router.get("/qnalist", checkLogin, (req, res, next) => {
    const selectQuery =`
        SELECT  A.id,
                A.title,
                B.name,
                A.createdAt
          FROM  qna      A
         INNER 
          JOIN  users    B
            ON  A.userId = B.id
         ORDER  BY  A.createdAt     DESC
    `;
    const   loggedIn = req.session.isLoggedIn;
    try {
        db.query(selectQuery, (err, rows) => {
            return res.render("screens/qna/qnalist", { loggedIn, qnaList: rows});
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send("데이터 조회에 실패했습니다.");
    };
});

router.get("/qnadetail", checkLogin, (req, res, next) => {

    const detailQuery=`
        SELECT  A.id,
                A.title,
                A.content,
                B.name, 
                A.createdAt
          FROM  qna     A
         INNER
          JOIN  users   B
            ON  A.userId = B.id
         WHERE  A.id = ${req.query.bid}
    `;

    const loggedIn = req.session.isLoggedIn;

    try {
        db.query(detailQuery, (err, rows) => {
            res.render("screens/qna/qnadetail", { loggedIn, qna: rows[0] });
        });
    } catch(error) {
        console.error(error);
        return res.status(400).send("qnadetail page 접속을 실패했습니다.");
    };
});

router.get("/qnacreate", checkLogin, (req, res, next) => {
    const loggedIn = req.session.isLoggedIn;
    res.render("screens/qna/qnacreate", {loggedIn});
});

router.post("/qnacreate", (req, res, next) => {
    
    const createQuery= `
        INSERT INTO qna (
            title,
            content,
            createdAt,
            updatedAt,
            userId
        )   VALUES (
            "${req.body.input_title}",
            "${req.body.input_content}",
            now(),
            now(),
            ${req.session.userId}
        )
    `;

    try {
        db.query(createQuery, (error, qna) => {
            if(error){
                console.error(error);
                return res.redirect("/qna/qnalist");
            }
        res.redirect("/qna/qnalist");
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send("게시글 생성에 실패했습니다.");
    };
});

router.get("/qnaupdate", (req, res, next) => {
    const {qnaId} = req.body;
    const {qnatitle, qnacontent} = req.body;

    try {
        const updateQuery = `
            UPDATE  qna
               SET  title = "${qnatitle}",
                    content = "${qnacontent}",
                    updatedAt = now()
             WHERE  id = ${qnaId}
        `;
        db.query(updateQuery, (error, qna) => {
            if(error){
                console.error(error);
                return res.status(400).send("게시글 수정중 애러 발생!");
            }
        });
    } catch (error) {
        console.error(error);
        res.status(400).send("게시글을 수정할 수 없습니다.")
    }
    res.redirect("/qna/qnalist")
});

router.post("/qnadelete", (req, res, next) => {

    const {bDataId} = req.body;

    try {
        const deleteQuery =`
            DELETE  FROM    qna
             WHERE  id = ${bDataId}
        `;
        db.query(deleteQuery, (error, bData) => {
            if(error){
                console.error(error);
                return res.status(400).send("삭제중 애러 발생!");
            }
            res.redirect("/qna/qnalist");
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send("삭제에 실패했습니다.");
    }
});

module.exports = router;