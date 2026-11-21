
import { Member } from "./Member";
import { BookCopy } from "./BookCopy";

// États possibles d'un emprunt
export enum LoanStatus {
    Active = "Active",
    Returned = "Returned"
}

export class Loan {

    // Attributs privés de l'emprunt
    private loanId: number;
    private member: Member;
    private bookCopy: BookCopy;
    private issueDate: Date;
    private dueDate: Date;
    private returnDate: Date | null;
    private status: LoanStatus;

    // Constructeur de la classe Loan
    constructor(
        loanId: number,
        member: Member,
        bookCopy: BookCopy,
        issueDate: Date,
        dueDate: Date,
        existingLoans: Loan[] = []
    ) {
        // Vérifie que le membre possède une adhésion active
        if (!member.getIsActive()) {
            throw new Error("The member account is inactive.");
        }

        // Vérifie que la date limite est postérieure à la date d'emprunt
        if (dueDate.getTime() <= issueDate.getTime()) {
            throw new Error("The due date must be after the issue date.");
        }

        // Vérifie le nombre d'emprunts actifs du membre
        const activeLoans = existingLoans.filter(
            loan =>
                loan.getMember().getMemberId() === member.getMemberId()
                && loan.getStatus() === LoanStatus.Active
        );

        if (activeLoans.length >= 3) {
            throw new Error("The member has reached the loan limit.");
        }

        // Vérifie la disponibilité de l'exemplaire
        if (!bookCopy.checkAvailability()) {
            throw new Error("The book copy is not available.");
        }

        // Initialisation des attributs
        this.loanId = loanId;
        this.member = member;
        this.bookCopy = bookCopy;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.returnDate = null;
        this.status = LoanStatus.Active;

        // Marque l'exemplaire comme emprunté
        bookCopy.markAsIssued();
    }

    // Getters : consultation des informations
    public getLoanId(): number {
        return this.loanId;
    }

    public getMember(): Member {
        return this.member;
    }

    public getBookCopy(): BookCopy {
        return this.bookCopy;
    }

    public getIssueDate(): Date {
        return this.issueDate;
    }

    public getDueDate(): Date {
        return this.dueDate;
    }

    public getReturnDate(): Date | null {
        return this.returnDate;
    }

    public getStatus(): LoanStatus {
        return this.status;
    }

    // Vérifie si l'emprunt est toujours actif
    public isActive(): boolean {
        return this.status === LoanStatus.Active;
    }

    // Enregistre le retour de l'exemplaire
    public markAsReturned(returnDate: Date = new Date()): boolean {

        // Empêche de retourner deux fois le même emprunt
        if (!this.isActive()) {
            return false;
        }

        // Vérifie que la date de retour est valide
        if (returnDate.getTime() < this.issueDate.getTime()) {
            return false;
        }

        this.returnDate = returnDate;
        this.status = LoanStatus.Returned;

        // L'exemplaire redevient disponible
        this.bookCopy.markAsAvailable();

        return true;
    }

    // Calcule le nombre de jours de retard
    public getOverdueDays(referenceDate: Date = new Date()): number {

        // Un emprunt retourné utilise sa date de retour.
        // Un emprunt actif utilise la date de référence.
        const endDate = this.returnDate ?? referenceDate;

        // Comparaison des dates sans tenir compte des heures
        const due = Date.UTC(
            this.dueDate.getFullYear(),
            this.dueDate.getMonth(),
            this.dueDate.getDate()
        );

        const end = Date.UTC(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
        );

        const difference = end - due;

        return Math.max(0, Math.floor(difference / 86400000));
    }

    // Affiche les informations de l'emprunt
    public getLoanDetails(): string {
        return `Loan ID: ${this.loanId}
Member: ${this.member.getFullName()}
Book: ${this.bookCopy.getBook().getTitle()}
Copy ID: ${this.bookCopy.getCopyId()}
Issue Date: ${this.issueDate.toDateString()}
Due Date: ${this.dueDate.toDateString()}
Return Date: ${this.returnDate?.toDateString() ?? "Not returned"}
Status: ${this.status}
Overdue Days: ${this.getOverdueDays()}`;
    }
}
