import Head from "next/head";

export const Header: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <Head>
      <title>{`${title ? title + " | " : ""}Matly`}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta
        property="og:title"
        content={`${title ? title + " | " : ""}Matly`}
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://matly.fun" />
      <meta
        property="og:description"
        content="Bringing ruthless competition back to numbers."
      />
    </Head>
  );
};
