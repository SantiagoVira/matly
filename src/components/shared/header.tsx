import Head from "next/head";

export const Header: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <Head>
      <title>{`${title ? title + " | " : ""}Neighbors`}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta
        property="og:title"
        content={`${title ? title + " | " : ""}Neighbors`}
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="" />
      <meta
        property="og:description"
        content="Because digital is better than paper."
      />
    </Head>
  );
};
