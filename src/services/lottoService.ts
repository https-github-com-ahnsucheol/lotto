import { CrawlingDto } from "../dtos/crawlingReq";
import { Rounds } from "../dtos/rounds";
import { Lotto } from "../entity/lotto";
import lottoModel from "../models/lottoModel";

const saveRecentLottoNumber = async (
  crawlingDto: CrawlingDto
): Promise<Lotto> => {
  // 전달받은 winNumsArr를 lottoModels에 전달하기
  const lotto: Lotto = await lottoModel.saveRecentLottoNumber(crawlingDto);
  return lotto;
};

const getLottoNumber = async (rounds: Rounds): Promise<Lotto[]> => {
  // 전달받은 round를 lottoModels에 전달하기
  const lottos: Lotto[] = await lottoModel.getLottoNumber(rounds);
  return lottos;
};

export default { saveRecentLottoNumber, getLottoNumber };
