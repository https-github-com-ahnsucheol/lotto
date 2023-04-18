import { Request, Response } from "express";
import { Rounds } from "../dtos/rounds";
import lottoService from "../services/lottoService";
import { CrawlingDto } from "../dtos/crawlingReq";
import { Lotto } from "../entity/lotto";
import XLSX from "xlsx";

/**
 * lotto entity truncate 했을 때 실행 시킬 함수
 * lotto.xls 파일을 읽어서 회차와 당첨번호 6개와 보너스번호 1개를 DB에 저장하는 함수
 * 회차는 B4가 1063회이고 당첨번호는 N4~T4까지이다.
 * B5는 1062회이고 N5~T5까지이다.
 * B6은 1061회이고 N6~T6까지이다.
 * ...
 * B1066은 1회이고 N1066~T1066까지이다.
 * 이중 2회차부터 1063회차까지의 회차와 당첨번호를 DB에 저장한다.
 * 함수명은 saveExcelLottoNumber로 한다.
 */
const saveExcelLottoNumber = async (req: Request, res: Response) => {
  const workbook = XLSX.readFile("lotto.xls");
  if (!workbook) {
    throw new Error("Excel file not found");
  }

  const sheetNameList = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheetNameList[0]];

  for (let i = 1063; i > 1; i--) {
    const lotto: Lotto = new Lotto();
    lotto.round = 1064 - i;
    lotto.winNum1 = parseInt(worksheet[`N${i + 3}`].v);
    lotto.winNum2 = parseInt(worksheet[`O${i + 3}`].v);
    lotto.winNum3 = parseInt(worksheet[`P${i + 3}`].v);
    lotto.winNum4 = parseInt(worksheet[`Q${i + 3}`].v);
    lotto.winNum5 = parseInt(worksheet[`R${i + 3}`].v);
    lotto.winNum6 = parseInt(worksheet[`S${i + 3}`].v);
    lotto.bonusNum = parseInt(worksheet[`T${i + 3}`].v);

    await lotto.save();
  }

  res.status(201).json({ message: `save lotto number` });
};

/**
 * 최신 회차의 당첨번호를 크롤링하여 DB에 저장하는 함수
 * @param req.body CrawlingDto: { round: number, winNums: number[], bonusNum: number }
 */
const saveRecentLottoNumber = async (req: Request, res: Response) => {
  const crawlingDto: CrawlingDto = req.body;

  const lotto: Lotto = await lottoService.saveRecentLottoNumber(crawlingDto);

  res.status(201).json({
    message: `최신 회차의 당첨번호가 성공적으로 저장되었습니다.`,
    lotto,
  });
};

/**
 * 회차 범위를 입력받아 해당 회차의 당첨번호를 DB에서 가져오는 함수
 *
 * 회차가 없다면 1회차부터 마지막 회차까지의 당첨번호를 가져온다.
 * @version 1.0.0
 * @query startRound : number || undefined
 * @query endRound : number || undefined
 */
const getLottoNumber = async (req: Request, res: Response) => {
  const startRound = parseInt(req.query.startRound as string);
  const endRound = parseInt(req.query.endRound as string);

  const rounds: Rounds = new Rounds(
    isNaN(startRound) ? undefined : startRound,
    isNaN(endRound) ? undefined : endRound
  );
  await rounds.validate();

  const lottos = await lottoService.getLottoNumber(rounds);

  res.status(200).json({
    message: `${rounds.startRound ? rounds.startRound + "회차" : "1회차"}부터 ${
      rounds.endRound ? rounds.endRound + "회차" : "마지막 회차"
    }까지의 당첨 번호`,
    count: lottos.length,
    lottos,
  });
};

export { saveRecentLottoNumber, getLottoNumber, saveExcelLottoNumber };
