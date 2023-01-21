import { LaAtom } from "./la-atom";

import { Tools } from "../shared";

export class LaTeamMember extends LaAtom {
    guidKey: string;
    teamName: string;
    leader: string;
    member: string;
    invited: string;
    active: string;
    workspace:string;
    pattern:string;


    constructor(properties?: any) {
        super(properties);
    }

    isLeaderRecord() {
        return Tools.matches(this.leader,this.member);
    }

    scoreForSorting(){
        let isLeader = this.isLeaderRecord();
        if ( isLeader ) {
            return 100;
        }
        return 10;
    }

    memberCompare(other: LaTeamMember):number {
        let leader = this.isLeaderRecord();
        let score = this.scoreForSorting() - other.scoreForSorting();
        if ( score == 0 && !leader ){
            this.member < other.member;
        }
        return score;
      }
}

export class LaTeam extends LaAtom {
    teamName:string;
    leader:string;
    workspace:string;
    pattern:string;
    godMode:boolean = false;

    members: Array<LaTeamMember> = new Array<LaTeamMember>();

    constructor(properties?: any) {
        super(properties);
    }

    addMember(item:LaTeamMember) {
        this.members.push(item);
    }

    canDelete(){
        if ( this.teamName == 'Leaders') return false;
        return true;
    }
}

