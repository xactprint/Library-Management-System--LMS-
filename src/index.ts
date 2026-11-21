
// ============================================
// LIBRARY MANAGEMENT SYSTEM
// Part 5.7 - Integration and Testing
// ============================================

// Importation des classes du système
import { Book } from "./models/Book";
import { BookCopy, CopyStatus } from "./models/BookCopy";
import { User } from "./models/User";
import { Member } from "./models/Member";
import { Librarian } from "./models/Librarian";
import { Administrator } from "./models/Administrator";
import { Loan, LoanStatus } from "./models/Loan";

// ============================================
// TESTING FUNCTIONS
// ============================================

// Compteur des tests
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Vérifie une condition
function checkTest(condition: boolean, description: string): void {
    totalTests++;

    if (condition) {
        passedTests++;
        console.log(`PASS: ${description}`);
    } else {
        failedTests++;
        console.log(`FAIL: ${description}`);
    }
}

// Vérifie qu'une opération déclenche une erreur
function checkError(action: () => void, description: string): void {
    let errorOccurred = false;

    try {
        action();
    } catch {
        errorOccurred = true;
    }

    checkTest(errorOccurred, description);
}

// ============================================
// PART 1 - BOOK AND BOOKCOPY TESTS
// ============================================

console.log("\n============================================");
console.log("PART 1 - BOOK AND BOOKCOPY");
console.log("============================================");

// Création d'un livre
const book1 = new Book(
    1,
    "Clean Code",
    "Robert C. Martin",
    "9780132350884",
    "Prentice Hall"
);

// Création de deux exemplaires physiques
const copy1 = new BookCopy(101, book1, "A-01");
const copy2 = new BookCopy(102, book1, "A-02");

// Vérification du statut initial
console.log("\nInitial status:");
console.log(copy1.getCopyDetails());

// Emprunt du premier exemplaire
console.log("\nIssuing copy 101:");

const issueResult = copy1.markAsIssued();

console.log(
    issueResult
        ? "Book copy successfully issued."
        : "Book copy could not be issued."
);

console.log(copy1.getStatus());

// Tentative de deuxième emprunt du même exemplaire
console.log("\nTrying to issue the same copy again:");

const secondIssueResult = copy1.markAsIssued();

console.log(secondIssueResult);

// Retour de l'exemplaire
copy1.markAsAvailable();

console.log("\nAfter return:");
console.log(copy1.getStatus());

// Affichage du deuxième exemplaire
console.log("\nSecond copy:");
console.log(copy2.getCopyDetails());

// Affichage des informations bibliographiques
console.log("\nBook Information:");
console.log(book1.getBookDetails());

// Modification des informations du livre
book1.updateBookInfo(
    "Clean Code",
    "Robert C. Martin",
    "Pearson"
);

console.log("\nAfter update:");
console.log(book1.getBookDetails());

// ============================================
// PART 2 - USER, MEMBER AND INHERITANCE
// ============================================

console.log("\n============================================");
console.log("PART 2 - USERS AND INHERITANCE");
console.log("============================================");

// Création d'un membre
const member1 = new Member(
    10,
    "Ahmed Benali",
    "ahmed@email.com",
    "hashed_password",
    1001,
    "MEM-2026-001",
    new Date("2026-01-15")
);

console.log("\nMember Information:");
console.log(member1.getMemberDetails());

// Test de l'héritage
console.log("\nInheritance Test:");

console.log("User ID:", member1.getUserId());
console.log("Full Name:", member1.getFullName());
console.log("Role:", member1.getRole());

// Désactivation du membre
member1.deactivate();

console.log("\nAfter deactivation:");
console.log("Active:", member1.getIsActive());

// Réactivation du membre
member1.activate();

console.log("\nAfter activation:");
console.log("Active:", member1.getIsActive());

// ============================================
// PART 3 - LIBRARIAN AND ADMINISTRATOR
// ============================================

console.log("\n============================================");
console.log("PART 3 - LIBRARIAN AND ADMINISTRATOR");
console.log("============================================");

// Création d'un bibliothécaire
const librarian1 = new Librarian(
    20,
    "Sarah Benyahia",
    "sarah@library.com",
    "hashed_password",
    2001,
    new Date("2024-03-10")
);

console.log("\nLibrarian Information:");
console.log(librarian1.getLibrarianDetails());

// Création d'un administrateur
const admin1 = new Administrator(
    30,
    "Karim Haddad",
    "karim@library.com",
    "hashed_password",
    "Full Access"
);

console.log("\nAdministrator Information:");
console.log(admin1.getAdministratorDetails());

// ============================================
// PART 4 - POLYMORPHISM
// ============================================

console.log("\n============================================");
console.log("PART 4 - POLYMORPHISM");
console.log("============================================");

// Une même référence User peut contenir
// différents types d'utilisateurs.
const users: User[] = [
    member1,
    librarian1,
    admin1
];

console.log("\nPolymorphism Test:");

users.forEach(user => {
    console.log(
        `${user.getFullName()} - ${user.getRole()}`
    );
});

// ============================================
// PART 5 - LOAN CLASS TEST
// ============================================

console.log("\n============================================");
console.log("PART 5 - LOAN CLASS");
console.log("============================================");

// Création d'un emprunt
const loan1 = new Loan(
    5001,
    member1,
    copy1,
    new Date("2026-11-21"),
    new Date("2026-11-28")
);

console.log("\nLoan Information:");
console.log(loan1.getLoanDetails());

// Vérification du statut de l'exemplaire
console.log("\nBook Copy Status:");
console.log(copy1.getStatus());

// Calcul du retard à une date de référence
console.log("\nOverdue Test:");
console.log(
    "Overdue Days:",
    loan1.getOverdueDays(new Date("2026-12-02"))
);

// Retour de l'exemplaire
console.log("\nReturning Book:");

const returned = loan1.markAsReturned(
    new Date("2026-12-02")
);

console.log("Return successful:", returned);

// Vérification après le retour
console.log("\nAfter Return:");
console.log("Loan Status:", loan1.getStatus());
console.log("Book Copy Status:", copy1.getStatus());

console.log(
    "Return Date:",
    loan1.getReturnDate()?.toDateString()
);

console.log(
    "Final Overdue Days:",
    loan1.getOverdueDays()
);

// ============================================
// PART 6 - INTEGRATION TESTING
// ============================================

console.log("\n============================================");
console.log("PART 6 - INTEGRATION TESTING");
console.log("============================================");

// TEST 1 - Création d'un nouvel emprunt
console.log("\n--- Test 1: Loan Creation ---");

const integrationCopy = new BookCopy(
    201,
    book1,
    "B-01"
);

const integrationLoan = new Loan(
    6001,
    member1,
    integrationCopy,
    new Date("2026-11-21"),
    new Date("2026-11-28")
);

// Vérification du statut initial de l'emprunt
checkTest(
    integrationLoan.getStatus() === LoanStatus.Active,
    "A new loan starts with Active status"
);

// Vérification du changement de statut de l'exemplaire
checkTest(
    integrationCopy.getStatus() === CopyStatus.Issued,
    "Creating a loan marks the copy as Issued"
);

// TEST 2 - Retour d'un emprunt
console.log("\n--- Test 2: Book Return ---");

const integrationReturn = integrationLoan.markAsReturned(
    new Date("2026-11-25")
);

checkTest(
    integrationReturn === true,
    "An active loan can be returned"
);

checkTest(
    integrationLoan.getStatus() === LoanStatus.Returned,
    "Returned loan has Returned status"
);

checkTest(
    integrationCopy.checkAvailability(),
    "Returned copy becomes Available"
);

// TEST 3 - Empêcher un deuxième retour
console.log("\n--- Test 3: Duplicate Return ---");

checkTest(
    integrationLoan.markAsReturned(
        new Date("2026-11-26")
    ) === false,
    "A loan cannot be returned twice"
);

// ============================================
// PART 7 - BUSINESS RULE VALIDATION
// ============================================

// TEST 4 - Exemplaire déjà emprunté
console.log("\n--- Test 4: Unavailable Book Copy ---");

const busyCopy = new BookCopy(
    202,
    book1,
    "B-02"
);

const busyLoan = new Loan(
    6002,
    member1,
    busyCopy,
    new Date("2026-11-21"),
    new Date("2026-11-28")
);

// Tentative d'emprunter le même exemplaire
checkError(
    () => {
        new Loan(
            6003,
            member1,
            busyCopy,
            new Date("2026-11-21"),
            new Date("2026-11-28")
        );
    },
    "The system rejects an already issued copy"
);

// Retour pour libérer l'exemplaire
busyLoan.markAsReturned(
    new Date("2026-11-22")
);

// TEST 5 - Membre inactif
console.log("\n--- Test 5: Inactive Member ---");

member1.deactivate();

checkError(
    () => {
        new Loan(
            6004,
            member1,
            new BookCopy(203, book1, "B-03"),
            new Date("2026-11-21"),
            new Date("2026-11-28")
        );
    },
    "The system rejects loans from inactive members"
);

// Réactivation du membre
member1.activate();

// TEST 6 - Limite de trois emprunts actifs
console.log("\n--- Test 6: Maximum Three Active Loans ---");

const limitCopy1 = new BookCopy(301, book1, "C-01");
const limitCopy2 = new BookCopy(302, book1, "C-02");
const limitCopy3 = new BookCopy(303, book1, "C-03");
const limitCopy4 = new BookCopy(304, book1, "C-04");

// Premier emprunt
const limitLoan1 = new Loan(
    7001,
    member1,
    limitCopy1,
    new Date("2026-11-21"),
    new Date("2026-11-28")
);

// Deuxième emprunt
const limitLoan2 = new Loan(
    7002,
    member1,
    limitCopy2,
    new Date("2026-11-21"),
    new Date("2026-11-28"),
    [limitLoan1]
);

// Troisième emprunt
const limitLoan3 = new Loan(
    7003,
    member1,
    limitCopy3,
    new Date("2026-11-21"),
    new Date("2026-11-28"),
    [limitLoan1, limitLoan2]
);

// Vérification des trois emprunts
checkTest(
    limitLoan1.isActive() &&
    limitLoan2.isActive() &&
    limitLoan3.isActive(),
    "A member can have three active loans"
);

// Tentative de quatrième emprunt
checkError(
    () => {
        new Loan(
            7004,
            member1,
            limitCopy4,
            new Date("2026-11-21"),
            new Date("2026-11-28"),
            [limitLoan1, limitLoan2, limitLoan3]
        );
    },
    "The system rejects a fourth active loan"
);

// TEST 7 - Validation des dates
console.log("\n--- Test 7: Invalid Loan Dates ---");

checkError(
    () => {
        new Loan(
            8001,
            member1,
            new BookCopy(401, book1, "D-01"),
            new Date("2026-11-28"),
            new Date("2026-11-21")
        );
    },
    "The system rejects a due date before the issue date"
);

// ============================================
// PART 8 - FINAL TEST SUMMARY
// ============================================

console.log("\n============================================");
console.log("FINAL TEST SUMMARY");
console.log("============================================");

console.log("Total tests:", totalTests);
console.log("Passed tests:", passedTests);
console.log("Failed tests:", failedTests);

if (failedTests === 0) {
    console.log("\nALL TESTS PASSED SUCCESSFULLY!");
} else {
    console.log("\nSOME TESTS FAILED. PLEASE CHECK THE RESULTS.");
}

console.log("\n============================================");
console.log("LIBRARY MANAGEMENT SYSTEM TESTING COMPLETED");
console.log("============================================");
