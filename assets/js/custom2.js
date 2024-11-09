document.addEventListener("DOMContentLoaded", function() {
    const subscribeForm = document.getElementById("subscribe");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");

    subscribeForm.addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevents the form from submitting normally

        const formData = new FormData();
        formData.append("name", nameInput.value);
        formData.append("email", emailInput.value);

        try {
            const response = await fetch("processCml.php", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                // Clear the form inputs
                nameInput.value = "";
                emailInput.value = "";

                // Display a thank you message
                displayThankYouMessage();
            } else {
                alert("There was an error. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("There was an error. Please try again.");
        }
    });

    function displayThankYouMessage() {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("thank-you-message");
        messageDiv.textContent = "Thank you for subscribing to our mailing list!";
        subscribeForm.appendChild(messageDiv);

        // Automatically remove the message after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
});
