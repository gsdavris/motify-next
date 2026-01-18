import { ApolloClient, HttpLink, InMemoryCache, from, type OperationVariables } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { type DocumentNode } from "graphql";

const normalizeEndpoint = () => {
  const base =
    process.env.NEXT_PUBLIC_WORDPESS_URL ??
    process.env.NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT ??
    process.env.WP_GRAPHQL_ENDPOINT;

  if (!base) {
    return undefined;
  }

  return base.endsWith("/graphql") ? base : `${base.replace(/\/$/, "")}/graphql`;
};

const wpGraphqlEndpoint = normalizeEndpoint();

type ClientOptions = {
  authToken?: string;
  headers?: Record<string, string>;
};

type FetchOptions<TVariables extends OperationVariables> = ClientOptions & {
  query: DocumentNode;
  variables?: TVariables;
  fetchPolicy?: "cache-first" | "cache-only" | "network-only" | "no-cache";
};

const buildClient = ({ authToken, headers }: ClientOptions = {}) => {
  if (!wpGraphqlEndpoint) {
    throw new Error(
      "WP GraphQL endpoint is not configured. Set WP_GRAPHQL_ENDPOINT or NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT."
    );
  }

  const httpLink = new HttpLink({
    uri: wpGraphqlEndpoint,
    fetch,
  });

  const authLink = setContext((_, { headers: existingHeaders }) => ({
    headers: {
      ...existingHeaders,
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(headers ?? {}),
    },
  }));

  const silentOps = new Set(["CompanyInfo", "BlogPageSettings"]);
  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    const opName = operation.operationName || "anonymous";
    const shouldLog = !silentOps.has(opName);
    if (shouldLog && graphQLErrors?.length) {
      console.error(`[WPGraphQL] ${opName} errors`, graphQLErrors);
    }
    if (shouldLog && networkError) {
      console.error(`[WPGraphQL] ${opName} network error`, networkError);
    }
  });

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    cache: new InMemoryCache(),
    link: from([errorLink, authLink, httpLink]),
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  });
};

export const fetchWpGraphql = async <TData = unknown, TVariables extends OperationVariables = OperationVariables>({
  query,
  variables,
  authToken,
  headers,
  fetchPolicy,
}: FetchOptions<TVariables>): Promise<TData> => {
  const client = buildClient({ authToken, headers });
  const result = await client.query<TData, TVariables>({
    query,
    variables,
    fetchPolicy,
  });

  const errorMessages: string[] = [];

  if (result.error) {
    errorMessages.push(result.error.message);
  }

  if (errorMessages.length) {
    const messages = errorMessages.join("; ");
    throw new Error(`WPGraphQL query failed: ${messages}`);
  }

  return result.data;
};

export const createWpApolloClient = (options?: ClientOptions) => buildClient(options);
