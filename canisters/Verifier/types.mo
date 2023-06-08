import Test "test";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
module {
    public type Student = {
        principalId : Text;
        cliPrincipalId : Text;
        name : Text;
        teamName : Text;
        score : Nat;
        completedDays : [DailyProject];
        bonusPoints : Nat
    };

    public type Team = {
        name : Text;
        score : Nat;
        spanish : Bool;
        teamMembers : [Text]
    };

    public type DailyProject = {
        day : Nat;
        canisterId : Principal;
        timeStamp : Nat64
    };

    public type DailyProjectText = {
        day : Text;
        canisterId : Text;
        timeStamp : Text
    };

    public type DailyTotalMetrics = {
        day1 : Text;
        day2 : Text;
        day3 : Text;
        day4 : Text;
        day5 : Text
    };

    public type TeamString = {
        name : Text;
        teamMembers : [Text];
        score : Text
    };

    public type Activity = {
        activityId : Text;
        activity : Text;
        specialAnnouncement : Text; //We may want to customize these and add more as we go to parse on the frontend.
        //so far, we can use: "newProject", "newStudent", "newTeam", "newAdmin", "newRank", "newTeamScore", "LectureEvent"
    };

    public type Rank = {
        #recruit : Text;
        #cyberNovice : Text;
        #dataDefender : Text;
        #motokoMarksman : Text;
        #asyncSergeant : Text;
        #ghostNavigator : Text;
        #digitalCaptain : Text;
        #networkNoble : Text;
        #aiArchitect : Text;
        #quantumConsul : Text
    };

    public type StudentList = {
        name : Text;
        score : Text;
        bonusPoints : Text
    };

    public type TestResult = Test.TestResult;
    public type VerifyProject = TestResult or Result.Result<(), { #NotAController : Text; #NotAStudent : Text; #InvalidDay : Text; #AlreadyCompleted : Text }>
}
