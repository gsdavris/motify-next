const TestimonialsSectionFragment = `
  testimonialssection {
    description
    title
    subtitle
    mode
    contactButton
    contactLabel
    testimonials {
      ... on Testimonial {
        id
        title
        content
        excerpt
        testimonialFields {
          metricIcon
          metricLabel
          metricValue
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

export default TestimonialsSectionFragment;
