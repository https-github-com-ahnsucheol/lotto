/**
 * @fileoverview Lotto 관련 API 라우터
 * @version 1.0.0
 */

import { Router } from "express";
import {
  saveRecentLottoNumber,
  getLottoNumber,
  saveExcelLottoNumber,
} from "../controllers/lottoController";
import asyncWrapper from "../middlewares/asyncWrapper";
import crawling from "../middlewares/crawling";

const router = Router();

/**
 * 기존의 당첨번호가 저장되어있는 엑셀 파일(lotto.xls)을 사용하여 DB에 저장하는 함수.
 *
 * DB 초기화시 사용
 *
 * @api {post} /lotto/excel DB에 당첨번호 저장
 * @apiName SaveExcelLottoNumber
 * @apiGroup Lotto
 *
 * @apiSuccess {string} message 성공 메시지
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "message": "save lotto number."
 *     }
 *
 * @apiError ExcelFileNotFound 엑셀 파일이 없을 때
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Excel file not found"
 *     }
 */
router.post("/excel", saveExcelLottoNumber);

/**
 * 최신 회차의 당첨번호를 크롤링하여 DB에 저장하는 함수
 *
 * @api {post} /lotto/recent 최신 회차 당첨번호 크롤링
 * @apiName SaveRecentLottoNumber
 * @apiGroup Lotto
 *
 * @apiSuccess {string} message 성공 메시지
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "최신 회차의 당첨번호가 성공적으로 저장되었습니다."
 *     }
 *
 * @apiError CrawlingFailed 크롤링 실패했을 때
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "CrawlingFailed"
 *     }
 * @apiError DuplicateKeyError 이미 존재하는 회차일 때
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 409 Conflict
 *    {
 *      "error": "Duplicate Round Error"
 *    }
 */
router.post("/recent", crawling, asyncWrapper(saveRecentLottoNumber));

/**
 * 회차 범위를 입력받아 해당 회차의 당첨번호를 DB에서 가져오는 함수
 *
 * 회차가 없다면 1회차부터 마지막 회차까지의 당첨번호를 가져온다.
 *
 * @api {get} /lotto/recent/:startRound/:endRound 회차 범위 당첨번호 조회
 * @apiName GetLottoNumber
 * @apiGroup Lotto
 *
 * @apiParam {number} [startRound] 시작 회차 (optional)
 * @apiParam {number} [endRound] 끝 회차 (optional)
 *
 * @apiSuccess {string} message 성공 메시지
 * @apiSuccess {number} count 당첨번호 개수
 * @apiSuccess {Object[]} lottos 당첨번호 목록
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "1회차부터 10회차까지의 당첨번호",
 *       "count": 10,
 *       "lottos": [
 *         {
 *           "id": UUID,
 *           "round": 1,
 *           "numbers": [1, 2, 3, 4, 5, 6],
 *           "bonusNumber": 7
 *         },
 *         ...
 *       ]
 *     }
 *
 * @apiError InvalidRoundRange 유효하지 않은 회차 범위일 때
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "InvalidRoundRange"
 *     }
 */
router.get("/", asyncWrapper(getLottoNumber));

export default router;
