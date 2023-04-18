// 로또 사이트에서 당첨번호를 크롤링하기 위한 미들웨어
import { NextFunction, Request, Response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import { CrawlingDto } from "../dtos/crawlingReq";

const crawling = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const url = "https://www.dhlottery.co.kr/gameResult.do?method=byWin";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data, { xmlMode: true });
    let winNums = new Array(7);

    let bonusNum: number;
    // 당첨 회차 추출하고 숫자만 추출하기
    const round = parseInt(
      $(
        "#article > div:nth-child(2) > div > div.win_result > h4 > strong"
      ).text()
    );

    // 당첨번호 추출
    $(
      "#article > div:nth-child(2) > div > div.win_result > div > div.num.win > p"
    ).each((i, elem) => {
      winNums = $(elem)
        .text()
        .trim()
        .replace(/\t/g, "")
        .split("\r\n")
        .map(Number);
    });
    // 보너스 번호 추출
    bonusNum = parseInt(
      $(
        "#article > div:nth-child(2) > div > div.win_result > div > div.num.bonus > p > span"
      ).text()
    );
    const crawlingDto = new CrawlingDto(round, winNums, bonusNum);
    req.body = crawlingDto;

    next();
  } catch (error) {
    throw new Error("CrawlingFailed");
  }
};

export default crawling;
