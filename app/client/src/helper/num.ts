export class Num {
  static format(
    amount: number,
    separator: string = ",",
    decimalPlaces: number = 2
  ): string {
    if (isNaN(amount)) {
      throw new Error("Invalid number");
    }

    // Split the number into integer and decimal parts
    const [integerPart, decimalPart = ""] = amount.toString().split(".");

    // Format the integer part with the separator
    const formattedInteger = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      separator
    );

    // Preserve the original decimal part (up to the specified precision)
    const trimmedDecimal = decimalPart.slice(0, decimalPlaces);

    // Return the result with or without decimals
    return trimmedDecimal
      ? `${formattedInteger}.${trimmedDecimal}`
      : formattedInteger;
  }

  static parse(formatted: string, separator: string = ","): number {
    if (typeof formatted !== "string") {
      throw new Error("Input must be a string");
    }

    // Remove thousands separator and convert to a number
    const plainString = formatted.replace(
      new RegExp(`\\${separator}`, "g"),
      ""
    );
    const numericValue = parseFloat(plainString);

    if (isNaN(numericValue)) {
      throw new Error("Invalid formatted number");
    }

    return numericValue;
  }
}
