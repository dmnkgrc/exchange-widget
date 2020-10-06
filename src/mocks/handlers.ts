import { rest } from 'msw';
import { API_URL } from './../config/constants';
import * as exchangeCurrencyResponses from './exchange-currency-responses.json';

export const handlers = [
  rest.get(API_URL, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(exchangeCurrencyResponses.EUR));
  }),
];
