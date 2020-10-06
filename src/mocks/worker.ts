import { handlers } from './handlers';
import { setupWorker } from 'msw';

export const worker = setupWorker(
  // Describe the requests to mock.
  ...handlers
);
