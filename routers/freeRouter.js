const express = require("express");
const db = require("../db");
const conn = require("../db/index");

const router = express.Router();

router.get("/list", (req, res, next) => {
    const selectQuery = `
        SELECT  id,
                title,
                content,
                createdAt,
                anonymousName
          FROM  frees
         ORDER  BY  id     DESC
    `;

    try {
        db.query(selectQuery, (err, frees) => {

            console.log(err);
            console.log(frees);

            res.render("screens/free/freelist", {frees});
        })
    } catch (error) {
        console.error(error);
        return res.redirect("/");
    }
});

router.get("/create", (req, res, next) => {
    res.render("screens/free/freecreate");
})

router.post("/create", (req, res, next) => {
    const {title, content, anonymousName} = req.body;

    const createQuery = `
    INSERT INTO frees (
        title,
        content,
        createdAt,
        anonymousName
    ) VALUES (
        "${req.body.title}",
        "${req.body.content}",
        now(),
        "${req.body.anonymousName}"
    )
    `;
    try {
        conn.query(createQuery, (error, result) => {
            if(error){
                console.error(error);
                return res.status(400).send("잘못된 요청입니다. 다시 시도해주세요.");
            }
        res.redirect("/free/list");
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send("게시글 생성에 실페했습니다.");
    }
});

router.get("/detail/:freeId", (req, res, next) => {
    const {freeId} = req.params;

        const detailQuery = `
            SELECT  id,
                    title,
                    content,
                    createdAt,
                    anonymousName
              FROM  frees
             WHERE  id  =  ${freeId}
        `;

    try {
        conn.query(detailQuery, (err, result) => {
            res.render("screens/free/freedetail", {result : result[0]});
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send("접속 실페");
    };
});

router.post("/delete", (req, res, next) => {
    const {freeId} = req.body;

    try {
        const deleteQuery = `
            DELETE FROM frees
             WHERE  id =  ${freeId}
        `;

        conn.query(deleteQuery, (error, result) => {
            if(error){
                console.error(error);
                return  res.status(400).send("삭제 중 에러 발생!");
            }
            res.redirect("/free/list");
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send("삭제에 실페했습니다.");
    }
});



module.exports = router;
