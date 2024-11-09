document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact");
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = new FormData(form);

    try {
      // Send form data to the server
      const response = await fetch("processCm.php", {
        method: "POST",
        body: formData,
      });

      // Parse JSON response
      const result = await response.json();

      // Display message
      const messageBox = document.createElement("div");
      messageBox.className = result.success ? "alert alert-success" : "alert alert-danger";
      messageBox.textContent = result.message;

      // Append message box to the form container
      form.parentElement.appendChild(messageBox);

      // Clear form if successful
      if (result.success) form.reset();
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  });
});
