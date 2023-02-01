export function jsonStringifier(json: any): string {
  return JSON.stringify(json, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}

export function genRandomString(length: number): string {
  let result:             string = '';
  const characters:       string = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength: number = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

class Base62 {
  private readonly base: bigint = BigInt(62);
  private readonly charset: string[] = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  public encode(integer: number): string {
    if (integer === 0) {
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