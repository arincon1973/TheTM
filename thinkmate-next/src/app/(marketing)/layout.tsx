/**
 * Marketing Layout
 * Layout specific to marketing pages (landing page, etc.)
 * Inherits from root layout (already has Navbar and Footer)
 */

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
