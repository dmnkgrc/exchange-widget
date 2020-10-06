import { rest } from 'msw';

export const handlers = [
  rest.get('https://api.exchangeratesapi.io/latest', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        rates: {
          USD: 1.02,
          GBP: 0.8,
          MXN: 20.2,
        },
        base: 'EUR',
        date: new Date().toString(),
      })
    );
  }),
];
