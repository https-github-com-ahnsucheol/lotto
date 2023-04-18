// crawling 미들웨어를 통해 크롤링한 데이터인 round, winNums, bonusNum을 req.body에 담아서 lottoController의 saveRecentLottoNumber 함수에 전달해주세요.
// round의 타입은 number, winNums의 타입은 number[], bonusNum의 타입은 number입니다.

export class CrawlingDto {
  round: number;
  winNums: number[];
  bonusNum: number;

  constructor(round: number, winNums: number[], bonusNum: number) {
    this.round = round;
    this.winNums = winNums;
    this.bonusNum = bonusNum;
  }
}
