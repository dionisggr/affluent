
import utils from './utils';

const baseUrl = {
  development: 'http://localhost:8000/promptwiz',
  production: import.meta.env.VITE_API_URL + '/promptwiz',
}[import.meta.env.VITE_NODE_ENV];

async function get(path) {
  const request = async () => {
    const token = utils.getFromLocalStorage('token');
    return await fetch(baseUrl + path, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  let response = await request();

  if (!response.ok) {
    const error = await response.json();

    if (error.message.includes('jwt')) {
      const reauthorization = await reauthorize();

      if (!reauthorization.ok) {
        window.localStorage.removeItem('promptwiz');
        throw new Error('Unauthorized request.');
      }

      response = await request();
    } else {
      throw new Error(error.message);
    }
  }

  return await response.json();
}

async function post(path, data = {}, customToken) {
  const request = async () => {
    const token = utils.getFromLocalStorage('token');
    return await fetch(baseUrl + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customToken || token}`
      },
      body: JSON.stringify(data)
    });
  }

  let response = await request();

  if (!response.ok) {
    const error = await response.json();

    if (error.message.includes('jwt')) {
      const refreshToken = utils.getFromLocalStorage('refreshToken');
      const reauthorization = await reauthorize();

      if (!reauthorization.ok) {
        window.localStorage.removeItem('promptwiz');
        throw new Error('Unauthorized request.');
      }

      response = await request();
    } else {
      throw new Error(error.message);
    }
  }

  return await response.json();
}

async function patch(path, data = {}, customToken) {
  const request = async () => {
    const token = utils.getFromLocalStorage('token');
    return await fetch(baseUrl + path, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customToken || token}`
      },
      body: JSON.stringify(data)
    });
  }

  let response = await request();

  if (!response.ok) {
    const error = await response.json();

    if (error.message.includes('jwt')) {
      const reauthorization = await reauthorize();

      if (!reauthorization.ok) {
        window.localStorage.removeItem('promptwiz');
        throw new Error('Unauthorized request.');
      }

      response = await request();
    } else {
      throw new Error(error.message);
    }
  }

  return await response.json();
}

async function remove(path) {
  const request = async () => {
    const token = utils.getFromLocalStorage('token');
    return await fetch(baseUrl + path, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  let response = await request();

  if (!response.ok) {
    const error = await response.json();

    if (error.message.includes('jwt')) {
      const reauthorization = await reauthorize();

      if (!reauthorization.ok) {
        window.localStorage.removeItem('promptwiz');
        throw new Error('Unauthorized request.');
      }

      response = await request();
    } else {
      throw new Error(error.message);
    }
  }

  return response;
}

async function reauthorize() {
  const request = async () => {
    const refreshToken = utils.getFromLocalStorage('refreshToken');

    if (refreshToken) {
      return await fetch(baseUrl + '/reauthorize', {
        method: 'POST',
        headers: { Authorization: `Bearer ${refreshToken}` }
      });
    }

    return { ok: false };
  };

  return await request();
}

const service = { get, post, patch, remove, reauthorize };

export default service;
