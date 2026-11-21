
import { User } from "./User";

export class Member extends User {

    // Attributs spécifiques au membre
    private memberId: number;
    private membershipNumber: string;
    private registrationDate: Date;
    private isActive: boolean;

    // Constructeur de la classe Member
    constructor(
        userId: number,
        fullName: string,
        email: string,
        passwordHash: string,
        memberId: number,
        membershipNumber: string,
        registrationDate: Date
    ) {
        // Appel du constructeur de la classe parente
        super(userId, fullName, email, passwordHash);

        this.memberId = memberId;
        this.membershipNumber = membershipNumber;
        this.registrationDate = registrationDate;
        this.isActive = true;
    }

    // Getters des attributs spécifiques
    public getMemberId(): number {
        return this.memberId;
    }

    public getMembershipNumber(): string {
        return this.membershipNumber;
    }

    public getRegistrationDate(): Date {
        return this.registrationDate;
    }

    public getIsActive(): boolean {
        return this.isActive;
    }

    // Retourne le rôle de l'utilisateur
    public getRole(): string {
        return "Member";
    }

    // Désactive l'adhésion du membre
    public deactivate(): void {
        this.isActive = false;
    }

    // Réactive l'adhésion du membre
    public activate(): void {
        this.isActive = true;
    }

    // Affiche les informations du membre
    public getMemberDetails(): string {
        return `Member ID: ${this.memberId}
User ID: ${this.getUserId()}
Name: ${this.getFullName()}
Email: ${this.getEmail()}
Membership Number: ${this.membershipNumber}
Registration Date: ${this.registrationDate.toDateString()}
Active: ${this.isActive}
Role: ${this.getRole()}`;
    }
}
