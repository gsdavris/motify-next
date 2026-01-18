const HeroSectionFragment = `
  herosection {
    description
    title
    subtitle
    mode
    image {
      altText
      sourceUrl
    }
    contactButton
    contactLabel
    ctas
    cta {
      label
      type
      url
      urlType
      path {
        ... on Post {
          id
          title
          uri
        }
        ... on Page {
          id
          title
          uri
        }
        ... on MediaItem {
          id
          title
          uri
        }
        ... on Project {
          id
          title
          uri
        }
        ... on Service {
          id
          title
          uri
        }
        ... on Testimonial {
          id
          title
          uri
        }
      }
    }
    cta1 {
      label
      type
      url
      urlType
        path {
        ... on Post {
          id
          title
          uri
        }
        ... on Page {
          id
          title
          uri
        }
        ... on MediaItem {
          id
          title
          uri
        }
        ... on Project {
          id
          title
          uri
        }
        ... on Service {
          id
          title
          uri
        }
        ... on Testimonial {
          id
          title
          uri
        }
      }
    }
    cta2 {
      label
      type
      url
      urlType
        path {
        ... on Post {
          id
          title
          uri
        }
        ... on Page {
          id
          title
          uri
        }
        ... on MediaItem {
          id
          title
          uri
        }
        ... on Project {
          id
          title
          uri
        }
        ... on Service {
          id
          title
          uri
        }
        ... on Testimonial {
          id
          title
          uri
        }
      }
    }
  }
`;

export default HeroSectionFragment;