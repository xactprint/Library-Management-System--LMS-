
import { Book } from "./Book";

// Enumération des états possibles d'un exemplaire
export enum CopyStatus {
    Available = "Available",
    Issued = "Issued"
}

export class BookCopy {

    // Attributs privés : protégés contre les modifications directes
    private copyId: number;
    private book: Book;
    private status: CopyStatus;
    private shelfLocation: string;

    // Constructeur : initialise un nouvel exemplaire
    constructor(
        copyId: number,
        book: Book,
        shelfLocation: string
    ) {
        this.copyId = copyId;
        this.book = book;
        this.shelfLocation = shelfLocation;

        // Par défaut, un nouvel exemplaire est disponible
        this.status = CopyStatus.Available;
    }

    // Getters : permettent de consulter les informations
    public getCopyId(): number {
        return this.copyId;
    }

    public getBook(): Book {
        return this.book;
    }

    public getStatus(): CopyStatus {
        return this.status;
    }

    public getShelfLocation(): string {
        return this.shelfLocation;
    }

    // Vérifie si l'exemplaire est disponible
    public checkAvailability(): boolean {
        return this.status === CopyStatus.Available;
    }

    // Marque l'exemplaire comme emprunté
    public markAsIssued(): boolean {

        // Vérifie d'abord que l'exemplaire est disponible
        if (!this.checkAvailability()) {
            return false;
        }

        this.status = CopyStatus.Issued;
        return true;
    }

    // Rend l'exemplaire disponible après un retour validé
    public markAsAvailable(): void {
        this.status = CopyStatus.Available;
    }

    // Affiche les informations de l'exemplaire
    public getCopyDetails(): string {
        return `Copy ID: ${this.copyId}
Book: ${this.book.getTitle()}
Status: ${this.status}
Shelf Location: ${this.shelfLocation}`;
    }
}
