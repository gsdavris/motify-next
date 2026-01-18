import { gql } from "@apollo/client";

import { fetchWpGraphql } from "@/apollo/client";
import { type Locale } from "@/lib/locales";

const COMPANY_INFO_QUERY = gql`
  query CompanyInfo($language: CompanyDetailsLanguageEnum!) {
    companyDetails(where: { language: $language }) {
      bio
      title
      email
      phone
      address
    }
    companySocials {
      name
      location
    }
  }
`;

const languageMap: Record<Locale, string> = {
  en: "EN",
  el: "EL",
};

export type CompanyInfo = {
  bio?: string | null;
  title?: string | null;
  socials: Array<{ name: string; location: string }>;
};

export async function getCompanyInfo(locale: Locale): Promise<CompanyInfo | null> {
  try {
    const language = languageMap[locale] ?? languageMap.en;
    const data = await fetchWpGraphql<{
      companyDetails?: {
        bio?: string | null;
        title?: string | null;
      } | null;
      companySocials?: Array<{ name: string; location: string }>;
    }>({
      query: COMPANY_INFO_QUERY,
      variables: { language },
    });

    return {
      bio: data.companyDetails?.bio ?? null,
      title: data.companyDetails?.title ?? null,
      socials: data.companySocials ?? [],
    };
  } catch (err) {
    console.warn("[WP] company info fetch failed", err);
    return null;
  }
}
