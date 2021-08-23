class Validator {
  constructor(strategies) {
    if (!strategies) {
      console.log('missed strategies for validator');
      return;
    }
    this._strategies = strategies;
  }

  validate(value) {
    const errors = [];
    this._strategies.forEach((strategy) => {
      const error = strategy(value);
      if (error) {
        errors.push(error);
      }
    });
    return errors;
  }
}

export default Validator;
