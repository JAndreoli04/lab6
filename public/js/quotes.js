document.querySelector("#closeModal").addEventListener("click", () => {
    document.querySelector("#authorModal").close();
})

let authorsLinks = document.querySelectorAll("#authorName");
for (let i of authorsLinks) {
    i.addEventListener("click", displayAuthorInfo);
}

async function displayAuthorInfo() {
    let authorId = this.getAttribute("authorID");
    // console.log(authorId);
    let url = "/api/author/" + authorId;
    let response = await fetch(url);
    let data = await response.json();
    console.log(authorId);
    document.querySelector("#authorName") = data[0].firstName + " " + data[0].lastName;
    document.querySelector("#authorPicture").src = data[0].portrait;

    document.querySelector(".authorModal").showModal();
}
