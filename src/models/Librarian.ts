
import { User } from "./User";

export class Librarian extends User {

    // Attributs spécifiques au bibliothécaire
    private employeeId: number;
    private hireDate: Date;

    // Constructeur de la classe Librarian
    constructor(
        userId: number,
        fullName: string,
        email: string,
        passwordHash: string,
        employeeId: number,
        hireDate: Date
    ) {
        // Initialisation des attributs hérités de User
        super(userId, fullName, email, passwordHash);

        this.employeeId = employeeId;
        this.hireDate = hireDate;
    }

    // Retourne l'identifiant professionnel
    public getEmployeeId(): number {
        return this.employeeId;
    }

    // Retourne la date de recrutement
    public getHireDate(): Date {
        return this.hireDate;
    }

    // Implémentation du rôle du bibliothécaire
    public override getRole(): string {
        return "Librarian";
    }

    // Affiche les informations du bibliothécaire
    public getLibrarianDetails(): string {
        return `Employee ID: ${this.employeeId}
User ID: ${this.getUserId()}
Name: ${this.getFullName()}
Email: ${this.getEmail()}
Hire Date: ${this.hireDate.toDateString()}
Role: ${this.getRole()}`;
    }
}
