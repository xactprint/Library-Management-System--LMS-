
import { PasswordVerifier } from "../security/PasswordVerifier";

export abstract class User {

    // Attributs communs à tous les utilisateurs
    private userId: number;
    private fullName: string;
    private email: string;
    private passwordHash: string;

    // Constructeur de la classe abstraite
    constructor(
        userId: number,
        fullName: string,
        email: string,
        passwordHash: string
    ) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    // Getters : permettent de consulter les informations autorisées
    public getUserId(): number {
        return this.userId;
    }

    public getFullName(): string {
        return this.fullName;
    }

    public getEmail(): string {
        return this.email;
    }

    // Vérifier le mot de passe sans exposer son empreinte
    public verifyPassword(
        password: string,
        verifier: PasswordVerifier
    ): boolean {
        return verifier.verify(password, this.passwordHash);
    }

    // Chaque sous-classe doit définir son propre rôle
    public abstract getRole(): string;
}
