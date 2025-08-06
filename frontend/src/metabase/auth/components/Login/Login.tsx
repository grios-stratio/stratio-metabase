// < STRATIO import useEffect, useNavigationType and reload
import { useEffect } from "react";
// STRATIO >
import { useMount } from "react-use";
import { t } from "ttag";
import _ from "underscore";

import { usePageTitle } from "metabase/hooks/use-page-title";
import type { AuthProvider } from "metabase/plugins/types";
import { useSelector } from "metabase/redux";
import {
  prefetchPage,
  // < STRATIO
  useNavigationType,
  // STRATIO >
  useParams,
  useSearchParams,
} from "metabase/router";
import { getApplicationName } from "metabase/selectors/whitelabel";
import { Box, Divider } from "metabase/ui";
// < STRATIO
import { reload } from "metabase/utils/dom";
// STRATIO >

// < STRATIO import getSSOEnabled selector and AuthCardButton
import {
  getAuthProviders,
  getSSOEnabled,
  getStratioLogoutUrl,
} from "../../selectors";
import { AuthCardButton } from "../AuthButton";
// STRATIO >
import { AuthLayout } from "../AuthLayout";

type LoginQueryParams = {
  provider: string;
};

export const Login = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const params = useParams<LoginQueryParams>();
  const providers = useSelector(getAuthProviders);
  const selection = getSelectedProvider(providers, params.provider);
  const redirectUrl = searchParams.get("redirect") ?? undefined;
  const applicationName = useSelector(getApplicationName);
  // < STRATIO
  const gosecSSOEnabled = useSelector(getSSOEnabled);
  const stratioLogoutUrl = useSelector(getStratioLogoutUrl);
  const navigationType = useNavigationType();

  // login via headers/jwt - reload page when sent to auth/login so that oauthredirect or autologin kicks in
  useEffect(() => {
    const hasBeenRedirected = navigationType !== "POP";
    if (gosecSSOEnabled && hasBeenRedirected) {
      reload();
    }
  }, [gosecSSOEnabled, navigationType]);
  // STRATIO >

  usePageTitle(t`Login`);

  // Signing in lands on the home page, which is a chunk of its own. Ask for it
  // while the user types, so it is there when they arrive. A login that carries
  // a redirect goes somewhere else, and that page loads on its own terms.
  useMount(() => {
    if (!redirectUrl) {
      prefetchPage("/");
    }
  });

  const [passwordProvider, otherProviders] = _.partition(
    providers,
    (provider) => provider.name === "password",
  );
  // < STRATIO
  if (gosecSSOEnabled) {
    return (
      <AuthLayout>
        <Box
          role="heading"
          c="text-primary"
          fz="1.25rem"
          fw="bold"
          lh="1.5rem"
          ta="center"
        >
          {t`You are not allowed to access ${applicationName}`}
        </Box>
        <AuthCardButton
          onClick={() => (window.location.href = stratioLogoutUrl)}
        >
          {"Logout"}
        </AuthCardButton>
      </AuthLayout>
    );
  }
  // STRATIO >
  return (
    <AuthLayout>
      <Box
        role="heading"
        c="text-primary"
        fz="1.25rem"
        fw="bold"
        lh="1.5rem"
        ta="center"
      >
        {t`Sign in to ${applicationName}`}
      </Box>
      {selection && selection.Panel && (
        <Box mt="2.5rem">
          <selection.Panel redirectUrl={redirectUrl} />
        </Box>
      )}
      {!selection && (
        <Box mt="3.5rem">
          {otherProviders.map((provider) => (
            <Box key={provider.name} mt="2rem" ta="center">
              <provider.Button isCard={true} redirectUrl={redirectUrl} />
            </Box>
          ))}
          {passwordProvider.map((provider) => (
            <>
              <Divider mt="2rem" />
              <Box key={provider.name} mt="1rem" ta="center">
                <provider.Button isCard={true} redirectUrl={redirectUrl} />
              </Box>
            </>
          ))}
        </Box>
      )}
    </AuthLayout>
  );
};

const getSelectedProvider = (
  providers: AuthProvider[],
  providerName?: string,
): AuthProvider | undefined => {
  const provider =
    providers.length > 1
      ? providers.find((p) => p.name === providerName)
      : providers[0];

  return provider?.Panel ? provider : undefined;
};
