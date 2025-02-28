document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("article-form");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const linkInput = document.getElementById("link");
    const articleIdInput = document.getElementById("article-id"); // For editing
    const submitBtn = document.getElementById("submit-btn");
    const cancelEditBtn = document.getElementById("cancel-edit");

    const articlesContainer = document.getElementById("admin-articles");
    const messagesContainer = document.getElementById("admin-messages");

    const API_URL = "http://localhost:5000/articles";
    const CONTACT_API_URL = "http://localhost:5000/contact-messages";

    // Fetch and display articles
    async function fetchArticles() {
        const response = await fetch(API_URL);
        const articles = await response.json();
        renderArticles(articles);
    }

    function renderArticles(articles) {
        articlesContainer.innerHTML = "";
        if (articles.length === 0) {
            articlesContainer.innerHTML = "<p>No articles available.</p>";
            return;
        }

        articles.forEach((article) => {
            const articleCard = document.createElement("div");
            articleCard.classList.add("article-card");
            articleCard.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.content}</p>
                <a href="${article.link}" target="_blank">Read More</a>
                <button onclick="deleteArticle('${article._id}')">Delete</button>
                <button onclick="editArticle('${article._id}', '${article.title}', '${article.content}', '${article.link}')">Edit</button>
            `;
            articlesContainer.appendChild(articleCard);
        });
    }
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop - 70, // Adjust for header height
                behavior: "smooth",
            });
        }
    }
    
    // Fetch and display contact messages
    async function fetchMessages() {
        const response = await fetch(CONTACT_API_URL);
        const messages = await response.json();

        messagesContainer.innerHTML = "";
        if (messages.length === 0) {
            messagesContainer.innerHTML = "<p>No messages available.</p>";
            return;
        }

        messages.forEach((message) => {
            const messageCard = document.createElement("div");
            messageCard.classList.add("message-card");
            messageCard.innerHTML = `
                <p><strong>Name:</strong> ${message.name}</p>
                <p><strong>Email:</strong> ${message.email}</p>
                <p><strong>Message:</strong> ${message.message}</p>
                <p><small>Received on: ${new Date(message.date).toLocaleString()}</small></p>
                <button onclick="deleteMessage('${message._id}')">Delete</button>
            `;
            messagesContainer.appendChild(messageCard);
        });
    }

    // Delete a message
    window.deleteMessage = async function (id) {
        console.log("Deleting message with ID:", id); // Log ID for debugging
        const response = await fetch(`${CONTACT_API_URL}/${id}`, { method: "DELETE" });
        const data = await response.json();
        console.log(data); // Log the server response for debugging
        fetchMessages();
    };

    // Delete an article
    window.deleteArticle = async function (id) {
        console.log("Deleting article with ID:", id); // Log ID for debugging
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        const data = await response.json();
        console.log(data); // Log the server response for debugging
        fetchArticles();
    };

    // Edit an article
    window.editArticle = function (id, title, content, link) {
        articleIdInput.value = id;
        titleInput.value = title;
        contentInput.value = content;
        linkInput.value = link;
        submitBtn.textContent = "Update Article";
        cancelEditBtn.style.display = "inline-block";
    };

    // Cancel editing
    cancelEditBtn.addEventListener("click", function () {
        resetForm();
    });

    function resetForm() {
        articleIdInput.value = "";
        titleInput.value = "";
        contentInput.value = "";
        linkInput.value = "";
        submitBtn.textContent = "Add Article";
        cancelEditBtn.style.display = "none";
    }

    // Handle article form submission (Add or Edit)
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const id = articleIdInput.value;
        const title = titleInput.value;
        const content = contentInput.value;
        const link = linkInput.value;

        const requestData = {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content, link }),
        };

        const endpoint = id ? `${API_URL}/${id}` : API_URL;
        await fetch(endpoint, requestData);

        fetchArticles();
        resetForm();
    });

    // Initial fetch of articles and messages
    fetchArticles();
    fetchMessages();
});

    
    
    
    
    
    
    
    
    
