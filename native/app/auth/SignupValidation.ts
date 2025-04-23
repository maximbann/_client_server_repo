export function validateSignup(values: {
    name: string;
    email: string;
    password: string;
  }): string[] {
    const errors: string[] = [];
  
    if (values.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters.");
    }
  
    if (!values.email.includes("@")) {
      errors.push("Invalid email address.");
    }
  
    if (values.password.length < 6) {
      errors.push("Password must be at least 6 characters.");
    }
  
    return errors;
  }
  