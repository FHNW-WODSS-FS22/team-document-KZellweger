function logout() {
  localStorage.removeItem('localUser');
}

function login(username, password) {
  return fetch(`${process.env.REACT_APP_BACKEND_BASE}/authentication`, {
    method: 'GET',
    headers: { Authorization: `Basic ${window.btoa(`${username}:${password}`)}` },
  }).then((response) => response.json().then((data) => {
    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  })).then((user) => {
    if (user) {
      // eslint-disable-next-line no-param-reassign
      user.authdata = window.btoa(`${username}:${password}`);
      localStorage.setItem('localUser', JSON.stringify(user));
    }
  });
}

// eslint-disable-next-line import/prefer-default-export
export const loginService = {
  login,
  logout,
};
