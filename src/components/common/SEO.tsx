import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

export const SEO = ({ title, description, url, image = "https://zyrachat.app/icon.png" }: SEOProps) => {
  const siteTitle = "Zyra | AI Crypto Trading";
  
  return (
    <Helmet>
      <title>{`${title} | ${siteTitle}`}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};
