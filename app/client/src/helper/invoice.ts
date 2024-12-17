export class Invoice {
  private static numbers() {
    const now = Date.now();
    const randomPart = Math.floor(Math.random() * 1000);
    const uniqueNumber = `${now}${randomPart}`.slice(-9);
    const result = parseInt(uniqueNumber, 10);
    return result;
  }

  public static supplier() {
    return "SPP" + this.numbers();
  }

  public static customer() {
    return "CST" + this.numbers();
  }
}
