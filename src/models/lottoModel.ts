import { Between, FindOneOptions } from "typeorm";
import { Lotto } from "../entity/lotto";
import { Rounds } from "../dtos/rounds";
import { CrawlingDto } from "../dtos/crawlingReq";
import { DuplicateKeyError } from "../utils/customError/duplicateKeyError";
import { FindManyOptions } from "typeorm";

const saveRecentLottoNumber = async (
  crawlingDto: CrawlingDto
): Promise<Lotto> => {
  try {
    // 전달받은 crawlingDto를 lotto entity에 저장하기
    const { round, winNums, bonusNum } = crawlingDto;

    const lotto: Lotto = new Lotto();

    lotto.round = round;
    lotto.winNum1 = winNums[0];
    lotto.winNum2 = winNums[1];
    lotto.winNum3 = winNums[2];
    lotto.winNum4 = winNums[3];
    lotto.winNum5 = winNums[4];
    lotto.winNum6 = winNums[5];
    lotto.bonusNum = bonusNum;

    await lotto.save();
    return lotto;
  } catch (error: any) {
    throw new DuplicateKeyError("Duplicate Round Error");
  }
};

const getLottoNumber = async (rounds: Rounds): Promise<Lotto[]> => {
  const { startRound, endRound } = rounds;
  const where: FindManyOptions<Lotto>["where"] =
    startRound && endRound ? { round: Between(startRound, endRound) } : {};

  const lottos: Lotto[] = await Lotto.findSorted({ where });
  return lottos;
};

const getMinRound = async (): Promise<number> => {
  const options: FindOneOptions<Lotto> = {
    where: {},
    order: { round: "ASC" },
  };

  const lotto = await Lotto.findOne(options);
  if (!lotto) {
    throw new Error("No Lotto Data");
  }
  return lotto.round;
};

const getMaxRound = async (): Promise<number> => {
  const options: FindOneOptions<Lotto> = {
    where: {},
    order: { round: "DESC" },
  };

  const lotto = await Lotto.findOne(options);
  if (!lotto) {
    throw new Error("No Lotto Data");
  }
  return lotto.round;
};

export default {
  saveRecentLottoNumber,
  getLottoNumber,
  getMinRound,
  getMaxRound,
};
