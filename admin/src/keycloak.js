import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'portfolio-realm',
  clientId: 'admin-ui'
});

export default keycloak;
