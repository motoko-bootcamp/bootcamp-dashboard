import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Char "mo:base/Char";
import Debug "mo:base/Debug";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Prelude "mo:base/Prelude";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
//import IC "mo:base/ExperimentalInternetComputer";
import Nat64 "mo:base/Nat64";
import Time "mo:base/Time";
import Test "test";
import U "utils";
import Bool "mo:base/Bool";
import IC "ic";
import Cycles "mo:base/ExperimentalCycles";
import Canistergeek "mo:canistergeek/canistergeek";
import Admins "admins";
import Types "types";
import Option "mo:base/Option";

shared ({ caller = creator }) actor class Dashboard() = this {

    ////////////
    // TYPES //
    ///////////

    public type Student = Types.Student;
    public type Team = Types.Team;
    public type DailyProject = Types.DailyProject;
    public type DailyProjectText = Types.DailyProjectText;
    public type DailyTotalMetrics = Types.DailyTotalMetrics;
    public type TeamString = Types.TeamString;
    public type Activity = Types.Activity;
    public type Rank = Types.Rank;
    public type StudentList = Types.StudentList;
    public type TestResult = Types.TestResult;
    public type VerifyProject = Types.VerifyProject;

    ////////////
    // STATE //
    ///////////

    stable var studentsEntries : [(Text, Student)] = [];
    var studentsHashMap : HashMap.HashMap<Text, Student> = HashMap.fromIter<Text, Student>(studentsEntries.vals(), studentsEntries.size(), Text.equal, Text.hash); //the student stored by principal id

    stable var teamIdCounter : Nat = 0;
    stable var teamsEntries : [(Text, Team)] = [];
    var teamsHashMap : HashMap.HashMap<Text, Team> = HashMap.fromIter<Text, Team>(teamsEntries.vals(), teamsEntries.size(), Text.equal, Text.hash); //the team stored by team id

    stable var activities : [Activity] = [];
    stable var purgedActivities : [Activity] = [];
    var activityBuffer : Buffer.Buffer<Activity> = Buffer.Buffer<Activity>(0);

    // Only keep the 50 last activity
    func _purgeActivity() : () {
        let numberActivity = activityBuffer.size();
        if (numberActivity < 100) {
            return
        };
        let numberToPurge = numberActivity - 50;
        var activities = Buffer.toArray(activityBuffer);
        activityBuffer.clear();
        let purgedBuffer = Buffer.Buffer<Activity>(numberToPurge);
        for (i in Iter.range(0, numberActivity - 1)) {
            if (i < numberToPurge) {
                purgedBuffer.add(activities[i])
            };
            if (i >= numberToPurge) {
                activityBuffer.add(activities[i])
            }
        };
        purgedActivities := Array.append<Activity>(purgedActivities, Buffer.toArray(purgedBuffer))
    };

    ///////////
    // ADMIN //
    ///////////

    stable var master : Principal = creator;

    stable var _AdminsUD : ?Admins.UpgradeData = null;
    let _Admins = Admins.Admins(creator);

    /**
        * Returns a list of all the admins
        */
    public query func getAdmins() : async Result.Result<[Text], Text> {
        _Monitor.collectMetrics();
        let adminsPrincipals : [Principal] = _Admins.getAdmins();
        let adminsText : [Text] = Array.map<Principal, Text>(adminsPrincipals, Principal.toText);
        return #ok(adminsText)
    };

    /**
        * Adds the specified principal as an admin
        * @auth : admin
        */
    public shared ({ caller }) func registerAdmin(id : Text) : async Result.Result<(), Text> {
        _Admins.addAdmin(Principal.fromText(id), caller);
        _Monitor.collectMetrics();
        _Logs.logMessage("CONFIG :: Added admin : " # id # " by " # Principal.toText(caller));
        return #ok()
    };

    /**
        * Removes the specified principal from the admin list
        * @auth : master
        */
    public shared ({ caller }) func unregisterAdmin(id : Text) : async Result.Result<(), Text> {
        assert (caller == master);
        _Monitor.collectMetrics();
        let p = Principal.fromText(id);
        _Admins.removeAdmin(p, caller);
        _Logs.logMessage("CONFIG :: Removed admin : " # Principal.toText(p) # " by " # Principal.toText(caller));
        return #ok()
    };

    public shared ({ caller }) func adminCreateTeam(teamName : Text, spanish : Bool) : async Result.Result<Team, Text> {
        let name = U.trim(U.lowerCase(teamName));
        if (not _Admins.isAdmin(caller)) {
            return #err("You are not an admin")
        };
        if (_isTeamNameTaken(name)) {
            return #err("Team name is already taken")
        };

        var team : Team = {
            name = U.trim(U.lowerCase(teamName));
            score = 0;
            teamMembers = [];
            spanish
        };
        teamsHashMap.put(Nat.toText(teamIdCounter), team);
        teamIdCounter := teamIdCounter + 1;

        activityBuffer.add({
            activityId = Nat.toText(activityBuffer.size());
            activity = "Welcome new team, " # name # ", to Motoko Bootcamp!";
            specialAnnouncement = "newTeam"
        });
        _purgeActivity();
        _Logs.logMessage("ADMIN :: Created team " # name # " by " # Principal.toText(caller));
        #ok(team)
    };

    public shared ({ caller }) func adminManuallyVerifyStudentDay(day : Nat, student : Text) : async Result.Result<(), Text> {
        if (not _Admins.isAdmin(caller)) {
            return #err("Unauthorized to verify student day")
        };

        if (_hasStudentCompletedDay(day, Principal.fromText(student))) {
            return #err("Student has already completed this project")
        };

        _validated(
            day,
            Principal.fromActor(this),
            Principal.fromText(student),
        );
        _Logs.logMessage("ADMIN :: Manually verified student day " # Nat.toText(day) # " for " # student # " by " # Principal.toText(caller));
        return #ok()
    };

    public shared ({ caller }) func adminManuallyChangeCliPrincipal(studentId : Text, cliPrincipal: Text) : async Result.Result<(), Text> {
        if (not _Admins.isAdmin(caller)) {
            return #err("Unauthorized to verify student day")
        };
        switch(studentsHashMap.get(studentId)){
           case(null){
            return #err("Student not found")
           };
           case(? student){
            let newStudent : Student = {
                principalId = student.principalId;
                cliPrincipalId = cliPrincipal;
                name = student.name;
                teamName = student.teamName;
                score = student.score;
                completedDays = student.completedDays;
                bonusPoints = student.bonusPoints;
            };
            studentsHashMap.put(studentId, newStudent);
            return #ok()
           };
        };
    };

    ////////////
    // LOGS ///
    //////////

    stable var _LogsUD : ?Canistergeek.LoggerUpgradeData = null;
    private let _Logs : Canistergeek.Logger = Canistergeek.Logger();

    /**
        * Returns collected log messages based on passed parameters.
        * Called from browser.
        * @auth : admin
        */
    public query ({ caller }) func getCanisterLog(request : ?Canistergeek.CanisterLogRequest) : async ?Canistergeek.CanisterLogResponse {
        assert (_Admins.isAdmin(caller));
        _Logs.getLog(request)
    };

    /**
        * Set the maximum number of saved log messages.
        * @auth : admin
        */
    public shared ({ caller }) func setMaxMessagesCount(n : Nat) : async () {
        assert (_Admins.isAdmin(caller));
        _Logs.setMaxMessagesCount(n)
    };

    //////////////
    // CYCLES  //
    /////////////

    /**
        * Add the cycles attached to the incoming message to the balance of the canister.
        */
    public func acceptCycles() : async () {
        let available = Cycles.available();
        let accepted = Cycles.accept(available);
        assert (accepted == available)
    };

    /**
        * Returns the cycle balance of the canister.
        */
    public query func availableCycles() : async Nat {
        return Cycles.balance()
    };

    ///////////////
    // METRICS ///
    /////////////

    stable var _MonitorUD : ?Canistergeek.UpgradeData = null;
    private let _Monitor : Canistergeek.Monitor = Canistergeek.Monitor();

    /**
        * Returns collected data based on passed parameters.
        * Called from browser.
        * @auth : admin
        */
    public query ({ caller }) func getCanisterMetrics(parameters : Canistergeek.GetMetricsParameters) : async ?Canistergeek.CanisterMetrics {
        assert (_Admins.isAdmin(caller));
        _Monitor.getMetrics(parameters)
    };

    /**
        * Force collecting the data at current time.
        * Called from browser or any canister "update" method.
        * @auth : admin
        */
    public shared ({ caller }) func collectCanisterMetrics() : async () {
        assert (_Admins.isAdmin(caller));
        _Monitor.collectMetrics()
    };

    ///////////////
    // STUDENTS //
    /////////////

    // Utils

    // Returns a boolean indicating whether the given principal has completed the given day.
    // If the principal doesn't correspond to a student, returns false.
    func _hasStudentCompletedDay(day : Nat, p : Principal) : Bool {
        let studentId = Principal.toText(p);
        switch (studentsHashMap.get(studentId)) {
            case (null) { return false };
            case (?student) {
                for (d in student.completedDays.vals()) {
                    if (d.day == day) {
                        return true
                    }
                };
                return false
            }
        }
    };

    // Returns a boolean indicating whether the given principal is a registered student.
    func _isStudent(p : Principal) : Bool {
        let studentId = Principal.toText(p);
        switch (studentsHashMap.get(studentId)) {
            case (null) { return false };
            case (?_) { return true }
        }
    };

    func _isStudentNameTaken(name : Text) : Bool {
        for (student in studentsHashMap.vals()) {
            if (student.name == U.trim(U.lowerCase(name))) {
                return true
            }
        };
        false
    };

    // Returns the id of the team to assign to a newly registered student (the one with the least member corresponding to the language of the student)
    func _assignTeamId(spanish : Bool, name : Text) : Text {
        if(Text.contains(name, #text("_BA"))){
            return "10";
        };
        var finalId = "";
        var minimum = 100000;
        for ((id, team) in teamsHashMap.entries()) {
            if (team.spanish == spanish) {
                if (team.teamMembers.size() < minimum) {
                    finalId := id;
                    minimum := team.teamMembers.size()
                }
            }
        };
        if(finalId == "10"){
            return "9";
        } else {
            finalId;
        };
    };

    public func getTeamName(teamId : Text) : async Text {
        _getTeamName(teamId)
    };

    func _getTeamName(teamId : Text) : Text {
        switch (teamsHashMap.get(teamId)) {
            case (null) {
                assert (false);
                return ""
            };
            case (?team) {
                return team.name
            }
        }
    };

    func _addStudentToTeam(teamName : Text, studentId : Text) : () {
        switch (teamsHashMap.get(teamName)) {
            case (null) {
                assert (false);
                return
            };
            case (?team) {
                var newTeam : Team = {
                    teamMembers = Array.append<Text>(team.teamMembers, [studentId]);
                    name = team.name;
                    score = team.score;
                    spanish = team.spanish
                };
                teamsHashMap.put(teamName, newTeam)
            }
        }
    };

    func _getStudentScore(studentId : Text) : Nat {
        switch (studentsHashMap.get(studentId)) {
            case (null) {
                _Logs.logMessage("ERROR :: Student " # studentId # " not found");
                return 0
            };
            case (?student) {
                return student.score
            }
        }
    };

    public shared query func isStudent(principal : Text) : async Bool {
        _isStudent(Principal.fromText(principal))
    };

    //Function needed for the project on Day 4 - Do not delete. See: https://github.com/motoko-bootcamp/motoko-starter/tree/main/days/day-4/project
    public shared func getAllStudentsPrincipal() : async [Principal] {
        var studentsBuffer = Buffer.Buffer<Principal>(studentsHashMap.size());
        for (id in studentsHashMap.keys()) {
            studentsBuffer.add(Principal.fromText(id))
        };
        Buffer.toArray(studentsBuffer)
    };

    public shared ({ caller }) func getStudentCompletedDays() : async Result.Result<[DailyProjectText], Text> {
        let studentId = Principal.toText(caller);
        switch (studentsHashMap.get(studentId)) {
            case (null) {
                _Logs.logMessage("ERROR: Attempting to get the completed dats of a non-registered student : " # studentId);
                return #err("Student not registered")
            };
            case (?student) {
                var completedDaysBuffer = Buffer.Buffer<DailyProjectText>(student.completedDays.size());
                for (d in student.completedDays.vals()) {
                    completedDaysBuffer.add({
                        day = Nat.toText(d.day);
                        canisterId = Principal.toText(d.canisterId);
                        timeStamp = Nat64.toText(d.timeStamp)
                    })
                };
                return #ok(Buffer.toArray(completedDaysBuffer))
            }
        }
    };

    public shared ({ caller }) func registerStudent(userName : Text, cliPrincipal : Text, spanish : Bool) : async Result.Result<Student, Text> {
        let name = U.trim(U.lowerCase(userName));
        let principalId = Principal.toText(caller);
        let teamId = _assignTeamId(spanish, userName);
        let teamName = _getTeamName(teamId);

        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous user cannot register")
        };
        if (Principal.isAnonymous(Principal.fromText(cliPrincipal))) {
            return #err("Invalid CLI Principal ID, run: dfx identity get-principal")
        };
        if (_isStudent(caller)) {
            return #err("Student already registered")
        };

        if (_isStudentNameTaken(name)) {
            return #err("Name" # name # "is already taken")
        };

        var student : Student = {
            principalId = principalId;
            cliPrincipalId = cliPrincipal;
            name = U.trim(U.lowerCase(name));
            teamName = teamName;
            score = 0;
            bonusPoints = 0;
            rank = "recruit";
            completedDays = []
        };

        studentsHashMap.put(principalId, student);
        _addStudentToTeam(teamId, principalId);
        activityBuffer.add({
            activityId = Nat.toText(activityBuffer.size());
            activity = name # " has joined team " # teamName;
            specialAnnouncement = "newTeamMember"
        });
        _purgeActivity();
        return #ok(student)
    };

    public shared func getAllStudents() : async Result.Result<[Text], Text> {
        var studentsBuffer = Buffer.Buffer<Text>(studentsHashMap.size());
        for (student in studentsHashMap.vals()) {
            studentsBuffer.add(student.name)
        };
        #ok(Buffer.toArray(studentsBuffer))
    };

    public shared func getStudent(principalId : Text) : async Result.Result<Student, Text> {
        switch (studentsHashMap.get(principalId)) {
            case (null) {
                return #err("Student not found")
            };
            case (?student) {
                #ok(student)
            }
        }
    };

    //consider methods to use a query for frontend speed
    public shared ({ caller }) func getUser() : async Result.Result<Student, Text> {
        let principalId = Principal.toText(caller);
        switch (studentsHashMap.get(principalId)) {
            case (null) {
                return #err("Student not found")
            };
            case (?student) {
                #ok(student)
            }
        }
    };

    public shared query func getTotalStudents() : async Text {
        return Nat.toText(studentsHashMap.size())
    };

    ///////////////
    // TEAMS /////
    /////////////

    func _updateTeamScore(teamName : Text) : () {
        let teamId = _getTeamIdFromName(teamName);

        switch (teamsHashMap.get(teamId)) {
            case (null) {
                _Logs.logMessage("ERROR: Attempting to update the score of a non-registered team : " # teamName);
                return
            };
            case (?team) {
                var score = 0;
                for (studentId in team.teamMembers.vals()) {
                    let studentScore = _getStudentScore(studentId);
                    score += studentScore
                };
                let size : Nat = team.teamMembers.size();
                score := Nat.div(score, size);
                teamsHashMap.put(teamId, { team with score = score })
            }
        }
    };

    func _isTeamNameTaken(name : Text) : Bool {
        for (team in teamsHashMap.vals()) {
            if (U.trim(U.lowerCase(team.name)) == U.trim(U.lowerCase(name))) {
                return true
            }
        };
        false
    };

    func _getTeamNameFromId(teamId : Text) : Text {
        switch (teamsHashMap.get(teamId)) {
            case (null) {
                assert (false);
                //Unreachable
                return ""
            };
            case (?team) {
                team.name
            }
        }
    };

    func _getTeamIdFromName(teamName : Text) : Text {
        for ((id, team) in teamsHashMap.entries()) {
            if (U.trim(U.lowerCase(team.name)) == U.trim(U.lowerCase(teamName))) {
                return id
            }
        };
        Debug.print("ERROR: Team not found : " # teamName);
        assert (false);
        return ""
    };

    public shared func getTeam(teamName : Text) : async Team {
        let teamId = _getTeamIdFromName(teamName);
        switch (teamsHashMap.get(teamId)) {
            case (null) {
                _Logs.logMessage("ERROR: Team not found : " # teamName);
                return {
                    name = "";
                    score = 0;
                    spanish = false;
                    teamMembers = []
                }
            };
            case (?team) {
                team
            }
        }
    };

    public shared query func getTotalTeams() : async Text {
        return Nat.toText(teamsHashMap.size())
    };

    public shared func getStudentsFromTeam(teamName : Text) : async Result.Result<[Student], Text> {
        for (team in teamsHashMap.vals()) {
            if (U.trim(U.lowerCase(team.name)) == U.trim(U.lowerCase(teamName))) {
                var buffer : Buffer.Buffer<Student> = Buffer.Buffer<Student>(team.teamMembers.size());
                for (studentId in team.teamMembers.vals()) {
                    switch (studentsHashMap.get(studentId)) {
                        case (null) {
                            _Logs.logMessage("ERROR: Student not found in team : " # teamName);
                            return #err("Student not found")
                        };
                        case (?student) {
                            buffer.add(student)
                        }
                    }
                };
                return #ok(Buffer.toArray(buffer))
            }
        };
        return #err("Team not found")
    };

    public shared query func getStudentsForTeamDashboard(teamName : Text) : async Result.Result<[StudentList], Text> {
        var studentBuffer = Buffer.Buffer<StudentList>(studentsHashMap.size());
        for (student in studentsHashMap.vals()) {
            if (student.teamName == teamName) {
                let studentListItem : StudentList = {
                    name = student.name;
                    score = Nat.toText(student.score);
                    bonusPoints = Nat.toText(student.bonusPoints)
                };
                studentBuffer.add(studentListItem)
            }
        };

        #ok(Buffer.toArray(studentBuffer))

    };

    //only used on frontend, delivers string as a quickfix to deal with bigints
    public shared query func getAllTeams() : async [TeamString] {
        var teamBuffer = Buffer.Buffer<TeamString>(teamsHashMap.size());
        for (team in teamsHashMap.vals()) {
            let teamString : TeamString = {
                name = team.name;
                teamMembers = team.teamMembers;
                score = Nat.toText(team.score)
            };
            teamBuffer.add(teamString)
        };
        return Buffer.toArray(teamBuffer)
    };

    /////////////////////
    // VERIFICATION /////
    ///////////////////

    func _getCliPrincipal(caller : Principal) : Principal {
        let studentId = Principal.toText(caller);
        switch (studentsHashMap.get(studentId)) {
            case (null) {
                _Logs.logMessage("ERROR: Student not found in _getCliPrincipal with id: " # studentId);
                return Principal.fromText("")
            };
            case (?student) {
                return Principal.fromText(student.cliPrincipalId)
            }
        }
    };

    public shared ({ caller }) func verifyProject(canisterIdText : Text, day : Nat) : async VerifyProject {

        let canisterId = Principal.fromText(U.trim(canisterIdText));
        // Step 1: Verify that the caller is a registered student
        if (not (_isStudent(caller))) {
            return #err(#NotAStudent("Please login or register"))
        };
        // Step 2: Verify that the caller hasn't already completed the project
        if (_hasStudentCompletedDay(day, caller)) {
            return #err(#AlreadyCompleted("You have already completed this project"))
        };
        // // Step 3: Verify that the caller is the controller of the submitted canister.
        let cliPrincipal = if (not (await Test.verifyOwnership(canisterId, _getCliPrincipal(caller)))) {
            return #err(#NotAController("You are not the controller of this canister"))
        };
        // Step 4: Run the tests (see test.mo)
        switch (day) {
            case (1) {
                switch (await Test.verifyDay1(canisterId)) {
                    case (#ok) {};
                    case (#err(e)) { return #err(e) }
                }
            };
            case (2) {
                switch (await Test.verifyDay2(canisterId)) {
                    case (#ok) {};
                    case (#err(e)) { return #err(e) }
                }
            };
            case (3) {
                switch (await Test.verifyDay3(canisterId)) {
                    case (#ok) {};
                    case (#err(e)) { return #err(e) }
                }
            };
            case (4) {
                switch (await Test.verifyDay4(canisterId)) {
                    case (#ok) {};
                    case (#err(e)) { return #err(e) }
                }
            };
            case (5) {
                switch (await Test.verifyDay5(canisterId)) {
                    case (#ok) {};
                    case (#err(e)) { return #err(e) }
                }
            };
            case (_) {
                return #err(#InvalidDay("Invalid day"))
            }
        };
        // Step 5: Update the necessary variables
        _validated(day, canisterId, caller);
        return #ok()
    };

    // Performs the necesary updates once a project is completed by a student
    // 1. Update the studentCompletedDays (in studentCompletedDaysHashMap)

    // 2. Update the studentScore (where?)
    // 3. Update the activity feed (activityHashmap) & the activity counter (activityIdCounter)
    // 4. Update the team score (teamScoreHashMap)
    // 5. Update the team members (teamMembersHashMap)
    func _validated(day : Nat, canisterId : Principal, student : Principal) : () {
        let studentId = Principal.toText(student);
        switch (studentsHashMap.get(studentId)) {
            case (null) { assert (false); return () };
            case (?student) {
                // Step 1: Add the new completed project to the student's completed projects (studentCompletedDaysHashMap)
                let completedDays = student.completedDays;
                let name = student.name;
                let projectCompleted = {
                    day = day;
                    canisterId;
                    timeStamp = Nat64.fromIntWrap(Time.now())
                };
                let newCompletedDays = Array.append<DailyProject>(completedDays, [projectCompleted]);
                // Step 2: Generate the new student's score
                let score = student.score + 20; // 20 points per completed project
                let newStudent : Student = {
                    principalId = student.principalId;
                    name;
                    teamName = student.teamName;
                    score;
                    bonusPoints = student.bonusPoints;
                    completedDays = newCompletedDays;
                    cliPrincipalId = student.cliPrincipalId
                };
                studentsHashMap.put(studentId, newStudent);
                // Step 3: Update the team score
                _updateTeamScore(student.teamName);
                // Step 4: Update the activity feed & the activity counter
                activityBuffer.add({
                    activityId = Nat.toText(activityBuffer.size());
                    activity = student.name # " has completed day " # Nat.toText(day) # " of the competition!";
                    specialAnnouncement = "ProjectCompleted"
                });
                _purgeActivity();
                return
            }
        }
    };

    /////////////////////
    // ACTIVITY ////////
    ///////////////////

    public shared ({ caller }) func adminSpecialAnnouncement(announcement : Text) : async () {
        assert (_Admins.isAdmin(caller));
        activityBuffer.add({
            activityId = Nat.toText(activityBuffer.size());
            activity = announcement;
            specialAnnouncement = "Admin"
        });
        _purgeActivity()
    };

    public shared ({ caller }) func adminAnnounceTimedEvent(announcement : Text) : async () {
        assert (_Admins.isAdmin(caller));
        activityBuffer.add({
            activityId = Nat.toText(activityBuffer.size());
            activity = announcement;
            specialAnnouncement = "AdminTimeEvent"
        });
        _purgeActivity()
    };

    public shared ({ caller }) func adminGrantBonusPoints(studentId : Text, reason : Text) : async Result.Result<(), Text> {
        assert (_Admins.isAdmin(caller));
        switch (studentsHashMap.get(studentId)) {
            case (null) { return #err("Student not found") };
            case (?student) {
                let bonus = student.bonusPoints + 10;
                var newStudent = { student with bonusPoints = bonus };
                studentsHashMap.put(studentId, newStudent);
                activityBuffer.add({
                    activityId = Nat.toText(activityBuffer.size());
                    activity = student.name # " has been granted bonus points for " # reason;
                    specialAnnouncement = "BonusPoints"
                });
                _purgeActivity()
            }
        };
        return #ok(())
    };

    public shared func getStudentPrincipalByName(studentName : Text) : async Result.Result<Text, Text> {
        let nameTrimmed = U.trim(U.lowerCase(studentName));
        for ((studentId, student) in studentsHashMap.entries()) {
            if (U.trim(U.lowerCase(student.name)) == nameTrimmed) {
                return #ok(studentId)
            }
        };
        return #err("The student does not exist")
    };

    // public shared query func getActivity(lowerBound : Nat, upperBound : Nat) : async [Activity] {
    //     var activityBuffer = Buffer.Buffer<Activity>(1);
    //     for (activity in activityBuffervals()) {
    //         if (U.textToNat(activity.activityId) >= lowerBound and U.textToNat(activity.activityId) <= upperBound) {
    //             activityBuffer.add(activity)
    //         }
    //     };

    //     return Buffer.toArray(activityBuffer)
    // };

    public shared query func getActivityFeed() : async [Activity] {
        Buffer.toArray(activityBuffer)
    };

    public shared query func getTotalProjectsCompleted() : async Text {
        var projectsCompleted = 0;
        for (student in studentsHashMap.vals()) {
            projectsCompleted += Array.size(student.completedDays)
        };
        Nat.toText(projectsCompleted)
    };

    public shared query func getTotalCompletedPerDay() : async DailyTotalMetrics {
        var day1 = 0;
        var day2 = 0;
        var day3 = 0;
        var day4 = 0;
        var day5 = 0;

        for (student in studentsHashMap.vals()) {
            let completedDays = student.completedDays;
            for (day in completedDays.vals()) {
                switch (day.day) {
                    case (1) { day1 := day1 + 1 };
                    case (2) { day2 := day2 + 1 };
                    case (3) { day3 := day3 + 1 };
                    case (4) { day4 := day4 + 1 };
                    case (5) { day5 := day5 + 1 };
                    case (_) {
                        _Logs.logMessage("ERROR : Invalid day number in getTotalCompletedPerDay")
                    }
                }
            }
        };
        return {
            day1 = Nat.toText(day1);
            day2 = Nat.toText(day2);
            day3 = Nat.toText(day3);
            day4 = Nat.toText(day4);
            day5 = Nat.toText(day5)
        }
    };

    //#Upgrade hooks
    system func preupgrade() {
        _MonitorUD := ?_Monitor.preupgrade();
        _AdminsUD := ?_Admins.preupgrade();
        _LogsUD := ?_Logs.preupgrade();
        studentsEntries := Iter.toArray(studentsHashMap.entries());
        teamsEntries := Iter.toArray(teamsHashMap.entries());
        activities := Buffer.toArray(activityBuffer)
    };

    system func postupgrade() {
        _Admins.postupgrade(_AdminsUD);
        _AdminsUD := null;
        _Monitor.postupgrade(_MonitorUD);
        _MonitorUD := null;
        _Logs.postupgrade(_LogsUD);
        _LogsUD := null;
        studentsEntries := [];
        teamsEntries := [];
        activityBuffer := Buffer.fromArray(activities);
        activities := []
    };

}
