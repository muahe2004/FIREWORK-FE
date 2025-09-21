import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { UserState } from "@/store/auth/atom";
import { LOGIN_URL } from "@/urls";
import { flattenTree } from "@/utils/array";

import { NotAuthorizationPage } from "../error/403";
import { ErrorTemp } from "../error/ErrorTemp";

const expectedUrls = [LOGIN_URL];

export default function ProtectedComponent({
  Element,
  title = "Firework",
}: {
  Element: any;
  title?: string;
  url?: string;
}) {
  const params = useParams();
  const userRecoil = useRecoilValue(UserState);
  const onNavigate = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    onNavigate();
  }, [window.location.pathname]);

  if (
    isEmpty(params) &&
    !expectedUrls.includes(location.pathname) &&
    userRecoil?.functions &&
    !flattenTree(userRecoil.functions)?.find((i) => i.url === location.pathname)
  )
    return <NotAuthorizationPage />;

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <ErrorBoundary
        FallbackComponent={ErrorTemp}
        key={window.location.pathname}
        onReset={(detail) => {
          console.log(detail);
        }}
      >
        <Element />
      </ErrorBoundary>
    </React.Fragment>
  );
}
