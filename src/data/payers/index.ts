export * from './types';
import type { PayerConfig } from './types';
import { nationalPayers } from './national';
import { georgiaPayers } from './georgia';
import { northCarolinaPayers } from './north-carolina';
import { indianaPayers } from './indiana';
import { virginiaPayers } from './virginia';
import { tennesseePayers } from './tennessee';
import { ohioPayers } from './ohio';
import { newJerseyPayers } from './new-jersey';
import { marylandPayers } from './maryland';
import { coloradoPayers } from './colorado';
import { arizonaPayers } from './arizona';
import { newYorkPayers } from './new-york';
import { newMexicoPayers } from './new-mexico';
import { missouriPayers } from './missouri';
import { texasPayers } from './texas';
import { massachusettsPayers } from './massachusetts';
import { floridaPayers } from './florida';
import { kansasPayers } from './kansas';
import { nebraskaPayers } from './nebraska';
import { utahPayers } from './utah';

export const payers: Record<string, PayerConfig> = {
  ...nationalPayers,
  ...georgiaPayers,
  ...northCarolinaPayers,
  ...indianaPayers,
  ...virginiaPayers,
  ...tennesseePayers,
  ...ohioPayers,
  ...newJerseyPayers,
  ...marylandPayers,
  ...coloradoPayers,
  ...arizonaPayers,
  ...newYorkPayers,
  ...newMexicoPayers,
  ...missouriPayers,
  ...texasPayers,
  ...massachusettsPayers,
  ...floridaPayers,
  ...kansasPayers,
  ...nebraskaPayers,
  ...utahPayers,
};
