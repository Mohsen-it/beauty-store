import React from 'react';
import { Head } from '@inertiajs/react';

/**
 * SEO Component for handling meta tags, Open Graph, and Twitter Cards
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Page keywords (comma separated)
 * @param {string} props.canonical - Canonical URL
 * @param {string} props.image - Image URL for social sharing
 * @param {string} props.type - Open Graph type (default: website)
 * @param {string} props.twitterCard - Twitter card type (default: summary_large_image)
 * @param {Object} props.structuredData - JSON-LD structured data
 */
const SEO = ({
  title,
  description,
  keywords,
  canonical,
  image = '/images/default-share.jpg',
  type = 'website',
  twitterCard = 'summary_large_image',
  structuredData = null,
  children
}) => {
  // Prepare the full title with site name
  const siteName = 'CinematicBeauty';
  const fullTitle = `${title} - ${siteName}`;
  
  // Prepare the absolute URL for the image
  const absoluteImageUrl = image.startsWith('http') 
    ? image 
    : `${window.location.origin}${image}`;
  
  // Prepare the canonical URL
  const absoluteCanonical = canonical || window.location.href;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={absoluteCanonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={absoluteCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={absoluteCanonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      
      {/* Structured Data / JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Additional head elements */}
      {children}
    </Head>
  );
};

export default SEO;
