const authorModal = document.querySelector("#authorModal");
const closeModalBtn = document.querySelector("#closeModal");
const authorNameEl = document.querySelector("#authorName");
const authorPictureEl = document.querySelector("#authorPicture");
const authorLinks = document.querySelectorAll(".authorName");

closeModalBtn.addEventListener("click", () => {
    authorModal.close();
});

for (const link of authorLinks) {
    link.addEventListener("click", displayAuthorInfo);
}

async function displayAuthorInfo(event) {
    event.preventDefault();

    let authorId = this.getAttribute("data-author-id");
    let url = "/api/author/" + authorId;
    let response = await fetch(url);
    let data = await response.json();

    authorNameEl.textContent = data[0].firstName + " " + data[0].lastName;
    authorPictureEl.src = data[0].portrait;

    document.querySelector("#biography").textContent = data[0].biography;
    document.querySelector("#country").textContent = data[0].country;
    document.querySelector("#dob").textContent = data[0].dob;
    if(data[0].dod != null){
        document.querySelector("#dod").textContent = data[0].dod;
    }
    document.querySelector("#profession").textContent = data[0].profession;
    document.querySelector("#sex").textContent = data[0].sex;


    authorModal.showModal();
}
