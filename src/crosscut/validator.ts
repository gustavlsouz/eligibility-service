export class Validator<T> {
  constructor(private readonly callbacks: any[]) {}
  validate(data: T): boolean {
    for (const validatorCallback of this.callbacks) {
      const isValid = validatorCallback(data);
      if (!isValid) {
        return false;
      }
    }
    return true;
  }
}
