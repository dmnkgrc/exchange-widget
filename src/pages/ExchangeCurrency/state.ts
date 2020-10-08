import { currencies } from '../../config/currencies';
import {
  Currency,
  CurrencyConfig,
  currenciesConfig,
} from '../../config/currencies';
import type { ExchangeResult } from './../../types/exchange-result';
import { getDecimalPlaces } from '../../utils/numbers';

type AmountInputValue = number | '';

interface AmountsState {
  value: AmountInputValue;
  index: number;
  name: Currency;
  config: CurrencyConfig;
}

export interface State {
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
  | { type: 'SetBaseIndex' | 'SetTargetIndex'; value: number }
  | { type: 'SetBaseCurrency' | 'SetTargetCurrency'; value: Currency };

// Returns the correct value for the target currency
function getTargetValue(value: AmountInputValue, exchangeRate?: number) {
  let targetValue = value;
  if (value !== '') {
    targetValue = exchangeRate ? exchangeRate * value : '';
  }
  return targetValue;
}

// Returns the correct value for the base currency
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

function isValueValid(value: AmountInputValue): boolean {
  if (value === '') {
    return true;
  } else if (isNaN(value)) {
    return false;
  }
  return getDecimalPlaces(value) <= 2 && value >= 0;
}

/**
 * Exchange reducer manages the state for the exchange
 *
 * The reason to use a reducer instead of normal state is that
 * the base currency and target currency are highly coupled,
 * so managing it using a recucer is simpler for this task.
 *
 * With more time I would probably split this reducer a little bit,
 * so that it does not become too complex in the future
 */
export function exchangeReducer(state: State, action: AmountsAction): State {
  switch (action.type) {
    case 'SetBaseAmount':
      if (!isValueValid(action.value)) {
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
      if (!isValueValid(action.value)) {
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
        target: {
          ...state.target,
          value: getTargetValue(
            state.base.value,
            action.value?.[state.target.name]
          ),
        },
      };
    case 'SetBaseIndex':
      return {
        ...state,
        base: {
          ...state.base,
          name: currencies[action.value],
          config: currenciesConfig[currencies[action.value]],
          index: action.value,
        },
        target: {
          ...state.target,
          value: getTargetValue(
            state.base.value,
            state.rates?.[state.target.name]
          ),
        },
      };
    case 'SetTargetIndex':
      return {
        ...state,
        target: {
          ...state.target,
          name: currencies[action.value],
          config: currenciesConfig[currencies[action.value]],
          index: action.value,
          value: getTargetValue(
            state.base.value,
            state.rates?.[currencies[action.value]]
          ),
        },
      };
    case 'SetBaseCurrency':
      return {
        ...state,
        base: {
          ...state.base,
          name: action.value,
          config: currenciesConfig[action.value],
          index: currencies.indexOf(action.value),
        },
      };
    case 'SetTargetCurrency':
      return {
        ...state,
        target: {
          ...state.target,
          name: action.value,
          config: currenciesConfig[action.value],
          index: currencies.indexOf(action.value),
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
    config: currenciesConfig.EUR,
  },
  target: {
    index: 3,
    value: '',
    name: 'MXN',
    config: currenciesConfig.MXN,
  },
};
