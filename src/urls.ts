const LOGIN_URL = "/login";

// Authorization
const AUTHORIZATION_URL = "/authorization";
const BRANCH_URL = `${AUTHORIZATION_URL}/branches`;
const DEPARTMENT_URL = `${AUTHORIZATION_URL}/departments`;
const USER_URL = `${AUTHORIZATION_URL}/users`;
const FEATURE_URL = `${AUTHORIZATION_URL}/functions`;
const ROLE_URL = `${AUTHORIZATION_URL}/roles`;

const HOME_URL = AUTHORIZATION_URL;

export {
  HOME_URL,
  LOGIN_URL,

  // Authorization
  AUTHORIZATION_URL,
  BRANCH_URL,
  DEPARTMENT_URL,
  USER_URL,
  FEATURE_URL,
  ROLE_URL,
};
