// Declaration
const form = document.querySelector(".book-form")
const bookList = document.querySelector(".book-list")
const alertMsg = document.querySelector("#message")
const msgText = document.querySelector("#message p")

// Book Class : Represents book
class Book {
  constructor(title, author, isbn) {
    this.title = title
    this.author = author
    this.isbn = isbn
  }
}

// UI Class : Handle UI Tasks
class UI {
  // About Books
  static displayBooks() {
    const books = Store.getBooks()

    books.forEach(book => UI.addToList(book))
  }

  // Add Books to UI
  static addToList(book) {
    bookList.innerHTML += `
    <tr>
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td class="close">
      <div><span class="remove">X</span></div>
    </td>
  </tr>`
  }

  // Clear fileds after submit
  static clearFileds() {
    title.value = ""
    author.value = ""
  }

  static removeBook(book) {
    book.parentNode.parentNode.parentNode.remove()
  }

  static showAlert(type, mesg) {
    alertMsg.style.display = "block"
    alertMsg.className = `${type}`
    msgText.innerHTML = `${mesg}`
    UI.hideAlert()
  }

  static hideAlert() {
    // Remove the alert after 3s
    setTimeout(() => {
      alertMsg.style.display = "none"
    }, 3000)
  }
}


// Store Class
class Store {
  static getBooks() {
    let books
    books = localStorage.getItem("books") === null ? [] : JSON.parse(localStorage.getItem("books"))
    return books
  }

  static addBook(book) {
    const books = Store.getBooks()
    books.push(book)
    localStorage.setItem("books", JSON.stringify(books))
  }

  static removeBook(isbn) {
    const books = Store.getBooks()
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1)
      }
    })
    localStorage.setItem("books", JSON.stringify(books))
  }
}

// Event Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks())

// Event Add a book
form.addEventListener("submit", (e) => {
  // Prevent to Default
  e.preventDefault()

  // form values
  let title = document.querySelector("#title").value
  const author = document.querySelector("#author").value

  // Get Random isbn number
  let isbn = `978-${Math.round(Math.random())}-${Math.ceil(Math.random() * 99999)}`

  // initalize the new added book
  const book = new Book(title, author, isbn)

  if (localStorage.getItem("books")) {
    JSON.parse(localStorage.getItem("books")).forEach(book => {
      if (book.title === title) {
        title = null
        UI.showAlert("danger", "The title is Already Exist !")
      }
    })
  }

  // Condition : All fields all required
  if (title === "" | author === "") {
    UI.showAlert("danger", "Please Fill all The Fields !")
  }

  else if (title !== null) {
    UI.showAlert("succes", "Book Added Succefuly !")
    // Add book to UI
    UI.addToList(book)

    // Add Book to LocalStorage
    Store.addBook(book)
  }

  // Clear Fields 
  UI.clearFileds()
})

// Event Remove a Book
document.addEventListener("click", e => {
  if (e.target.className === "remove") {
    const isbn = e.target.parentNode.parentNode.previousElementSibling.textContent
    UI.removeBook(e.target)
    UI.showAlert("succes", "Book Removed Succefuly !")

    // remove book from localstorage
    Store.removeBook(isbn)
  }
})