
import assert from "node:assert/strict";

import { User } from "../models/User";
import { Member } from "../models/Member";
import { Librarian } from "../models/Librarian";
import { Administrator } from "../models/Administrator";

import { AuthenticationService } from "../services/AuthenticationService";
import { PasswordVerifier } from "../security/PasswordVerifier";

// Vérificateur simplifié réservé aux tests
class TestPasswordVerifier implements PasswordVerifier {

    public verify(password: string, passwordHash: string): boolean {
        return password === passwordHash;
    }
}

// Initialisation du service
const verifier = new TestPasswordVerifier();
const authService = new AuthenticationService(verifier);

// Création des utilisateurs de test
const member = new Member(
    1,
    "Ahmed Benali",
    "ahmed@example.com",
    "hash123",
    101,
    "MEM001",
    new Date("2026-01-01")
);

const librarian = new Librarian(
    2,
    "Sara Karim",
    "sara@example.com",
    "hash456",
    201,
    new Date("2025-01-01")
);

const administrator = new Administrator(
    3,
    "Admin User",
    "admin@example.com",
    "hash789",
    "Full"
);

// Enregistrer les utilisateurs
authService.addUser(member);
authService.addUser(librarian);
authService.addUser(administrator);

// Compteurs des tests
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

console.log("\n========== AUTHENTICATION SERVICE TESTS ==========\n");

// Test 1 : connexion réussie d'un membre
test("Authenticate a member with valid credentials", () => {
    const result = authService.login("ahmed@example.com", "hash123");
    assert.ok(result);
    assert.equal(result.getRole(), "Member");
});

// Test 2 : connexion d'un bibliothécaire
test("Authenticate a librarian", () => {
    const result = authService.login("sara@example.com", "hash456");
    assert.ok(result);
    assert.equal(result.getRole(), "Librarian");
});

// Test 3 : connexion d'un administrateur
test("Authenticate an administrator", () => {
    const result = authService.login("admin@example.com", "hash789");
    assert.ok(result);
    assert.equal(result.getRole(), "Administrator");
});

// Test 4 : mot de passe incorrect
test("Reject an incorrect password", () => {
    const result = authService.login("ahmed@example.com", "wrong");
    assert.equal(result, null);
});

// Test 5 : email inconnu
test("Reject an unknown email", () => {
    const result = authService.login("unknown@example.com", "password");
    assert.equal(result, null);
});

// Test 6 : email insensible à la casse
test("Support case-insensitive email login", () => {
    const result = authService.login("AHMED@EXAMPLE.COM", "hash123");
    assert.ok(result);
});

// Test 7 : compte membre désactivé
test("Reject login for an inactive member", () => {
    member.deactivate();
    const result = authService.login("ahmed@example.com", "hash123");
    assert.equal(result, null);
    member.activate();
});

// Test 8 : connexion refusée avec un email vide
test("Reject an empty email", () => {
    const result = authService.login("", "hash123");
    assert.equal(result, null);
});

// Test 9 : connexion refusée avec un mot de passe vide
test("Reject an empty password", () => {
    const result = authService.login("ahmed@example.com", "");
    assert.equal(result, null);
});

// Test 10 : vérifier la session après connexion
test("Set the current user after successful login", () => {
    authService.login("ahmed@example.com", "hash123");
    assert.equal(authService.getCurrentUser()?.getUserId(), 1);
});

// Test 11 : vérifier l'état authentifié
test("Return true when a user is authenticated", () => {
    authService.login("ahmed@example.com", "hash123");
    assert.equal(authService.isAuthenticated(), true);
});

// Test 12 : récupérer le rôle courant
test("Return the current user's role", () => {
    authService.login("sara@example.com", "hash456");
    assert.equal(authService.getCurrentUserRole(), "Librarian");
});

// Test 13 : déconnexion
test("Logout the current user", () => {
    authService.login("ahmed@example.com", "hash123");
    authService.logout();
    assert.equal(authService.getCurrentUser(), null);
    assert.equal(authService.isAuthenticated(), false);
});

// Test 14 : aucun rôle sans connexion
test("Return null role when no user is authenticated", () => {
    authService.logout();
    assert.equal(authService.getCurrentUserRole(), null);
});

// Test 15 : recherche par email
test("Find a user by email", () => {
    const result = authService.findUserByEmail("ahmed@example.com");
    assert.ok(result);
    assert.equal(result.getUserId(), 1);
});

// Test 16 : refuser les emails dupliqués
test("Reject duplicate email addresses", () => {
    const duplicateMember = new Member(
        4,
        "Another Member",
        "AHMED@example.com",
        "hash000",
        104,
        "MEM004",
        new Date("2026-01-01")
    );

    assert.throws(
        () => authService.addUser(duplicateMember),
        /already exists/
    );
});

// Test 17 : refuser un email vide lors de l'enregistrement
test("Reject an empty email during registration", () => {
    const invalidMember = new Member(
        5,
        "Invalid Member",
        "   ",
        "hash111",
        105,
        "MEM005",
        new Date("2026-01-01")
    );

    assert.throws(
        () => authService.addUser(invalidMember),
        /Email cannot be empty/
    );
});

// Test 18 : rechercher un utilisateur inconnu
test("Return undefined for an unknown email", () => {
    assert.equal(
        authService.findUserByEmail("missing@example.com"),
        undefined
    );
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
