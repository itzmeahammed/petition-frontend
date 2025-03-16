import axios from "axios";

const BACKEND_URL = "http://localhost:6777";

// User Login
export function userLogin(data) {
  return axios({
    method: "put",
    url: `${BACKEND_URL}/api/user/signIn`,
    data: data,
  });
}

// User SignUp
export function userSignUp(data) {
  return axios({
    method: "post",
    url: `${BACKEND_URL}/api/user/signUp`,
    data: data,
  });
}

// Get User Data
export function getUser() {
  return axios({
    method: "get",
    url: `${BACKEND_URL}/getUser`,
  });
}

// Update User Data
export function updateUser(data) {
  return axios({
    method: "put",
    url: `${BACKEND_URL}/updateUser`,
    data: data,
  });
}

// Delete User
export function deleteUser() {
  return axios({
    method: "delete",
    url: `${BACKEND_URL}/deleteUser`,
  });
}

export function userSignOut() {
  return axios({
    method: "put",
    url: `${BACKEND_URL}/api/user/signOut`,
    headers: {
      Authorization: `${localStorage.getItem("authToken")}`,
    },
  });
}
export function getPetition(token) {
  return axios({
    method: "get",
    url: `${BACKEND_URL}/api/petition/getPetition`,
    headers: {
      Authorization: token,
    },
  });
}

// Get Petition by Handler
export function getPetitionByHandler() {
  return axios({
    method: "get",
    url: `${BACKEND_URL}/getPetitionByHandler`,
  });
}

export function getPetitionsByUser(token) {
  return axios({
    method: "get",
    url: `${BACKEND_URL}/api/petition/getPetitionsByUser`,
    headers: {
      Authorization: token,
    },
  });
}

export function createPetition(data, token) {
  return axios({
    method: "post",
    url: `${BACKEND_URL}/api/petition/createPetition`,
    headers: {
      Authorization: token, // Pass token in the Authorization header
    },
    data: data,
  });
}

// Update Petition
export function updatePetition(data) {
  return axios({
    method: "put",
    url: `${BACKEND_URL}/updatePetition`,
    data: data,
  });
}

// Delete Petition
export function deletePetition() {
  return axios({
    method: "delete",
    url: `${BACKEND_URL}/deletePetition`,
  });
}
