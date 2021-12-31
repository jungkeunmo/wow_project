const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("review", async(req, res, next) => {

    let result1 = null;
    let result2 = null;

    const query1 =`
    SELECT  COUNT(id)       AS  count,
            AVG(score)      AS avg
      FROM  kakaoweb
    `;

    const query2 =`
    SELECT  id,
            score,
            content
      FROM  kakaoweb
     ORDER  BY     id   DESC;
    `;

    try {
        db.query(query1, (error, result) => {
            if(error){
                return console.error(error);
            }

            result1 = result;

            db.query(query2, (error, result) => {
                if(error){
                    return console.error(error);
                }
                
                result2 = result;

            console.log(result1[0]);
            console.log(result2);

            res.render("screens/kakao/kakaoreview", {
                result1: result1[0],
                result2: result2,
            });
            

            });
        });
    } catch (error) {
        console.error(error);
    }
});

router.get("/reviewcreate", (req, res) => {
});

router.post("/reviewcreate", (req, res) => {
    const insertQuery=`
        INSERT  INTO    kakaoweb(
            score,
            content
        )   VALUES (
            ${req.body.score},
            "${req.body.content}"
        )
    `;

    try {
        db.query(insertQuery, (error, result) => {
            if(error){
                console.error(error);
            }
            res.redirect("/review");
        });
    } catch (error) {
        console.error(error);
        res.redirect("/review")
    }
});

module.exports = router;