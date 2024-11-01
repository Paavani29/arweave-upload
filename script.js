async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const uploadButton = document.getElementById("uploadButton");
    const loadingMessage = document.getElementById("loadingMessage");
    const linkMessage = document.getElementById("linkMessage");
    const fileLink = document.getElementById("fileLink");

    // Check if a file has been selected
    if (fileInput.files.length === 0) {
        alert("Please select a file first.");
        return;
    }

    // Get the selected file
    const file = fileInput.files[0];

    // Display loading message and disable the button
    loadingMessage.style.display = "block";
    uploadButton.disabled = true;

    // Prepare the form data for the backend
    const formData = new FormData();
    formData.append("file", file);

    try {
        // Send file to the backend
        const response = await fetch("http://localhost:3000/upload", { // Change to your deployed backend URL later
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            // Hide loading message, display link, and enable the button
            loadingMessage.style.display = "none";
            linkMessage.style.display = "block";
            fileLink.href = result.link; // Assuming your backend returns { link: <url> }
            fileLink.textContent = result.link;
        } else {
            alert("File upload failed. Please try again.");
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("An error occurred. Please try again.");
    } finally {
        // Reset UI state
        uploadButton.disabled = false;
    }
}