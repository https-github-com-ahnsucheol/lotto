import { BadRequestError } from "../utils/customError/badRequestError";
import lottoModel from "../models/lottoModel";

export class Rounds {
  startRound?: number;
  endRound?: number;

  constructor(startRound?: number | undefined, endRound?: number | undefined) {
    this.startRound = startRound;
    this.endRound = endRound;
  }

  async validate(): Promise<void> {
    if (
      (this.startRound && !this.endRound) ||
      (!this.startRound && this.endRound)
    ) {
      throw new BadRequestError(
        "Invalid arguments: startRound and endRound must both exist or both not exist"
      );
    }

    if (this.startRound! <= 0 && this.endRound! <= 0) {
      throw new BadRequestError(
        "Invalid arguments: startRound and endRound must be greater than 0"
      );
    }
    if (this.startRound! > this.endRound!) {
      throw new BadRequestError(
        "Invalid arguments: startRound must be less than endRound"
      );
    }

    const minRound = await lottoModel.getMinRound();
    const maxRound = await lottoModel.getMaxRound();

    if (this.startRound && this.startRound < minRound) {
      throw new BadRequestError(
        `Invalid arguments: startRound must be greater than or equal to ${minRound}`
      );
    }

    if (this.endRound && this.endRound > maxRound) {
      throw new BadRequestError(
        `Invalid arguments: endRound must be less than or equal to ${maxRound}`
      );
    }
  }
}
