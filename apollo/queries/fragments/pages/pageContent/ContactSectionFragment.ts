const ContactSectionFragment = `
  contact {
    title
    subtitle
    description
    features
    privacyPolicy {
      ... on Page {
        id
        slug
        uri
        title
      }
    }
  }
`;

export default ContactSectionFragment;