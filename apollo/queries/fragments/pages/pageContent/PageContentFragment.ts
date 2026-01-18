import HeroSectionFragment from "./HeroSectionFragment";
import InfoTextFragment from "./InfoTextFragment";
import ContactSectionFragment from "./ContactSectionFragment";
import ContentFragment from "./ContentFragment";
import ServicesSectionFragment from "./ServicesSectionFragment";
import ProjectsSectionFragment from "./ProjectsSectionFragment";
import TestimonialsSectionFragment from "./TestimonialsSectionFragment";
import StatsFragment from "./StatsFragment";
import ValuesFragment from "./ValuesFragment";
import ProcessFragment from "./ProcessFragment";
import TeamFragment from "./TeamFragment";
import PostsSectionFragment from "./PostsSectionFragment";

const PageContentFragment = `
 pageContent {
    pageSections
    ${InfoTextFragment}
    ${HeroSectionFragment}
    ${ContactSectionFragment}
    ${ContentFragment}
    ${ServicesSectionFragment}
    ${ProjectsSectionFragment}
    ${TestimonialsSectionFragment}
    ${PostsSectionFragment}
    ${StatsFragment}
    ${ValuesFragment}
    ${ProcessFragment}
    ${TeamFragment}
  }
`;

export default PageContentFragment;
