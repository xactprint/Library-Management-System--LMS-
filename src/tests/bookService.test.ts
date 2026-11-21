
import assert from "node:assert/strict";

import { Book } from "../models/Book";
import { CopyStatus } from "../models/BookCopy";
import { BookService } from "../services/BookService";

// Initialisation du service
const service = new BookService();

// Création des livres de test
const book1 = new Book(
    1,
    "Clean Code",
    "Robert C. Martin",
    "9780132350884",
    "Pearson"
);

const book2 = new Book(
    2,
    "The Pragmatic Programmer",
    "Andrew Hunt",
    "9780135957059",
    "Addison-Wesley"
);

let passedTests = 0;
let failedTests = 0;

// Fonction d'exécution des tests
function test(description: string, callback: () => void): void {
    try {
        callback();
        passedTests++;
        console.log(`PASS: ${description}`);
    } catch (error) {
        failedTests++;
        console.log(`FAIL: ${description}`);
        console.error(error);
    }
}

console.log("\n========== BOOK SERVICE TESTS ==========\n");

// TEST 1 : Ajouter un livre
test("Add a book successfully", () => {
    service.addBook(book1);
    assert.equal(service.getAllBooks().length, 1);
});

// TEST 2 : Ajouter un deuxième livre
test("Add another book successfully", () => {
    service.addBook(book2);
    assert.equal(service.getAllBooks().length, 2);
});

// TEST 3 : Rechercher par identifiant
test("Find a book by ID", () => {
    const result = service.findBookById(1);
    assert.ok(result);
    assert.equal(result.getTitle(), "Clean Code");
});

// TEST 4 : Rechercher un identifiant inexistant
test("Return undefined for an unknown book ID", () => {
    assert.equal(service.findBookById(999), undefined);
});

// TEST 5 : Rechercher par titre
test("Search books by title", () => {
    const results = service.findBooksByTitle("clean");
    assert.equal(results.length, 1);
    assert.equal(results[0].getTitle(), "Clean Code");
});

// TEST 6 : Recherche partielle du titre
test("Support partial title searches", () => {
    const results = service.findBooksByTitle("programmer");
    assert.equal(results.length, 1);
});

// TEST 7 : Recherche insensible à la casse
test("Support case-insensitive title searches", () => {
    const results = service.findBooksByTitle("CLEAN CODE");
    assert.equal(results.length, 1);
});

// TEST 8 : Rechercher par auteur
test("Search books by author", () => {
    const results = service.findBooksByAuthor("Robert C. Martin");
    assert.equal(results.length, 1);
});

// TEST 9 : Rechercher par ISBN
test("Find a book by ISBN", () => {
    const result = service.findBookByISBN("9780132350884");
    assert.ok(result);
    assert.equal(result.getBookId(), 1);
});

// TEST 10 : Ajouter un exemplaire physique
let copy1Id = 0;

test("Add a physical book copy", () => {
    const copy = service.addBookCopy(1, 501, "E-01");
    copy1Id = copy.getCopyId();

    assert.equal(copy1Id, 501);
    assert.equal(copy.getStatus(), CopyStatus.Available);
});

// TEST 11 : Ajouter plusieurs exemplaires
test("Add multiple copies to the same book", () => {
    service.addBookCopy(1, 502, "E-02");
    service.addBookCopy(1, 503, "E-03");

    assert.equal(service.getCopiesForBook(1).length, 3);
});

// TEST 12 : Récupérer les exemplaires d'un livre
test("Retrieve all copies for a book", () => {
    const copies = service.getCopiesForBook(1);
    assert.equal(copies.length, 3);
});

// TEST 13 : Récupérer les exemplaires disponibles
test("Retrieve available copies", () => {
    const copies = service.getAvailableCopies(1);
    assert.equal(copies.length, 3);
});

// TEST 14 : Refuser un identifiant de livre dupliqué
test("Reject a duplicate book ID", () => {
    const duplicateBook = new Book(
        1,
        "Another Book",
        "Another Author",
        "9780000000001",
        "Publisher"
    );

    assert.throws(() => {
        service.addBook(duplicateBook);
    });
});

// TEST 15 : Refuser un ISBN dupliqué
test("Reject a duplicate ISBN", () => {
    const duplicateISBNBook = new Book(
        3,
        "Another Book",
        "Another Author",
        "9780132350884",
        "Publisher"
    );

    assert.throws(() => {
        service.addBook(duplicateISBNBook);
    });
});

// TEST 16 : Refuser un exemplaire pour un livre inexistant
test("Reject a copy for a non-existing book", () => {
    assert.throws(() => {
        service.addBookCopy(999, 600, "E-99");
    });
});

// Vérifier que le statut change après un emprunt
test("Available copies reflect issued status changes", () => {
    const copy = service.getCopiesForBook(1)[0];

    copy.markAsIssued();

    assert.equal(service.getAvailableCopies(1).length, 2);
});

// Résumé final
console.log("\n========== TEST SUMMARY ==========");
console.log("Total tests:", passedTests + failedTests);
console.log("Passed tests:", passedTests);
console.log("Failed tests:", failedTests);

if (failedTests === 0) {
    console.log("\nALL TESTS PASSED SUCCESSFULLY!");
} else {
    console.log("\nSOME TESTS FAILED!");
}
