
const isValidEmail = (email: string) => {
  // eslint-disable-next-line max-len
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email.toLowerCase());
};

const isValidPhoneNumber = (phoneNumber: string) => {
  // eslint-disable-next-line max-len
  // Regex to check vietnamese phone number format
  const phoneNumberRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
  return phoneNumberRegex.test(phoneNumber.toLowerCase());
};
export {
  isValidEmail,
  isValidPhoneNumber,
};
