const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/finished", (req, res, next) => {
  const finishedWebtoonsSelectQuery = `
      SELECT   id,
            title,
            score,
            being,
            publish
      FROM  webtoons
     WHERE  being		LIKE	'완결'
     ORDER	BY	score	DESC
  `;
  try {
    db.query(finishedWebtoonsSelectQuery, (err, finishedWebtoons) => {
      console.log(err);
      res.render("screens/webtoon/finished", { finishedWebtoons });
    });
  } catch (error) {
    console.error(error);
    return res.redirect("/");
  }
});

router.get("/writer", (req, res, next) => {
  const writerSelectQuery = `
    SELECT  id,
            title,
            score,
            being,
            publish
      FROM  webtoons
     WHERE  being		LIKE	'완결'
     ORDER	BY	score	DESC
  `;
  try {
    db.query(writerSelectQuery, (err, writer) => {
      console.log(err);
      res.render("screens/webtoon/finished", { writer });
    });
  } catch (error) {
    console.error(error);
    return res.redirect("/");
  }
});

router.get("/kakaoWeb", (req, res, next) => {
  const kakaoWebtoonsSelectQuery = `
    SELECT  id,
		        title,
		        score,
		        being,
		        publish,
            days
      FROM  webtoons
     WHERE  publish		LIKE	'카카오웹툰'
       AND  being		  LIKE	'연재'
     ORDER	BY	score	DESC
  `;
  try {
    db.query(kakaoWebtoonsSelectQuery, (err, kakaoWebtoons) => {
      console.log(err);
      res.render("screens/webtoon/kakaoWeb", { kakaoWebtoons });
    });
  } catch (error) {
    console.error(error);
    return res.redirect("/");
  }
});

router.get("/kakaoPage", (req, res, next) => {
  const kakaoPagesSelectQuery = `
    SELECT  id,
		        title,
		        score,
		        being,
		        publish,
            days
      FROM  webtoons
     WHERE  publish		LIKE	'카카오페이지'
       AND  being		  LIKE	'연재'
     ORDER	BY	score	DESC 
  `;
  try {
    db.query(kakaoPagesSelectQuery, (err, kakaoPages) => {
      console.log(err);
      res.render("screens/webtoon/kakaoPage", { kakaoPages });
    });
  } catch (error) {
    console.error(error);
    return res.redirect("/");
  }
});

router.get("/naverWeb", (req, res, next) => {
  const naverWebsSelectQuery = `
    SELECT  id,
		        title,
		        score,
		        being,
		        publish,
            days
      FROM  webtoons
     WHERE  publish		LIKE	'네이버웹툰'
       AND  being		  LIKE	'연재'
     ORDER	BY	score	DESC
  `;
  try {
    db.query(naverWebsSelectQuery, (err, naverWebtoons) => {
      console.log(err);
      res.render("screens/webtoon/naverWeb", { naverWebtoons });
    });
  } catch (error) {
    console.error(error);
    return res.redirect("/");
  }
});

router.get("/naverSeries", (req, res, next) => {
  const naverSeriesSelectQuery = `
    SELECT  id,
		        title,
		        score,
		        being,
		        publish,
            days
      FROM  webtoons
     WHERE  publish		LIKE	'네이버시리즈'
       AND  being		  LIKE	'연재'
     ORDER	BY	score	DESC 
  `;
  try {
    db.query(naverSeriesSelectQuery, (err, naverSeries) => {
      console.log(err);
      res.render("screens/webtoon/naverSeries", { naverSeries });
    });
  } catch (error) {
    console.error(error);
    return res.redirect("/");
  }
});

router.get("/webtooncreate", (req, res, next) => {
  res.render("screens/webtoon/webtooncreate");
});

router.post("/webtooncreate", (req, res, next) => {
  console.log(req.body.title);
  console.log(req.body.score);
  console.log(req.body.Introduction);
  console.log(req.body.being);
  console.log(req.body.publish);
  console.log(req.body.days);

  const webtoonsInsertQuery = ` 
    INSERT INTO webtoons(
		  title,
      score,
		  Introduction,
      being,
      publish,
      days
	  ) VALUE (
		  "${req.body.title}",
      ${req.body.score},
      "${req.body.Introduction}",
      "${req.body.being}",
      "${req.body.publish}",
      "${req.body.days}"
    )
    `;

      

  try {
    db.query(webtoonsInsertQuery, (error, result) => {
      if (error) {
        console.error(error);
      }
      res.redirect("/webtoon/webtooncreate");
    });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

module.exports = router;
