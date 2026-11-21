
import { Member } from "../models/Member";

export class MemberRepository {
    private members: Member[] = [];

    // Ajouter un membre
    public add(member: Member): void {
        if (this.findById(member.getMemberId())) {
            throw new Error("Member already exists.");
        }

        this.members.push(member);
    }

    // Rechercher un membre par identifiant
    public findById(memberId: number): Member | undefined {
        return this.members.find(
            member => member.getMemberId() === memberId
        );
    }

    // Rechercher un membre par numéro d'adhésion
    public findByMembershipNumber(
        membershipNumber: string
    ): Member | undefined {
        return this.members.find(
            member => member.getMembershipNumber() === membershipNumber
        );
    }

    // Récupérer tous les membres
    public findAll(): Member[] {
        return [...this.members];
    }

    // Récupérer uniquement les membres actifs
    public findActive(): Member[] {
        return this.members.filter(member => member.getIsActive());
    }

    // Mettre à jour un membre
    public update(member: Member): boolean {
        const index = this.members.findIndex(
            item => item.getMemberId() === member.getMemberId()
        );

        if (index === -1) {
            return false;
        }

        this.members[index] = member;
        return true;
    }

    // Supprimer un membre
    public delete(memberId: number): boolean {
        const index = this.members.findIndex(
            member => member.getMemberId() === memberId
        );

        if (index === -1) {
            return false;
        }

        this.members.splice(index, 1);
        return true;
    }
}
