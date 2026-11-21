
import { Loan, LoanStatus } from "../models/Loan";

export class LoanRepository {
    private loans: Loan[] = [];

    // Ajouter un emprunt
    public add(loan: Loan): void {
        if (this.findById(loan.getLoanId())) {
            throw new Error("Loan already exists.");
        }

        this.loans.push(loan);
    }

    // Rechercher un emprunt par identifiant
    public findById(loanId: number): Loan | undefined {
        return this.loans.find(
            loan => loan.getLoanId() === loanId
        );
    }

    // Récupérer tous les emprunts
    public findAll(): Loan[] {
        return [...this.loans];
    }

    // Récupérer les emprunts actifs
    public findActive(): Loan[] {
        return this.loans.filter(
            loan => loan.getStatus() === LoanStatus.Active
        );
    }

    // Récupérer les emprunts d'un membre
    public findByMemberId(memberId: number): Loan[] {
        return this.loans.filter(
            loan => loan.getMember().getMemberId() === memberId
        );
    }

    // Récupérer les emprunts actifs d'un membre
    public findActiveByMemberId(memberId: number): Loan[] {
        return this.findByMemberId(memberId).filter(
            loan => loan.getStatus() === LoanStatus.Active
        );
    }

    // Mettre à jour un emprunt
    public update(loan: Loan): boolean {
        const index = this.loans.findIndex(
            item => item.getLoanId() === loan.getLoanId()
        );

        if (index === -1) {
            return false;
        }

        this.loans[index] = loan;
        return true;
    }

    // Supprimer un emprunt
    public delete(loanId: number): boolean {
        const index = this.loans.findIndex(
            loan => loan.getLoanId() === loanId
        );

        if (index === -1) {
            return false;
        }

        this.loans.splice(index, 1);
        return true;
    }
}
