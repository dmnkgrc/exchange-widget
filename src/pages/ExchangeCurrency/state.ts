import { currencies } from './../../config/exchange-currencies';
import {
  Currency,
  CurrencyConfig,
  exchangeCurrenciesConfig,
} from '../../config/exchange-currencies';
import type { ExchangeResult } from './../../types/exchange-result';
import { getDecimalPlaces } from '../../utils/numbers';

type AmountInputValue = number | '';

interface AmountsState {
  value: AmountInputValue;
  index: number;
  name: Currency;
  config: CurrencyConfig;
}

interface State {
  base: AmountsState;
  target: AmountsState;
  rates?: ExchangeResult['rates'];
}
type AmountsAction =
  | {
      type: 'SetBaseAmount' | 'SetTargetAmount';
      value: AmountInputValue;
    }
  | { type: 'SetExchangeRates'; value: ExchangeResult['rates'] }
  | { type: 'SetBaseIndex' | 'SetTargetIndex'; value: number };

function getTargetValue(value: AmountInputValue, exchangeRate?: number) {
  let targetValue = value;
  if (value !== '') {
    targetValue = exchangeRate ? exchangeRate * value : '';
  }
  return targetValue;
}

function getBaseValue(
  currentValue: AmountInputValue,
  value: AmountInputValue,
  exchangeRate?: number
) {
  if (value !== '') {
    return exchangeRate ? value / exchangeRate : currentValue;
  }
  return currentValue;
}

export function amountsReducer(state: State, action: AmountsAction): State {
  switch (action.type) {
    case 'SetBaseAmount':
      if (
        action.value !== '' &&
        (isNaN(action.value) || getDecimalPlaces(action.value) > 2)
      ) {
        return state;
      }
      return {
        ...state,
        base: {
          ...state.base,
          value: action.value,
        },
        target: {
          ...state.target,
          value: getTargetValue(action.value, state.rates?.[state.target.name]),
        },
      };
    case 'SetTargetAmount':
      if (
        action.value !== '' &&
        (isNaN(action.value) || getDecimalPlaces(action.value) > 2)
      ) {
        return state;
      }
      return {
        ...state,
        base: {
          ...state.base,
          value: getBaseValue(
            state.base.value,
            action.value,
            state.rates?.[state.target.name]
          ),
        },
        target: {
          ...state.target,
          value: action.value,
        },
      };
    case 'SetExchangeRates':
      return {
        ...state,
        rates: action.value,
      };
    case 'SetBaseIndex':
      return {
        ...state,
        base: {
          ...state.base,
          name: currencies[action.value],
          config: exchangeCurrenciesConfig[currencies[action.value]],
          index: action.value,
        },
      };
    case 'SetTargetIndex':
      return {
        ...state,
        target: {
          ...state.target,
          name: currencies[action.value],
          config: exchangeCurrenciesConfig[currencies[action.value]],
          index: action.value,
        },
      };
    default:
      return state;
  }
}

export const initialState: State = {
  base: {
    index: 0,
    value: '',
    name: 'EUR',
    config: exchangeCurrenciesConfig.EUR,
  },
  target: {
    index: 3,
    value: '',
    name: 'MXN',
    config: exchangeCurrenciesConfig.EUR,
  },
};
