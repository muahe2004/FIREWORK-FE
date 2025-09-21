import { t } from "i18next";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { BranchPage } from "./modules/administration/branch";
import { DepartmentPage } from "./modules/administration/department";
import { FeaturePage } from "./modules/administration/feature";
import { RolePage } from "./modules/administration/role";
import { UserPage } from "./modules/administration/user";
import AppLayout from "./modules/app/AppLayout";
import ProtectedComponent from "./modules/app/ProtectComponent";
import { LoginPage } from "./modules/auth";
import { ErrorBoundaryPage } from "./modules/error/boundary";
import {
  AUTHORIZATION_URL,
  BRANCH_URL,
  DEPARTMENT_URL,
  FEATURE_URL,
  LOGIN_URL,
  ROLE_URL,
  USER_URL,
} from "./urls";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: (
      <AppLayout>
        <ErrorBoundaryPage />
      </AppLayout>
    ),
    children: [
      // Authorization
      {
        path: AUTHORIZATION_URL,
        element: <Navigate to={USER_URL} />,
      },
      {
        path: BRANCH_URL,
        element: (
          <ProtectedComponent
            Element={BranchPage}
            title={t("nav.branch")}
            url={BRANCH_URL}
          />
        ),
      },
      {
        path: DEPARTMENT_URL,
        element: (
          <ProtectedComponent
            Element={DepartmentPage}
            title={t("nav.department")}
            url={DEPARTMENT_URL}
          />
        ),
      },
      {
        path: USER_URL,
        element: (
          <ProtectedComponent
            Element={UserPage}
            title={t("nav.user")}
            url={USER_URL}
          />
        ),
      },
      {
        path: FEATURE_URL,
        element: (
          <ProtectedComponent
            Element={FeaturePage}
            title={t("nav.feature")}
            url={FEATURE_URL}
          />
        ),
      },
      {
        path: ROLE_URL,
        element: (
          <ProtectedComponent
            Element={RolePage}
            title={t("nav.role")}
            url={ROLE_URL}
          />
        ),
      },
    ],
  },
  {
    path: LOGIN_URL,
    element: (
      <ProtectedComponent
        Element={LoginPage}
        title={t("nav.login")}
        url={LOGIN_URL}
      />
    ),
  },
]);
