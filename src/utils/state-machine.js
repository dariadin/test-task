import {get} from 'underscore';

const logger = console;

class StateMachine {
  constructor(states, currentState) {
    this._state = currentState;
    this._transitions = states;
  }

  dispatch(methodName, ...payload) {
    const method = get(this._transitions, [this._state, methodName]);
    if (!method) {
      logger.log({
        level: 'error',
        message: 'method not found',
      });
      return;
    }
    method.apply(this, payload || []);
  }

  setState(newState) {
    if (this._state !== newState) {
      this._state = newState;
    }
  }
}

export default StateMachine;
