function validateCheckoutForm() {
    const fullName = document.getElementById("full-name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    const nameRegex = /^[a-zA-Z\s]{3,50}$/;
    const phoneRegex = /^01[3-9]\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(fullName)) {
        alert("Please enter a valid name (3-50 alphabetic characters).");
        return false;
    }
    if (!phoneRegex.test(phone)) {
        alert("Please enter a valid BD phone number (11 digits).");
        return false;
    }
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    return true;
}
