import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
  mutation SEND_MESSAGE($input: SendEmailInput!) {
    sendEmail(input: $input) {
      message
      sent
      origin
    }
  }
`;
