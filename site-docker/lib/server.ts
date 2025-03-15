export function getEmail(req : Request) {
    let email : string = req.headers.get("x-goog-authenticated-user-email") || "test.user@email.com";

    if (email.includes("accounts.google.com:")) email = email.replace("accounts.google.com:", "");

    return email;
}
