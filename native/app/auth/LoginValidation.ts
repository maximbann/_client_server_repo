export function validateLogin(values: {
    email: string;
    password: string;
  }): string[] {
    const errors: string[] = [];
  
    if (!values.email.includes("@")) {
      errors.push("Invalid email address.");
    }
  
    if (values.password.length < 6) {
      errors.push("Password must be at least 6 characters.");
    }
  
    return errors;
  }
  