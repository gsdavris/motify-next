import HeaderClient from "./HeaderClient";
import { type HeaderContent } from "@/lib/types/site-content";
import { type Locale } from "@/lib/i18n";
import { type LocaleSlugMap } from "@/lib/wp-slug-maps";

const Header = ({
  isScrolled,
  header,
  blogSlugs,
  pageSlugMap,
  postSlugMap,
  categorySlugMap,
  projectSlugMap,
}: {
  isScrolled: boolean;
  header: HeaderContent;
  blogSlugs?: Partial<Record<Locale, string>>;
  pageSlugMap?: LocaleSlugMap;
  postSlugMap?: LocaleSlugMap;
  categorySlugMap?: LocaleSlugMap;
  projectSlugMap?: LocaleSlugMap;
}) => {
  return (
    <HeaderClient
      isScrolled={isScrolled}
      blogSlugs={blogSlugs}
      pageSlugMap={pageSlugMap}
      postSlugMap={postSlugMap}
      categorySlugMap={categorySlugMap}
      projectSlugMap={projectSlugMap}
      {...header}
    />
  );
};

export default Header;
