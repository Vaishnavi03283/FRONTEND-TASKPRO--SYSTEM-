export const showToast = (msg, type = "success") => {
  alert(`${type.toUpperCase()}: ${msg}`);
};