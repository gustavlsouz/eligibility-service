export class Validator<T> {
  constructor(private readonly callback: any) {}
  validate(data: T): boolean {
    return this.callback(data);
  }
}
