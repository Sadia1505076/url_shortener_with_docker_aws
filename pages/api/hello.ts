// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { jsonStringifier,  base62 } from 'lib/helper';

function makeid(length: number) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    console.log("post request", req.body);
    const [_, result] = await prisma.$transaction([
      prisma.$queryRaw`REPLACE INTO Tickets64 (stub) VALUES ('a');`,
      prisma.$queryRaw`SELECT LAST_INSERT_ID();`
    ])
    let ticket = jsonStringifier(result).substring(22,24);
    let short_url = base62.encode(ticket) + makeid(19);
    console.log(short_url);

    let bleh = await prisma.url.create({
      data: {
        ticket:    BigInt(ticket),
        long_url:  req.body.url,
        expire_on: new Date(new Date().getDate() + 377880),
        created_on: new Date(new Date().getDate()),
        short_url,
      }
    })
    console.log("data:", bleh);
    return res.status(200).json(short_url);
  }

  return res.send('Method not allowed.');
}
