import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { customJsonStringify,  base62, genRandomString } from 'lib/helper';
import moment from 'moment';
import { EXPIRE_DAYS, MIN_URL_LENGTH } from '@/lib/global';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const [_, ticketQueryResult] = await prisma.$transaction([
      prisma.$queryRaw`REPLACE INTO Tickets64 (stub) VALUES ('a');`,
      prisma.$queryRaw`SELECT LAST_INSERT_ID();`
    ])
    let jsonStringifiedResult: string   = customJsonStringify(ticketQueryResult);
    let splittedResult:        string[] = jsonStringifiedResult.split(/[\[\]{}:"]/).filter(s => s != "");
    if(splittedResult.length >= 1) {
      let ticketAsString: string = splittedResult[1];
      try {
        let ticket:    number = +ticketAsString;
        let short_url: string = base62.encode(ticket);
        if (short_url.length < MIN_URL_LENGTH) {
          short_url = genRandomString(3 - short_url.length) + short_url;
        };
        let current_date = moment();
        let expire_date = moment().add(EXPIRE_DAYS, 'days');

        await prisma.url.create({
          data: {
            ticket:     BigInt(ticket),
            long_url:   req.body.url,
            expire_on:  expire_date.toDate(),
            created_on: current_date.toDate(),
            short_url,
          }
        });
        return res.status(200).json(short_url);
      }
      catch(error)  {
        return res.status(500).json("Failed to capture ticket!" + error);
      }
    }
    return res.status(500).json("Failed to capture ticket!");
  }
  return res.send('Method not allowed.');
}
