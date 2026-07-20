export * from './types.js';
import type { PayerConfig } from './types.js';
import { nationalPayers } from './national.js';
import { georgiaPayers } from './georgia.js';
import { northCarolinaPayers } from './north-carolina.js';
import { indianaPayers } from './indiana.js';
import { virginiaPayers } from './virginia.js';
import { tennesseePayers } from './tennessee.js';
import { ohioPayers } from './ohio.js';
import { newJerseyPayers } from './new-jersey.js';
import { marylandPayers } from './maryland.js';
import { coloradoPayers } from './colorado.js';
import { arizonaPayers } from './arizona.js';
import { newYorkPayers } from './new-york.js';
import { newMexicoPayers } from './new-mexico.js';
import { missouriPayers } from './missouri.js';
import { texasPayers } from './texas.js';
import { massachusettsPayers } from './massachusetts.js';
import { floridaPayers } from './florida.js';
import { kansasPayers } from './kansas.js';
import { nebraskaPayers } from './nebraska.js';
import { utahPayers } from './utah.js';

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
