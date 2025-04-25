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
export function getUser(token) {
  return axios({
    method: "get",
    url: `${BACKEND_URL}/api/user/getUser`,
    headers: {
      Authorization: token,
    },
  });
}

// Update User Data
export function updateUser(data, token) {
  return axios({
    method: "put",
    url: `${BACKEND_URL}/api/user/updateUser`,
    data: data,
    headers: {
      Authorization: token,
    },
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
export function getPetition(token, district, station) {
  // Construct query parameters based on district and station for Admin
  const params = {
    district: district,
    station: station,
  };

  return axios({
    method: "get",
    url: `${BACKEND_URL}/api/petition/getPetition`,
    headers: {
      Authorization: token,
    },
    params: params, // Passing district and station as query params
  });
}

export function getPetitionByHandler(token, district) {
  // Construct query parameters based on district for Super Admin
  const params = {
    handler: "superadmin", // Assuming this is the handler type we want
    district: district, // Only pass district for Super Admin
  };

  return axios({
    method: "get",
    headers: {
      Authorization: token,
    },
    url: `${BACKEND_URL}/api/petition/getPetitionByHandler`,
    params: params, // Passing district as query param
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

export function updatePetition(id, status, token) {
  return axios({
    method: "put",
    url: `${BACKEND_URL}/api/petition/updatePetition`,
    params: {
      id: id, // Send petition ID as a query parameter
    },
    data: {
      status: status, // Send updated status in the request body
    },
    headers: {
      Authorization: token, // Pass token in the Authorization header
    },
  });
}

export function deletePetition() {
  return axios({
    method: "delete",
    url: `${BACKEND_URL}/deletePetition`,
  });
}

export function createFeedback(petitionId, feedbackText, token) {
  return axios({
    method: "post",
    url: `${BACKEND_URL}/api/feedback/createFeedback`,
    headers: {
      Authorization: token,
    },
    data: {
      petition: petitionId,
      feedback: feedbackText,
    },
  });
}

export function getFeedbackByPetition(petitionId, token) {
  return axios({
    method: "get",
    url: `${BACKEND_URL}/api/feedback/getFeedbackByPetition?petition=${petitionId}`,
    headers: {
      Authorization: token,
    },
  });
}
