import { GO_CAT_SCREEN } from './types';

export const goCatScreen = (id,name) => (
  {
    type: GO_CAT_SCREEN,
    key: id,
    data: name
  }
);
