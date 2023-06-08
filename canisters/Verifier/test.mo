import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Float "mo:base/Float";
import Error "mo:base/Error";
import IC "ic";
import Utils "utils";
import Array "mo:base/Array";
import Bool "mo:base/Bool";
import Time "mo:base/Time";
import Prelude "mo:base/Prelude";
import Blob "mo:base/Blob";
import Text "mo:base/Text";
module Test {
    // Assumptions during tests
    // No other actor/user is calling the canister and modifying the state

    // BEGIN - General
    public type TestResult = Result.Result<(), TestError>;
    public type TestError = {
        #UnexpectedError : Text;
        #UnexpectedValue : Text;
        #NotAController : Text;
        #AlreadyCompleted : Text;
        #NotImplemented : Text; // TODO
    };

    // Check if p is among the controllers of the canister with canisterId
    public func verifyOwnership(canisterId : Principal, p : Principal) : async Bool {
        let managementCanister : IC.ManagementCanister = actor ("aaaaa-aa");
        try {
            let statusCanister = await managementCanister.canister_status({
                canister_id = canisterId
            });
            let controllers = statusCanister.settings.controllers;
            let controllers_text = Array.map<Principal, Text>(controllers, func x = Principal.toText(x));
            switch (Array.find<Principal>(controllers, func x = p == x)) {
                case (?_) { return true };
                case null { return false }
            }
        } catch (e) {
            let message = Error.message(e);
            let controllers = Utils.parseControllersFromCanisterStatusErrorIfCallerNotController(message);
            let controllers_text = Array.map<Principal, Text>(controllers, func x = Principal.toText(x));
            switch (Array.find<Principal>(controllers, func x = p == x)) {
                case (?_) { return true };
                case null { return false }
            }
        }
    };

    // END - General

    // BEGIN - Day 1
    public type day1Interface = actor {
        add : shared (x : Float) -> async Float;
        sub : shared (x : Float) -> async Float;
        mul : shared (x : Float) -> async Float;
        div : shared (x : Float) -> async Float;
        reset : shared () -> async ();
        see : shared query () -> async Float;
        power : shared (x : Float) -> async Float;
        sqrt : shared () -> async Float;
        floor : shared () -> async Int
    };

    public func verifyDay1(canisterId : Principal) : async TestResult {
        let day1Actor : day1Interface = actor (Principal.toText(canisterId));
        try {
            ignore day1Actor.reset(); // State : 0
            ignore day1Actor.add(2.0); // State : 2.0
            ignore day1Actor.power(2.0); // State : 4.0
            ignore day1Actor.sub(1.0); // State : 3.0
            ignore day1Actor.mul(2.0); // State : 6.0
            ignore day1Actor.div(2.0); // State : 3.0
            let result = await day1Actor.see(); // State : 3.0

            if (result == 3) {
                return #ok()
            } else {
                return #err(#UnexpectedValue("Expected 3, got " # Float.toText(result)))
            }
        } catch (e) {
            return #err(#UnexpectedError(Error.message(e)))
        }
    };

    // END - Day 1

    // BEGIN - Day 2
    public type Time = Time.Time;
    public type Homework = {
        title : Text;
        description : Text;
        dueDate : Time;
        completed : Bool;
    };
    public type day2Interface = actor {
        addHomework: shared (homework: Homework) -> async Nat;
        getHomework: shared query (id: Nat) -> async Result.Result<Homework, Text>;
        updateHomework: shared (id: Nat, homework: Homework) -> async Result.Result<(), Text>;
        markAsCompleted: shared (id: Nat) -> async Result.Result<(), Text>;
        deleteHomework: shared (id: Nat) -> async Result.Result<(), Text>;
        getAllHomework: shared query () -> async [Homework];
        getPendingHomework: shared query () -> async [Homework];
        searchHomework: shared query (searchTerm: Text) -> async [Homework];
    };
    
    public func verifyDay2(canisterId : Principal) : async TestResult {
        let day2Actor : day2Interface = actor (Principal.toText(canisterId));
         try {
            let homeworkTest : Homework = {
                title = "Test";
                description = "Test";
                dueDate = Time.now();
                completed = false;
            };
            let id = await day2Actor.addHomework(homeworkTest);
            let result = await day2Actor.markAsCompleted(id); 
            switch(await day2Actor.getHomework(id)){
                case (#ok(homework)) {
                    if (homework.completed == true and homework.title == "Test" and homework.description == "Test") {
                        return #ok()
                    } else {
                        return #err(#UnexpectedValue("Homework doesn't corresponds with test"));
                    }
                };
                case (#err(message)) { return #err(#UnexpectedError("Homework not found")) }
            };
        } catch (e) {
            return #err(#UnexpectedError(Error.message(e)))
        }
    };
    // END - Day 2

    // BEGIN - Day 3
    public type Content = {
        #Text : Text;
        #Image : Blob;
        #Survey : Survey;
    };
    public type Message = {
        content : Content;
        vote : Int;
        creator : Principal;
    };

    public type Answer = (
        description : Text, 
        numberOfVotes : Nat 
    );
    public type Survey = {
        title : Text; 
        answers : [Answer]; 
    };

    public type day3Interface = actor {
        writeMessage: shared (c : Content) -> async Nat;
        getMessage: shared query (messageId : Nat) -> async Result.Result<Message, Text>;
        updateMessage: shared (messageId : Nat, c : Content) -> async Result.Result<(), Text>;
        deleteMessage: shared (messageId : Nat) -> async Result.Result<(), Text>;
        upVote: shared (messageId  : Nat) -> async Result.Result<(), Text>;
        downVote: shared (messageId  : Nat) -> async Result.Result<(), Text>;
        getAllMessages : query () -> async [Message];
        getAllMessagesRanked : query () -> async [Message];
    };


    public func verifyDay3(canisterId : Principal) : async TestResult {
        let day3Actor : day3Interface = actor (Principal.toText(canisterId));
         try {
            let contentTest : Content = #Text("Test");
            let id = await day3Actor.writeMessage(contentTest); 
            ignore day3Actor.upVote(id);
            ignore day3Actor.upVote(id);
            ignore day3Actor.downVote(id);
            ignore day3Actor.updateMessage(id, #Image(Blob.fromArray([0, 1, 2])));
            let resultTest = await day3Actor.getMessage(id);
            switch(resultTest){
                case(#err(e)){
                    return #err(#UnexpectedError("Message not found"))
                };
                case(#ok(message)){
                    switch(message.content){
                        case(#Image(blob)){
                            if(Blob.equal(blob, Blob.fromArray([0, 1, 2])) and message.vote == 1){
                                return #ok()
                            } else {
                                return #err(#UnexpectedValue("Blob doesn't corresponds with test"))
                            }
                        };
                        case(_){
                            return #err(#UnexpectedValue("Content doesn't corresponds with test"))
                        }
                    };
                };
            };
        } catch (e) {
            return #err(#UnexpectedError(Error.message(e)))
        }
    };
    // END - Day 3

    // BEGIN - Day 4
    type Subaccount = Blob;
    type Account = {
        owner : Principal;
        subaccount : ?Subaccount;
    };
    public type day4Interface = actor {
        name : shared query () -> async Text;
        symbol : shared query () -> async Text;
        totalSupply : shared query () -> async Nat;
        balanceOf : shared query (account : Account) -> async (Nat);
        transfer : shared (from : Account, to : Account, amount : Nat) -> async Result.Result<(), Text>;
        airdrop : shared () -> async Result.Result<(),Text>;
    };
    public func verifyDay4(canisterId : Principal) : async TestResult {
        let day4Actor : day4Interface = actor (Principal.toText(canisterId));
         try {
            let name = await day4Actor.name();
            if(not (name == "MotoCoin")){
                return #err(#UnexpectedValue("Name doesn't corresponds with MotoCoin"))
            };
            let symbol = await day4Actor.symbol();
            if(not (symbol == "MOC")){
                return #err(#UnexpectedValue("Symbol doesn't corresponds with MOC"))
            };
            ignore day4Actor.airdrop();
            let accountDfxSeb = {
                owner = Principal.fromText("2ujkt-fujau-bunuv-gt4b6-2s27j-cv5qi-kddkp-jl7m4-wdj3e-bqdrt-qqe");
                subaccount = null;
            };
            let balanceOf = await day4Actor.balanceOf(accountDfxSeb);
            if(balanceOf < 100){
                return #err(#UnexpectedValue("Airdrop didn't work, my balance is still git "))
            };
            return #ok()
        } catch (e) {
            return #err(#UnexpectedError(Error.message(e)))
        }
    };
    // END - Day 4

    // BEGIN - Day 5
    public type Result = { #ok : Bool; #err : Text };
    public type Result_1 = { #ok; #err : Text };
    public type Result_2 = { #ok : StudentProfile; #err : Text };
    public type StudentProfile = { graduate : Bool; name : Text; team : Text };

    public type day5Interface = actor {
        acceptCycles : shared () -> async ();
        addMyProfile : shared StudentProfile -> async Result_1;
        availableCycles : shared query () -> async Nat;
        deleteMyProfile : shared () -> async Result_1;
        seeAProfile : shared Principal -> async Result_2;
        test : shared Principal -> async TestResult;
        updateMyProfile : shared StudentProfile -> async Result_1;
        verifyOwnership : shared (Principal, Principal) -> async Result;
        verifyWork : shared (Principal, Principal) -> async Result;
    };

    let verifierId : Text = "rww3b-zqaaa-aaaam-abioa-cai";
    let simpleCalculator1Id : Text = "e35fa-wyaaa-aaaaj-qa2dq-cai"; // Pass ✅
    let simpleCalculator2Id : Text = "fwtbo-zqaaa-aaaaj-qa2ea-cai"; // Fail ❌
    let simpleCalculator3Id : Text = "frsh2-uiaaa-aaaaj-qa2eq-cai"; // Not owner 🟡

    public func verifyDay5(canisterId : Principal) : async TestResult {
         let day5Actor : day5Interface = actor (Principal.toText(canisterId));
         try {
            ignore day5Actor.addMyProfile({ graduate = false; name = "Seb"; team = "Motoko Bootcamp" });

            // Verifying three projects 
            let simpleCalculator1Async = day5Actor.verifyWork(Principal.fromText(simpleCalculator1Id), Principal.fromText(verifierId));
            let simpleCalculator2Async = day5Actor.verifyWork(Principal.fromText(simpleCalculator2Id), Principal.fromText(verifierId));
            let simpleCalculator3Async = day5Actor.verifyWork(Principal.fromText(simpleCalculator3Id), Principal.fromText(verifierId));

            // Expected [ok, err, err]
            let results = [await simpleCalculator1Async, await simpleCalculator2Async, await simpleCalculator3Async];
            switch(results[0]){
                case(#ok(isVerified)){
                    if(not(isVerified)){
                        return #err(#UnexpectedValue("Calculator with id : " # simpleCalculator1Id # " should pass verification through your verifier"));
                    };
                };
                case(#err(e)){
                    return #err(#UnexpectedError("Unexpected error : " # e))
                };
            };
            switch(results[1]){
                case(#ok(isVerified)){
                    if(isVerified){
                        return #err(#UnexpectedValue("Calculator with id : " # simpleCalculator2Id # " should fail verification through your verifier"));
                    };
                };
                case(#err(e)){
                    return #err(#UnexpectedError("Unexpected error : " # e))
                };
            };
            switch(results[2]){
                case(#ok(isVerified)){
                    if(isVerified){
                        return #err(#UnexpectedValue("Calculator with id : " # simpleCalculator3Id # " should fail verification through your verifier"));
                    };
                };
                case(#err(e)){
                    return #err(#UnexpectedError("Unexpected error : " # e))
                };
            };
            return #ok()
        } catch (e) {
            return #err(#UnexpectedError(Error.message(e)))
        }

    };
    // END - Day 5

}
