import prisma from 'lib/prisma';
import moment from 'moment';
import { GetServerSideProps } from "next";

export default function dummy() {
  // dummy default export for the redirection to work
}

export const getServerSideProps: GetServerSideProps = async ({query}) => {
  let short_url:   string | null = query.url?.toString() || null;
  let destination: string        = "/404";
  if (short_url != null && short_url != undefined && short_url.length > 0) {
    const views = await prisma.url.findFirst({
      where: {
        short_url
      }
    });
    if (views != null && views.expire_on > moment().toDate()) destination = views.long_url;
  }
  return {
    redirect: {
      destination: destination,
      permanent:   false,
    }
  }
}