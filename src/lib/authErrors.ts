export function getAuthError(message: string): string {
  const m = message.toLowerCase();

  if (m.includes("already registered") || m.includes("already exists") || m.includes("user already"))
    return "An account with this email already exists.";
  if (m.includes("invalid login credentials") || m.includes("invalid credentials"))
    return "Incorrect email or password.";
  if (m.includes("email not confirmed"))
    return "Please confirm your email before signing in.";
  if (m.includes("password should be") || m.includes("password is too short"))
    return "Password is too weak. Please choose a stronger password.";
  if (m.includes("rate limit") || m.includes("too many requests") || m.includes("too many"))
    return "Too many attempts. Please wait a moment and try again.";
  if (m.includes("network") || m.includes("fetch") || m.includes("failed to fetch"))
    return "Connection error. Please check your internet and try again.";
  if (m.includes("invalid email"))
    return "Please enter a valid email address.";
  if (m.includes("weak password"))
    return "Password is too weak. Please choose a stronger one.";
  if (m.includes("token") || m.includes("expired") || m.includes("invalid"))
    return "This link has expired. Please request a new one.";

  return "Something went wrong. Please try again.";
}
