export function jsonStringifier(json: any): String {
  return JSON.stringify(json, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}

class Base62 {
  private readonly base: bigint = BigInt(62);
  private readonly charset: string[] = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  public encode(integer: string): string {
    if (Number(integer) === 0) {
      return '0';
    }

    let num: bigint = BigInt(integer);
    let str: string[] = [];

    while (num > 0) {
      str = [this.charset[Number(num % this.base)], ...str];
      num = num / this.base;
    }

    return str.join('');
  }

  // public decode(str: string): string {
  //   return str.split('').reverse().reduce(
  //     (prev: bigint, char: string, i: number) =>
  //       prev + (BigInt(this.charset.indexOf(char)) * (this.base ** BigInt(i))),
  //     BigInt(0)).toString();
  // }
}

export const base62: Base62 = new Base62();