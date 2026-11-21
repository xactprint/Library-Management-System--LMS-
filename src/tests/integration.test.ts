
import assert from "node:assert/strict";

import { Book } from "../models/Book";
import { Member } from "../models/Member";

import { BookService } from "../services/BookService";
import { MemberService } from "../services/MemberService";
import { LoanService } from "../services/LoanService";
import { ReportService } from "../services/ReportService";

// Initialisation des services
const bookService = new BookService();
const memberService = new MemberService();
const loanService = new LoanService();

const reportService = new ReportService(
    bookService,
    loanService
);

let passed = 0;
let failed = 0;

function test(name: string, callback: () => void): void {
    try {
        callback();
        console.log(`PASS: ${name}`);
        passed++;
    } catch (error) {
        console.log(`FAIL: ${name}`);
        console.log(error);
        failed++;
    }
}

console.log("\n========== INTEGRATION TESTS ==========\n");

// 1. Enregistrer un ouvrage et ses exemplaires
const book = new Book(
    1,
    "Clean Code",
    "Robert C. Martin",
    "9780132350884",
    "Pearson"
);

test("Register a book in the catalogue", () => {
    bookService.addBook(book);
    assert.equal(bookService.getAllBooks().length, 1);
});

let copy: ReturnType<BookService["addBookCopy"]>;

test("Create a physical copy for the registered book", () => {
    copy = bookService.addBookCopy(1, 101, "A-01");
    assert.equal(copy.getStatus(), "Available");
});

// 2. Enregistrer un membre et effectuer un emprunt
const member = new Member(
    20,
    "Ahmed Benali",
    "ahmed@email.com",
    "hashed_password",
    2001,
    "MEM-2026-010",
    new Date("2026-11-21")
);

test("Register a library member", () => {
    memberService.addMember(member);
    assert.equal(memberService.getMemberCount(), 1);
});

let loanId = 0;

test("Borrow an available book copy", () => {
    const loan = loanService.borrowBook(
        member,
        copy,
        new Date("2026-11-21"),
        new Date("2026-11-28")
    );

    loanId = loan.getLoanId();

    assert.equal(loan.getStatus(), "Active");
    assert.equal(copy.getStatus(), "Issued");
});

test("Verify the member's active loan count", () => {
    assert.equal(loanService.getActiveLoanCount(member), 1);
});

// 3. Retourner l'exemplaire
test("Return the borrowed book copy", () => {
    const result = loanService.returnBook(
        loanId,
        new Date("2026-11-25")
    );

    assert.equal(result, true);
    assert.equal(copy.getStatus(), "Available");
});

test("Verify that the loan is no longer active", () => {
    assert.equal(loanService.getActiveLoanCount(member), 0);
});

// 4. Générer les rapports
test("Generate the books report", () => {
    const report = reportService.generateBooksReport();

    assert.equal(report.totalBooks, 1);
    assert.equal(report.totalCopies, 1);
});

test("Generate the availability report", () => {
    const report = reportService.generateAvailabilityReport();

    assert.equal(report.totalCopies, 1);
    assert.equal(report.availableCopies, 1);
    assert.equal(report.issuedCopies, 0);
});

test("Generate the loans report", () => {
    const report = reportService.generateLoansReport();

    assert.equal(report.totalLoans, 1);
    assert.equal(report.activeLoans, 0);
    assert.equal(report.returnedLoans, 1);
});

console.log("\n========== TEST SUMMARY ==========");
console.log(`Total tests: ${passed + failed}`);
console.log(`Passed tests: ${passed}`);
console.log(`Failed tests: ${failed}`);

if (failed > 0) {
    throw new Error("Some integration tests failed.");
}

console.log("\nALL INTEGRATION TESTS PASSED!");
