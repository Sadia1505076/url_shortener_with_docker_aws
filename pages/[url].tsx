import prisma from 'lib/prisma';
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({query}) => {
  console.log(query.url);
  let short_url = query.url?.toString() || ""
  const views = await prisma.url.findFirst({
    where: {
      short_url
    }
  });
  console.log(views);
  return {
    redirect: {
      destination: views != null ? views.long_url : 'https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript',
      permanent: false,
    },
  }
}
