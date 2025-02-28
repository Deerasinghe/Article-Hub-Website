document.addEventListener("DOMContentLoaded", async function () {
    const articlesContainer = document.getElementById("articles");
    const response = await fetch("http://localhost:5000/articles");
    const articles = await response.json();
    
    articles.forEach(article => {
        const articleCard = document.createElement("div");
        articleCard.classList.add("article-card");
        articleCard.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.content}</p>
            <a href="${article.link}" target="_blank">Read More</a>
        `;
        articlesContainer.appendChild(articleCard);
    });
});
