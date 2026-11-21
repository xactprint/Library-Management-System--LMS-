
import assert from "node:assert/strict";

import { Book } from "../models/Book";
import { Member } from "../models/Member";
import { BookService } from "../services/BookService";
import { LoanService } from "../services/LoanService";
import { ReportService } from "../services/ReportService";

// Initialisation des services
const bookService = new BookService();
const loanService = new LoanService();

const reportService = new ReportService(
    bookService,
    loanService
);

// Création des données de test
const book1 = new Book(
    1, "Clean Code", "Robert C. Martin",
    "9780132350884", "Prentice Hall"
);

const book2 = new Book(
    2, "The Pragmatic Programmer", "David Thomas",
    "9780135957059", "Addison-Wesley"
);

const member = new Member(
    1, "Ahmed Benali", "ahmed@example.com",
    "hash123", 101, "MEM001",
    new Date("2026-01-01")
);

// Enregistrement des livres et exemplaires
bookService.addBook(book1);
bookService.addBook(book2);

const copy1 = bookService.addBookCopy(1, 101, "A-01");
const copy2 = bookService.addBookCopy(1, 102, "A-02");
const copy3 = bookService.addBookCopy(2, 103, "B-01");

// Dates de test
const issueDate = new Date("2026-11-01");
const dueDate = new Date("2026-11-10");
const referenceDate = new Date("2026-11-15");

// Création de deux emprunts
const loan1 = loanService.borrowBook(
    member, copy1, issueDate, dueDate
);

const loan2 = loanService.borrowBook(
    member, copy2, issueDate, new Date("2026-11-30")
);

// Retour du premier emprunt avec retard
loanService.returnBook(
    loan1.getLoanId(),
    new Date("2026-11-13")
);

// Compteurs de tests
let passedTests = 0;
let failedTests = 0;

function test(name: string, callback: () => void): void {
    try {
        callback();
        passedTests++;
        console.log(`PASS: ${name}`);
    } catch (error) {
        failedTests++;
        console.log(`FAIL: ${name}`);
        console.log(error);
    }
}

console.log("\n========== REPORT SERVICE TESTS ==========\n");

// Test 1 : nombre de titres
test("Count all registered books", () => {
    const report = reportService.generateBooksReport();
    assert.equal(report.totalBooks, 2);
});

// Test 2 : nombre total d'exemplaires
test("Count all physical copies", () => {
    const report = reportService.generateBooksReport();
    assert.equal(report.totalCopies, 3);
});

// Test 3 : nombre d'exemplaires disponibles
test("Count available copies", () => {
    const report = reportService.generateAvailabilityReport();
    assert.equal(report.availableCopies, 2);
});

// Test 4 : nombre d'exemplaires empruntés
test("Count issued copies", () => {
    const report = reportService.generateAvailabilityReport();
    assert.equal(report.issuedCopies, 1);
});

// Test 5 : total des exemplaires
test("Count total copies in availability report", () => {
    const report = reportService.generateAvailabilityReport();
    assert.equal(report.totalCopies, 3);
});

// Test 6 : nombre total d'emprunts
test("Count all loans", () => {
    const report = reportService.generateLoansReport();
    assert.equal(report.totalLoans, 2);
});

// Test 7 : nombre d'emprunts actifs
test("Count active loans", () => {
    const report = reportService.generateLoansReport();
    assert.equal(report.activeLoans, 1);
});

// Test 8 : nombre d'emprunts retournés
test("Count returned loans", () => {
    const report = reportService.generateLoansReport();
    assert.equal(report.returnedLoans, 1);
});

// Test 9 : identifier les emprunts actuellement en retard
test("Identify active overdue loans", () => {
    const report = reportService.generateOverdueReport(referenceDate);
    assert.equal(report.overdueCount, 0);
});

// Test 10 : ne pas compter un emprunt retourné en retard
test("Exclude returned overdue loans from current overdue report", () => {
    const overdueDays = loan1.getOverdueDays(referenceDate);
    assert.equal(overdueDays, 3);

    const report = reportService.generateOverdueReport(referenceDate);
    assert.ok(!report.overdueLoanIds.includes(loan1.getLoanId()));
});

// Test 11 : identifier un emprunt actif en retard
test("Identify an active loan past its due date", () => {
    const overdueLoan = loanService.borrowBook(
        member,
        copy3,
        issueDate,
        dueDate
    );

    const report = reportService.generateOverdueReport(referenceDate);

    assert.equal(report.overdueCount, 1);
    assert.ok(report.overdueLoanIds.includes(overdueLoan.getLoanId()));
});

// Résumé
console.log("\n========== TEST SUMMARY ==========");
console.log(`Total tests: ${passedTests + failedTests}`);
console.log(`Passed tests: ${passedTests}`);
console.log(`Failed tests: ${failedTests}`);

if (failedTests === 0) {
    console.log("\nALL TESTS PASSED SUCCESSFULLY!");
} else {
    console.log("\nSOME TESTS FAILED!");
}
