const ServicesSectionFragment = `
  servicessection {
    description
    title
    subtitle
    mode
    contactButton
    contactLabel
    services {
      ... on Service {
        id
        title
        content
        excerpt
        serviceFields {
          icon
        }
        uri
        featuredImage {
          node {
            altText
            sourceUrl
          }
        }
        features {
          nodes {
            slug
            id
            name
          }
        }
      }
    }
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

export default ServicesSectionFragment;
