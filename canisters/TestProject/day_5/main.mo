import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Hash "mo:base/Hash";
import Error "mo:base/Error";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Timer "mo:base/Timer";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import IC "ic";
actor Verifier {

    public type StudentProfile = {
        name : Text;
        team : Text;
        graduate : Bool;
    };

    let studentProfilesStore : HashMap.HashMap<Principal, StudentProfile> = HashMap.HashMap<Principal, StudentProfile>(0, Principal.equal, Principal.hash);

    // STEP 1 - BEGIN
    public shared ({ caller }) func addMyProfile(profile : StudentProfile) : async Result.Result<(), Text> {
        studentProfilesStore.put(caller, profile);
        return #ok;
    };

    public shared ({ caller }) func seeAProfile(p : Principal) : async Result.Result<StudentProfile, Text> {
        switch (studentProfilesStore.get(p)) {
            case (?profile) { return #ok(profile); };
            case null { return #err("No profile found"); };
        };
    };

    public shared ({ caller }) func updateMyProfile(profile : StudentProfile) : async Result.Result<(), Text> {
        switch (studentProfilesStore.get(caller)) {
            case (?_) { studentProfilesStore.put(caller, profile); return #ok; };
            case null { return #err("No profile found"); };
        };
    };

    public shared ({ caller }) func deleteMyProfile() : async Result.Result<(), Text> {
        switch (studentProfilesStore.get(caller)) {
            case (?_) { studentProfilesStore.delete(caller); return #ok; };
            case null { return #err("No profile found"); };
        };
    };


    // STEP 1 - END
    // STEP 2 - BEGIN

    type simpleCalculatorInterface = actor {
        add : shared (n : Int) -> async Int;
        sub : shared (n : Int) -> async Int;
        reset : shared () -> async Int;
    };

    public type TestResult = Result.Result<(), TestError>;
    public type TestError = {
        #UnexpectedValue : Text;
        #UnexpectedError : Text;
    };

    public func test(canisterId : Principal) : async TestResult {
        let  simpleCalculator : simpleCalculatorInterface = actor(Principal.toText(canisterId));
        try {
            let result_3 = await simpleCalculator.reset();
            let result_1 = await simpleCalculator.add(1);
            let result_2 = await simpleCalculator.sub(2);
            if(result_2 == - 1) {
                return #ok;
            } else {
                return #err(#UnexpectedValue("Expected -1, got " # Int.toText(result_2)));
            };
        } catch (e) {
            return #err(#UnexpectedError(Error.message(e)));
        };
    };

    // STEP - 2 END

    // STEP 3 - BEGIN
    public func verifyOwnership(canisterId: Principal, p : Principal): async Result.Result<Bool, Text> {
        let managementCanister : IC.ManagementCanister = actor("aaaaa-aa");
        try {
            let statusCanister = await managementCanister.canister_status({canister_id = canisterId});
            let controllers = statusCanister.settings.controllers;
            let controllers_text = Array.map<Principal, Text>(controllers, func x = Principal.toText(x));
            switch(Array.find<Principal>(controllers, func x = p == x)){
                case (?_) { return #ok(true) };
                case null { return #ok(false) };
            };
        } catch (e) {
            return #err(Error.message(e))
        };
    };
    // STEP 3 - END

    // STEP 4 - BEGIN
    public shared ({ caller }) func verifyWork(canisterId: Principal, studentId : Principal): async Result.Result<Bool, Text> {
       switch(await verifyOwnership(canisterId, studentId)){
        case(#ok(true)){
            switch(await test(canisterId)){
                case(#ok(_)) { 
                    switch(studentProfilesStore.get(studentId)){
                        case(null){
                            return #err("Student not found, please register first!");
                        };
                        case(? profile) {
                            studentProfilesStore.put(studentId, {
                                name = profile.name;
                                team = profile.team;
                                graduate = true;
                            });
                            return #ok(true);
                        };
                    };
                };
                case(#err(_)) { return #ok(false) };
            };
        };
        case(#ok(false)) { return #ok(false) };
        case(#err(e)) { return #err(e)};
       };
    };
    // STEP 4 - END
};