let auth0Client;
let accessToken;
let currentUser;

async function initAuth() {
  auth0Client = await createAuth0Client({
    domain: CONFIG.AUTH0_DOMAIN,
    client_id: CONFIG.AUTH0_CLIENT_ID,
    cacheLocation: 'localstorage',
    useRefreshTokens: true
  });

  const query = window.location.search;
  if (query.includes('code=') && query.includes('state=')) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    document.getElementById('app').style.display = 'block';
    document.getElementById('login-area').style.display = 'none';
    const user = await auth0Client.getUser();
    currentUser = user.nickname;
    document.getElementById('welcome').textContent = `Welcome, ${currentUser}`;
    accessToken = await auth0Client.getTokenSilently({
      audience: 'https://api.github.com/',
      redirect_uri: window.location.origin + window.location.pathname
    });
    onAuthenticated();
  }
}

document.getElementById('login').addEventListener('click', () => {
  auth0Client.loginWithRedirect({
    redirect_uri: window.location.origin + window.location.pathname
  });
});
