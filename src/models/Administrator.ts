
import { User } from "./User";

export class Administrator extends User {

    // Attribut spécifique à l'administrateur
    private accessLevel: string;

    // Constructeur de la classe Administrator
    constructor(
        userId: number,
        fullName: string,
        email: string,
        passwordHash: string,
        accessLevel: string
    ) {
        // Initialisation des attributs hérités de User
        super(userId, fullName, email, passwordHash);

        this.accessLevel = accessLevel;
    }

    // Retourne le niveau d'accès administratif
    public getAccessLevel(): string {
        return this.accessLevel;
    }

    // Implémentation du rôle de l'administrateur
    public override getRole(): string {
        return "Administrator";
    }

    // Affiche les informations de l'administrateur
    public getAdministratorDetails(): string {
        return `User ID: ${this.getUserId()}
Name: ${this.getFullName()}
Email: ${this.getEmail()}
Access Level: ${this.accessLevel}
Role: ${this.getRole()}`;
    }
}
