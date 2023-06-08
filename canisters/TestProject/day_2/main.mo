import Buffer "mo:base/Buffer";
import Type "types";
import Result "mo:base/Result";
import Array "mo:base/Array";
actor {
  type Homework = Type.Homework;
  var homeworkDiary = Buffer.Buffer<Homework>(0);
  public shared func addHomework(homework : Homework) : async Nat {
    homeworkDiary.add(homework);
    //corresponding to the index after adding the book
    homeworkDiary.size() - 1;
  };
  public shared query func getHomework(id : Nat) : async Result.Result<Homework, Text> {
    if (id >= homeworkDiary.size()) {
      return #err("Invalid homework id");
    };
    return #ok(homeworkDiary.get(id));
  };
  public shared func updateHomework(id : Nat, homework : Homework) : async Result.Result<(), Text> {
    if (id >= homeworkDiary.size()) {
      return #err("Invalid homework id");
    };
    homeworkDiary.put(id, homework);
    #ok();
  };
  //unit type means an empty tuple type or the function doesn't return any specific type
  public shared func deleteHomework(id : Nat) : async Result.Result<(), Text> {
    if (id >= homeworkDiary.size()) {
      return #err("Invalid homework id");
    };
    let currentHomework = homeworkDiary.remove(id);
    #ok();
  };
  public shared query func getAllHomework() : async [Homework] {
    Buffer.toArray(homeworkDiary);
  };
  //not in the actor interface
  public shared func markAsCompleted(id : Nat) : async Result.Result<(), Text> {
    if (id >= homeworkDiary.size()) {
      return #err("Invalid homework id");
    };
    var currentHomework = homeworkDiary.get(id);
    //since the Homework type is shared (immutable), we can't just change the completed field to true
    let homework = homeworkDiary.remove(id);
    homeworkDiary.add({
      title = currentHomework.title;
      dueDate = currentHomework.dueDate;
      completed = true;
      description = currentHomework.description;
    });
    #ok();
  };
  public shared query func getPendingHomework() : async [Homework] {
    let result = Buffer.Buffer<Homework>(0);
    Buffer.iterate<Homework>(
      homeworkDiary,
      func(homework) {
        if (not (homework.completed)) result.add(homework);
      },
    );
    Buffer.toArray(result);
  };
  public shared query func searchHomework(searchTerm : Text) : async [Homework] {
    let result = Buffer.Buffer<Homework>(0);
    Buffer.iterate<Homework>(
      homeworkDiary,
      func(homework) {
        if (homework.title == searchTerm or homework.description == searchTerm) result.add(homework);
      },
    );
    Buffer.toArray(result);
  };
};