export * from './types';
import type { PayerConfig } from './types';
import { nationalPayers } from './national';
import { georgiaPayers } from './georgia';
import { northCarolinaPayers } from './north-carolina';
import { indianaPayers } from './indiana';
import { virginiaPayers } from './virginia';
import { tennesseePayers } from './tennessee';
import { ohioPayers } from './ohio';

export const payers: Record<string, PayerConfig> = {
  ...nationalPayers,
  ...georgiaPayers,
  ...northCarolinaPayers,
  ...indianaPayers,
  ...virginiaPayers,
  ...tennesseePayers,
  ...ohioPayers,
};
