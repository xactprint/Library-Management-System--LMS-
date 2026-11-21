
import assert from "node:assert/strict";

import { Member } from "../models/Member";
import { MemberService } from "../services/MemberService";

// Initialisation du service
const service = new MemberService();

// Création des membres de test
const member1 = new Member(
    20,
    "Ahmed Benali",
    "ahmed@email.com",
    "hashed_password",
    2001,
    "MEM-2026-010",
    new Date("2026-11-21")
);

const member2 = new Member(
    21,
    "Fatima Ali",
    "fatima@email.com",
    "hashed_password",
    2002,
    "MEM-2026-011",
    new Date("2026-11-21")
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

console.log("\n========== MEMBER SERVICE TESTS ==========\n");

// TEST 1 : Ajouter un membre
test("Add a member successfully", () => {
    service.addMember(member1);
    assert.equal(service.getMemberCount(), 1);
});

// TEST 2 : Ajouter un deuxième membre
test("Add another member successfully", () => {
    service.addMember(member2);
    assert.equal(service.getMemberCount(), 2);
});

// TEST 3 : Rechercher par identifiant
test("Find a member by ID", () => {
    const result = service.findMemberById(2001);

    assert.ok(result);
    assert.equal(result.getFullName(), "Ahmed Benali");
});

// TEST 4 : Rechercher un membre inexistant
test("Return undefined for an unknown member ID", () => {
    assert.equal(service.findMemberById(9999), undefined);
});

// TEST 5 : Rechercher par numéro d'adhésion
test("Find a member by membership number", () => {
    const result = service.findMemberByNumber("MEM-2026-010");

    assert.ok(result);
    assert.equal(result.getMemberId(), 2001);
});

// TEST 6 : Rechercher par e-mail
test("Find a member by email", () => {
    const result = service.findMemberByEmail("ahmed@email.com");

    assert.ok(result);
    assert.equal(result.getMemberId(), 2001);
});

// TEST 7 : Recherche e-mail insensible à la casse
test("Support case-insensitive email searches", () => {
    const result = service.findMemberByEmail("AHMED@EMAIL.COM");

    assert.ok(result);
});

// TEST 8 : Récupérer tous les membres
test("Retrieve all registered members", () => {
    assert.equal(service.getAllMembers().length, 2);
});

// TEST 9 : Récupérer les membres actifs
test("Retrieve active members", () => {
    assert.equal(service.getActiveMembers().length, 2);
});

// TEST 10 : Refuser un identifiant dupliqué
test("Reject a duplicate member ID", () => {
    const duplicate = new Member(
        22,
        "Another Member",
        "another@email.com",
        "hashed_password",
        2001,
        "MEM-2026-012",
        new Date("2026-11-21")
    );

    assert.throws(() => service.addMember(duplicate));
});

// TEST 11 : Refuser un numéro d'adhésion dupliqué
test("Reject a duplicate membership number", () => {
    const duplicate = new Member(
        23,
        "Another Member",
        "another2@email.com",
        "hashed_password",
        2003,
        "MEM-2026-010",
        new Date("2026-11-21")
    );

    assert.throws(() => service.addMember(duplicate));
});

// TEST 12 : Refuser un e-mail dupliqué
test("Reject a duplicate email", () => {
    const duplicate = new Member(
        24,
        "Another Member",
        "ahmed@email.com",
        "hashed_password",
        2004,
        "MEM-2026-013",
        new Date("2026-11-21")
    );

    assert.throws(() => service.addMember(duplicate));
});

// TEST 13 : Désactiver un membre
test("Deactivate a member", () => {
    assert.equal(service.deactivateMember(2001), true);
    assert.equal(member1.getIsActive(), false);
});

// TEST 14 : Filtrer après désactivation
test("Exclude inactive members from active members list", () => {
    assert.equal(service.getActiveMembers().length, 1);
});

// TEST 15 : Réactiver un membre
test("Activate a member", () => {
    assert.equal(service.activateMember(2001), true);
    assert.equal(member1.getIsActive(), true);
});

// TEST 16 : Refuser l'activation d'un membre inexistant
test("Reject activation of an unknown member", () => {
    assert.equal(service.activateMember(9999), false);
});

// TEST 17 : Refuser la désactivation d'un membre inexistant
test("Reject deactivation of an unknown member", () => {
    assert.equal(service.deactivateMember(9999), false);
});

// TEST 18 : Compter les membres actifs
test("Count active members", () => {
    assert.equal(service.getActiveMemberCount(), 2);
});

// TEST 19 : Compter tous les membres
test("Count all registered members", () => {
    assert.equal(service.getMemberCount(), 2);
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
