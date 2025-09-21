import { ProLayoutProps } from "@ant-design/pro-components";
import _ from "lodash";
import { Link } from "react-router-dom";

import {
  AdminIcon,
  COIcon,
  DashboardIcon,
  InventoryIcon,
  MaterialIcon,
  ProductIcon,
} from "@/assets/svg";
import { LOCAL_USER, SEARCH_FROM_DASH } from "@/constant/config";
import { IUser } from "@/types/user";
import { HOME_URL, USER_URL } from "@/urls";
import { storageService } from "@/utils/storage";

const icons = [
  <COIcon />,
  <MaterialIcon />,
  <ProductIcon />,
  <InventoryIcon />,
  <DashboardIcon />,
  <AdminIcon />,
  <AdminIcon />,
  <AdminIcon />,
  <AdminIcon />,
  <AdminIcon />,
];

const listNeedParams = [USER_URL];

const generateRoutes = (tree: any[] = []) => {
  const routes: any[] = [];
  if (tree.length === 0) return routes;

  // Drunk
  const user: IUser = storageService.getStorage(LOCAL_USER);

  const cloneTree = _.sortBy(tree, "sort_order");

  for (let i = 0; i < cloneTree.length; i++) {
    if (cloneTree[i].role && user.position_id !== cloneTree[i].role) continue;

    // Set params if true
    const url =
      cloneTree[i].url +
      (listNeedParams.includes(cloneTree[i].url)
        ? `?${SEARCH_FROM_DASH}=1`
        : "");
    const route = {
      key: cloneTree[i].key,
      icon: cloneTree[i].level == 1 ? icons[i] : icons[i],
      path: cloneTree[i].url,
      title: cloneTree[i].title,
      name: (
        <Link preventScrollReset to={url}>
          {cloneTree[i].title}
        </Link>
      ),
      routes: generateRoutes(cloneTree[i].children),
      sort: cloneTree[i].sort_order,
    };

    routes.push(route);
  }

  return routes;
};

export const appRoute = (functions: any[]): ProLayoutProps["route"] => {
  const routes = [...generateRoutes(functions)];
  return {
    path: HOME_URL,
    routes,
  };
};
