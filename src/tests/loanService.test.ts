
import assert from "node:assert/strict";

import { Book } from "../models/Book";
import { BookCopy } from "../models/BookCopy";
import { Member } from "../models/Member";
import { LoanStatus } from "../models/Loan";
import { LoanService } from "../services/LoanService";

// Données de test
const book = new Book(
    1,
    "Clean Code",
    "Robert C. Martin",
    "9780132350884",
    "Pearson"
);

const member = new Member(
    10,
    "Ahmed Benali",
    "ahmed@email.com",
    "hashed_password",
    1001,
    "MEM-2026-001",
    new Date("2026-01-15")
);

const issueDate = new Date("2026-11-21");
const dueDate = new Date("2026-11-28");

const service = new LoanService();

let passedTests = 0;
let failedTests = 0;

// Fonction permettant d'exécuter et de compter les tests
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

console.log("\n========== LOAN SERVICE TESTS ==========\n");

// TEST 1 : Création d'un emprunt
const copy1 = new BookCopy(501, book, "E-01");

let loanId = 0;

test("Create a new loan successfully", () => {
    const loan = service.borrowBook(member, copy1, issueDate, dueDate);

    loanId = loan.getLoanId();

    assert.ok(loanId > 0);
    assert.equal(loan.getStatus(), LoanStatus.Active);
});

// TEST 2 : Le livre devient indisponible
test("Book copy status changes to Issued", () => {
    assert.equal(copy1.getStatus(), "Issued");
});

// TEST 3 : L'emprunt est enregistré
test("Loan is stored in the service", () => {
    assert.equal(service.getAllLoans().length, 1);
});

// TEST 4 : Recherche par identifiant
test("Find loan by ID", () => {
    const loan = service.findLoanById(loanId);

    assert.ok(loan);
    assert.equal(loan.getLoanId(), loanId);
});

// TEST 5 : Recherche d'un emprunt inexistant
test("Return undefined for an unknown loan ID", () => {
    assert.equal(service.findLoanById(9999), undefined);
});

// TEST 6 : Nombre d'emprunts actifs
test("Count active loans for a member", () => {
    assert.equal(service.getActiveLoanCount(member), 1);
});

// TEST 7 : Liste des emprunts actifs
test("Retrieve active loans for a member", () => {
    const activeLoans = service.getActiveLoansForMember(member);

    assert.equal(activeLoans.length, 1);
});

// TEST 8 : Retour du livre
test("Return a loan successfully", () => {
    assert.equal(
        service.returnBook(loanId, new Date("2026-11-25")),
        true
    );
});

// TEST 9 : Statut de l'emprunt après retour
test("Loan status changes to Returned", () => {
    const loan = service.findLoanById(loanId);

    assert.equal(loan?.getStatus(), LoanStatus.Returned);
});

// TEST 10 : Le livre redevient disponible
test("Book copy becomes Available after return", () => {
    assert.equal(copy1.getStatus(), "Available");
});

// TEST 11 : Aucun emprunt actif après retour
test("Active loan count becomes zero after return", () => {
    assert.equal(service.getActiveLoanCount(member), 0);
});

// TEST 12 : Impossible de retourner deux fois le même emprunt
test("Reject a second return of the same loan", () => {
    assert.equal(
        service.returnBook(loanId, new Date("2026-11-26")),
        false
    );
});

// TEST 13 : Refuser un livre déjà emprunté
test("Reject borrowing an already issued book copy", () => {
    const copy2 = new BookCopy(502, book, "E-02");

    service.borrowBook(member, copy2, issueDate, dueDate);

    assert.throws(() => {
        service.borrowBook(member, copy2, issueDate, dueDate);
    });
});

// TEST 14 : Refuser un membre inactif
test("Reject borrowing for an inactive member", () => {
    const inactiveMember = new Member(
        11,
        "Inactive Member",
        "inactive@email.com",
        "hashed_password",
        1002,
        "MEM-2026-002",
        new Date("2026-01-15")
    );

    inactiveMember.deactivate();

    const copy3 = new BookCopy(503, book, "E-03");

    assert.throws(() => {
        service.borrowBook(inactiveMember, copy3, issueDate, dueDate);
    });
});

// TEST 15 : Autoriser trois emprunts actifs
test("Allow a member to have three active loans", () => {
    const member2 = new Member(
        12,
        "Fatima Ali",
        "fatima@email.com",
        "hashed_password",
        1003,
        "MEM-2026-003",
        new Date("2026-01-15")
    );

    const copy4 = new BookCopy(504, book, "E-04");
    const copy5 = new BookCopy(505, book, "E-05");
    const copy6 = new BookCopy(506, book, "E-06");

    service.borrowBook(member2, copy4, issueDate, dueDate);
    service.borrowBook(member2, copy5, issueDate, dueDate);
    service.borrowBook(member2, copy6, issueDate, dueDate);

    assert.equal(service.getActiveLoanCount(member2), 3);
});

// TEST 16 : Refuser un quatrième emprunt
test("Reject a fourth active loan for the same member", () => {
    const member3 = new Member(
        13,
        "Karim Said",
        "karim@email.com",
        "hashed_password",
        1004,
        "MEM-2026-004",
        new Date("2026-01-15")
    );

    const copy7 = new BookCopy(507, book, "E-07");
    const copy8 = new BookCopy(508, book, "E-08");
    const copy9 = new BookCopy(509, book, "E-09");
    const copy10 = new BookCopy(510, book, "E-10");

    service.borrowBook(member3, copy7, issueDate, dueDate);
    service.borrowBook(member3, copy8, issueDate, dueDate);
    service.borrowBook(member3, copy9, issueDate, dueDate);

    assert.throws(() => {
        service.borrowBook(member3, copy10, issueDate, dueDate);
    });
});

// TEST 17 : Refuser une date d'échéance invalide
test("Reject a due date earlier than the issue date", () => {
    const copy11 = new BookCopy(511, book, "E-11");

    assert.throws(() => {
        service.borrowBook(
            member,
            copy11,
            new Date("2026-11-28"),
            new Date("2026-11-21")
        );
    });
});

// Résumé des tests
console.log("\n========== TEST SUMMARY ==========");
console.log("Total tests:", passedTests + failedTests);
console.log("Passed tests:", passedTests);
console.log("Failed tests:", failedTests);

if (failedTests === 0) {
    console.log("\nALL TESTS PASSED SUCCESSFULLY!");
} else {
    console.log("\nSOME TESTS FAILED!");
}
