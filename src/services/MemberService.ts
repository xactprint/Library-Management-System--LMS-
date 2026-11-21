
import { Member } from "../models/Member";

export class MemberService {

    // Liste temporaire des membres enregistrés
    private members: Member[] = [];

    // Enregistrer un nouveau membre
    public addMember(member: Member): void {

        // Vérifier l'unicité de l'identifiant
        if (this.findMemberById(member.getMemberId())) {
            throw new Error("A member with this ID already exists.");
        }

        // Vérifier l'unicité du numéro d'adhésion
        if (this.findMemberByNumber(member.getMembershipNumber())) {
            throw new Error("A member with this membership number already exists.");
        }

        // Vérifier l'unicité de l'adresse e-mail
        if (this.findMemberByEmail(member.getEmail())) {
            throw new Error("A member with this email already exists.");
        }

        // Vérifier les informations obligatoires
        if (
            !member.getFullName().trim() ||
            !member.getEmail().trim() ||
            !member.getMembershipNumber().trim()
        ) {
            throw new Error("Member information cannot be empty.");
        }

        // Ajouter le membre à la collection
        this.members.push(member);
    }

    // Rechercher un membre par son identifiant
    public findMemberById(memberId: number): Member | undefined {

        return this.members.find(
            member => member.getMemberId() === memberId
        );
    }

    // Rechercher un membre par son numéro d'adhésion
    public findMemberByNumber(membershipNumber: string): Member | undefined {

        const searchNumber = membershipNumber.trim().toLowerCase();

        return this.members.find(
            member =>
                member.getMembershipNumber().trim().toLowerCase()
                === searchNumber
        );
    }

    // Rechercher un membre par son adresse e-mail
    public findMemberByEmail(email: string): Member | undefined {

        const searchEmail = email.trim().toLowerCase();

        return this.members.find(
            member => member.getEmail().trim().toLowerCase() === searchEmail
        );
    }

    // Récupérer tous les membres
    public getAllMembers(): Member[] {

        return [...this.members];
    }

    // Récupérer uniquement les membres actifs
    public getActiveMembers(): Member[] {

        return this.members.filter(
            member => member.getIsActive()
        );
    }

    // Activer un membre
    public activateMember(memberId: number): boolean {

        const member = this.findMemberById(memberId);

        if (!member) {
            return false;
        }

        member.activate();

        return true;
    }

    // Désactiver un membre
    public deactivateMember(memberId: number): boolean {

        const member = this.findMemberById(memberId);

        if (!member) {
            return false;
        }

        member.deactivate();

        return true;
    }

    // Compter les membres enregistrés
    public getMemberCount(): number {

        return this.members.length;
    }

    // Compter les membres actifs
    public getActiveMemberCount(): number {

        return this.getActiveMembers().length;
    }
}
