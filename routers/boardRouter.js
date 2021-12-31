const express = require("express");
const db = require("../db");
const checkLogin = require("../middlewares/checkLogin");

const router = express.Router();

router.get("/questionlist", checkLogin, (req, res, next) => {
    const selectQuery = `
        SELECT 	A.id,
                A.title,
                B.name,
                A.createdAt
          FROM	boards	 A
         INNER  
          JOIN  users	 B
            ON  A.userId = B.id
         ORDER  BY	A.createdAt	 DESC
    `;
    const loggedIn = req.session.isLoggedIn;
    try {
        db.query(selectQuery, (err, rows) => {
            return res.render("screens/board/questionlist", { loggedIn, boardList: rows });
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send("데이터 조회에 실패했습니다.");
    };
});

router.get("/questiondetail", checkLogin, (req, res, next) => {
 
    const detailQuery =`
        SELECT 	A.id,
                A.title,
                A.content,
                B.name,
                A.createdAt
          FROM	boards	 A
         INNER  
          JOIN  users	 B
            ON  A.userId = B.id
         WHERE  A.id = ${req.query.bid}
     `;

    const loggedIn = req.session.isLoggedIn;

    try {
        db.query(detailQuery, (err, rows) => {

            res.render("screens/board/questiondetail", { loggedIn, bData: rows[0] });
        }); 
    } catch (error) {
        console.error(error);
        return res.status(400).send("작성하는데 실패하셨습니다.");
    };    
});

router.get("/questioncreate", checkLogin, (req, res, next) => {
    const loggedIn = req.session.isLoggedIn;
    res.render("screens/board/questioncreate", {loggedIn});
});

router.post("/questioncreate", (req, res, next) => {
    
    const createQuery = `
        INSERT  INTO boards (
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
        db.query(createQuery, (error, questions) => {
            if(error){
                console.error(error);
                return res.redirect("/board/questionlist");
            }
        res.redirect("/board/questionlist");
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send("게시글 생성에 실패했습니다.");
    };
}); 

router.get("/questionupdate", (req, res, next) => {
    const {bDataId} = req.params;
    res.render("/screens/board/questionupdate");
});

router.post("/questionupdate", (req, res, next) => {
    const {bDataId} = req.body;
    const {bDatatitle, bDatacontent} = req.body;
    console.log(bDataId);
    console.log(bDatatitle);
    console.log(bDatacontent);
    try {
        const updateQuery = `
            UPDATE boards
               SET title = "${bDatatitle}",
                   content = "${bDatacontent}",
                   updatedAt = now()
             WHERE id =  ${bDataId}
    `;
    db.query(updateQuery, (error, bData) => {
        if(error){
            console.error(error);
            return res.status(400).send("게시글을 수정중 에러 발생 !");
        }
    });
    } catch (error) {
      console.error(error);
      res.status(400).send("게시글을 수정할 수 없습니다.")
    }
    res.redirect("/board/qustionlist")
});

router.post("/questiondelete", (req, res, next) => {

    const {bDataId} = req.body;

    try {
        const deleteQuery = `
            DELETE FROM boards
             WHERE id = ${bDataId}
        `;
        db.query(deleteQuery, (error, bData) => {
            if(error){
                console.error(error);
                return res.status(400).send("삭제 중 에러 발생!");
            }
            res.redirect("/board/questionlist");
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send("삭제에 실페했습니다.");
    }
});

module.exports = router;