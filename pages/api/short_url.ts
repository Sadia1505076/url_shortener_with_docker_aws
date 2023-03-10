import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { base62, genRandomString } from 'lib/helper';
import moment from 'moment';
import { EXPIRE_DAYS, MIN_URL_LENGTH } from '@/lib/global';
import { Tickets64 } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const [_, ticketQueryResult] = await prisma.$transaction([
      prisma.$queryRaw<Tickets64>`REPLACE INTO Tickets64 (stub) VALUES ('a');`,
      prisma.tickets64.findFirst({
        where: {
          stub: 'a'
        }
      })
      // probably last_insert_id() is faster, but due to replacing the row, there will always be one
      // entry in the table. So select shouldn't be performance expensive.
    ]);

    if(ticketQueryResult != null) {
      try {
        let ticket:    number = Number(ticketQueryResult.id);
        let short_url: string = base62.encode(ticket);
        if (short_url.length < MIN_URL_LENGTH) {
          short_url = genRandomString(3 - short_url.length) + short_url;
        };
        let current_date: moment.Moment = moment();
        let expire_date:  moment.Moment = moment().add(EXPIRE_DAYS, 'days');

        await prisma.url.create({
          data: {
            ticket:     BigInt(ticket),
            long_url:   req.body.url, 
            expire_on:  expire_date.toDate(),
            created_on: current_date.toDate(),
            short_url,
          }
        });
        return res.status(201).json({short_url: short_url});
      }
      catch(error)  {
        return res.status(500).json("Failed to capture ticket!" + error);
      }
    }
    return res.status(500).json("Failed to capture ticket!");
  }
  return res.send('Method not allowed.');
}
