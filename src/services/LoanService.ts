
import { Member } from "../models/Member";
import { BookCopy } from "../models/BookCopy";
import { Loan, LoanStatus } from "../models/Loan";

export class LoanService {

    // Liste temporaire des emprunts en mémoire
    private loans: Loan[] = [];

    // Identifiant du prochain emprunt
    private nextLoanId: number = 9001;

    // Créer un nouvel emprunt
    public borrowBook(
        member: Member,
        bookCopy: BookCopy,
        issueDate: Date,
        dueDate: Date
    ): Loan {

        // Création de l'emprunt avec vérification des règles métier
        const loan = new Loan(
            this.nextLoanId,
            member,
            bookCopy,
            issueDate,
            dueDate,
            this.loans
        );

        // Enregistrement de l'emprunt en mémoire
        this.loans.push(loan);

        this.nextLoanId++;

        return loan;
    }

    // Enregistrer le retour d'un livre
    public returnBook(
        loanId: number,
        returnDate: Date = new Date()
    ): boolean {

        const loan = this.findLoanById(loanId);

        if (!loan) {
            return false;
        }

        return loan.markAsReturned(returnDate);
    }

    // Rechercher un emprunt par son identifiant
    public findLoanById(loanId: number): Loan | undefined {

        return this.loans.find(
            loan => loan.getLoanId() === loanId
        );
    }

    // Récupérer tous les emprunts
    public getAllLoans(): Loan[] {

        return [...this.loans];
    }

    // Récupérer les emprunts actifs d'un membre
    public getActiveLoansForMember(member: Member): Loan[] {

        return this.loans.filter(
            loan =>
                loan.getMember().getMemberId() === member.getMemberId()
                && loan.getStatus() === LoanStatus.Active
        );
    }

    // Compter les emprunts actifs d'un membre
    public getActiveLoanCount(member: Member): number {

        return this.getActiveLoansForMember(member).length;
    }
}
