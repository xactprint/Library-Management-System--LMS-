
import assert from "node:assert/strict";

import { Book } from "../models/Book";
import { BookCopy } from "../models/BookCopy";
import { Member } from "../models/Member";
import { Librarian } from "../models/Librarian";
import { Administrator } from "../models/Administrator";
import { Loan } from "../models/Loan";

import { BookRepository } from "../repositories/BookRepository";
import { MemberRepository } from "../repositories/MemberRepository";
import { LoanRepository } from "../repositories/LoanRepository";
import { UserRepository } from "../repositories/UserRepository";

// Initialisation des repositories
const bookRepository = new BookRepository();
const memberRepository = new MemberRepository();
const loanRepository = new LoanRepository();
const userRepository = new UserRepository();

// Données de test
const book1 = new Book(
    1, "Clean Code", "Robert C. Martin",
    "9780132350884", "Pearson"
);

const book2 = new Book(
    2, "The Pragmatic Programmer", "Andrew Hunt",
    "9780135957059", "Addison-Wesley"
);

const member1 = new Member(
    20, "Ahmed Benali", "ahmed@email.com",
    "hashed_password", 2001, "MEM-2026-010",
    new Date("2026-11-21")
);

const member2 = new Member(
    21, "Fatima Ali", "fatima@email.com",
    "hashed_password", 2002, "MEM-2026-011",
    new Date("2026-11-21")
);

const librarian = new Librarian(
    22, "Sara Karim", "sara@email.com",
    "hashed_password", 201, new Date("2025-01-01")
);

const administrator = new Administrator(
    23, "Admin User", "admin@email.com",
    "hashed_password", "Full"
);

// Exemplaires et emprunt de test
const copy1 = new BookCopy(501, book1, "A-01");
const copy2 = new BookCopy(502, book1, "A-02");
const copy3 = new BookCopy(503, book2, "B-01");

const issueDate = new Date("2026-11-21");
const dueDate = new Date("2026-11-28");

const loan1 = new Loan(
    7001, member1, copy1, issueDate, dueDate
);

let passedTests = 0;
let failedTests = 0;

// Fonction d'exécution des tests
function test(name: string, callback: () => void): void {
    try {
        callback();
        passedTests++;
        console.log(`PASS: ${name}`);
    } catch (error) {
        failedTests++;
        console.log(`FAIL: ${name}`);
        console.error(error);
    }
}

console.log("\n========== REPOSITORY TESTS ==========\n");

// ==========================================
// BOOK REPOSITORY
// ==========================================

console.log("\n--- BOOK REPOSITORY ---");

test("Add a book", () => {
    bookRepository.add(book1);
    assert.equal(bookRepository.findAll().length, 1);
});

test("Find a book by ID", () => {
    assert.equal(bookRepository.findById(1)?.getTitle(), "Clean Code");
});

test("Return undefined for an unknown book", () => {
    assert.equal(bookRepository.findById(999), undefined);
});

test("Retrieve all books", () => {
    bookRepository.add(book2);
    assert.equal(bookRepository.findAll().length, 2);
});

test("Update a book", () => {
    const updatedBook = new Book(
        1, "Clean Code - Updated", "Robert C. Martin",
        "9780132350884", "Pearson"
    );

    assert.equal(bookRepository.update(updatedBook), true);
    assert.equal(
        bookRepository.findById(1)?.getTitle(),
        "Clean Code - Updated"
    );
});

test("Reject a duplicate book ID", () => {
    assert.throws(() => bookRepository.add(book1));
});

test("Delete a book", () => {
    assert.equal(bookRepository.delete(2), true);
    assert.equal(bookRepository.findById(2), undefined);
});

test("Reject deletion of an unknown book", () => {
    assert.equal(bookRepository.delete(999), false);
});

// ==========================================
// MEMBER REPOSITORY
// ==========================================

console.log("\n--- MEMBER REPOSITORY ---");

test("Add a member", () => {
    memberRepository.add(member1);
    assert.equal(memberRepository.findAll().length, 1);
});

test("Find a member by ID", () => {
    assert.equal(
        memberRepository.findById(2001)?.getFullName(),
        "Ahmed Benali"
    );
});

test("Find a member by membership number", () => {
    assert.equal(
        memberRepository.findByMembershipNumber("MEM-2026-010")?.getMemberId(),
        2001
    );
});

test("Retrieve all members", () => {
    memberRepository.add(member2);
    assert.equal(memberRepository.findAll().length, 2);
});

test("Retrieve active members", () => {
    member2.deactivate();
    assert.equal(memberRepository.findActive().length, 1);
});

test("Update a member", () => {
    const updatedMember = new Member(
        20, "Ahmed Updated", "ahmed.updated@email.com",
        "hashed_password", 2001, "MEM-2026-010",
        new Date("2026-11-21")
    );

    assert.equal(memberRepository.update(updatedMember), true);
    assert.equal(
        memberRepository.findById(2001)?.getFullName(),
        "Ahmed Updated"
    );
});

test("Reject a duplicate member ID", () => {
    const duplicate = new Member(
        24, "Another Member", "another@email.com",
        "hashed_password", 2001, "MEM-2026-012",
        new Date("2026-11-21")
    );

    assert.throws(() => memberRepository.add(duplicate));
});

test("Delete a member", () => {
    assert.equal(memberRepository.delete(2002), true);
    assert.equal(memberRepository.findById(2002), undefined);
});

test("Reject deletion of an unknown member", () => {
    assert.equal(memberRepository.delete(9999), false);
});

// ==========================================
// LOAN REPOSITORY
// ==========================================

console.log("\n--- LOAN REPOSITORY ---");

test("Add a loan", () => {
    loanRepository.add(loan1);
    assert.equal(loanRepository.findAll().length, 1);
});

test("Find a loan by ID", () => {
    assert.equal(loanRepository.findById(7001)?.getLoanId(), 7001);
});

test("Retrieve active loans", () => {
    assert.equal(loanRepository.findActive().length, 1);
});

test("Find loans by member ID", () => {
    assert.equal(loanRepository.findByMemberId(2001).length, 1);
});

test("Find active loans by member ID", () => {
    assert.equal(loanRepository.findActiveByMemberId(2001).length, 1);
});

test("Update a loan", () => {
    const updatedLoan = new Loan(
        7001, member1, copy2, issueDate, dueDate
    );

    assert.equal(loanRepository.update(updatedLoan), true);
    assert.equal(
        loanRepository.findById(7001)?.getLoanId(),
        7001
    );
});

test("Reject a duplicate loan ID", () => {
    const duplicateLoan = new Loan(
        7001, member1, copy3, issueDate, dueDate
    );

    assert.throws(() => loanRepository.add(duplicateLoan));
});

test("Delete a loan", () => {
    assert.equal(loanRepository.delete(7001), true);
    assert.equal(loanRepository.findById(7001), undefined);
});

// ==========================================
// USER REPOSITORY
// ==========================================

console.log("\n--- USER REPOSITORY ---");

test("Add a member to the user repository", () => {
    userRepository.add(member1);
    assert.equal(userRepository.findAll().length, 1);
});

test("Add a librarian", () => {
    userRepository.add(librarian);
    assert.equal(userRepository.findAll().length, 2);
});

test("Add an administrator", () => {
    userRepository.add(administrator);
    assert.equal(userRepository.findAll().length, 3);
});

test("Find a user by ID", () => {
    assert.equal(
        userRepository.findById(22)?.getFullName(),
        "Sara Karim"
    );
});

test("Find a user by email", () => {
    assert.ok(userRepository.findByEmail("sara@email.com"));
});

test("Support case-insensitive email searches", () => {
    assert.ok(userRepository.findByEmail("SARA@EMAIL.COM"));
});

test("Update a user", () => {
    const updatedLibrarian = new Librarian(
        22, "Sara Updated", "sara.updated@email.com",
        "hashed_password", 201, new Date("2025-01-01")
    );

    assert.equal(userRepository.update(updatedLibrarian), true);
    assert.equal(
        userRepository.findById(22)?.getFullName(),
        "Sara Updated"
    );
});

test("Reject a duplicate user email", () => {
    const duplicate = new Member(
        25, "Duplicate User", "admin@email.com",
        "hashed_password", 2005, "MEM-2026-015",
        new Date("2026-11-21")
    );

    assert.throws(() => userRepository.add(duplicate));
});

test("Reject a duplicate user ID", () => {
    const duplicate = new Librarian(
        20, "Another Librarian", "another.librarian@email.com",
        "hashed_password", 202, new Date("2025-01-01")
    );

    assert.throws(() => userRepository.add(duplicate));
});

test("Delete a user", () => {
    assert.equal(userRepository.delete(23), true);
    assert.equal(userRepository.findById(23), undefined);
});

// ==========================================
// FINAL SUMMARY
// ==========================================

console.log("\n========== TEST SUMMARY ==========");
console.log(`Total tests: ${passedTests + failedTests}`);
console.log(`Passed tests: ${passedTests}`);
console.log(`Failed tests: ${failedTests}`);

if (failedTests === 0) {
    console.log("\nALL REPOSITORY TESTS PASSED!");
} else {
    console.log("\nSOME REPOSITORY TESTS FAILED!");
}
