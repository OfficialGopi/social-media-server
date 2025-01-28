interface typeSignupUserRequestBody {
  username: string;
  gmail: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  bio?: string;
  gender: "MALE" | "FEMALE" | "OTHERS";
}

interface typeLoginUserRequestBody {
  userAccessDetails: string;
  password: string;
}

export { typeLoginUserRequestBody, typeSignupUserRequestBody };
