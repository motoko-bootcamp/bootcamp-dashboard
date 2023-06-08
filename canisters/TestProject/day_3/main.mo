import Type "types";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";

actor StudentWall {
  type Message = Type.Message;
  type Content = Type.Content;
  type Survey = Type.Survey;
  type Answer = Type.Answer;

  var messageId : Nat = 0; 
  let wall : HashMap.HashMap<Nat, Message> = HashMap.HashMap<Nat, Message>(0, Nat.equal, Nat32.fromNat);

  public shared ({ caller }) func writeMessage(c : Content) : async Nat {
    let message : Message = { content = c; vote = 0; creator = caller };
    let id = messageId;
    messageId := messageId + 1;
    wall.put(id, message);
    return id;
  };

  public shared query func getMessage(messageId : Nat) : async Result.Result<Message, Text> {
    switch(wall.get(messageId)) {
        case (?message) return #ok(message);
        case (null) return #err("Invalid message id");
    };
  };

  public shared ({ caller }) func updateMessage(messageId : Nat, c : Content) : async Result.Result<(), Text> {
    switch(wall.get(messageId)){
        case (?message) {
            if(not (message.creator == caller)) {
                return #err("Only the creator of the message can update it");
            } else {
                let newMessage : Message = { content = c; vote = message.vote; creator = message.creator };
                wall.put(messageId, newMessage);
                return #ok();
            };
        };  
        case (null) return #err("Invalid message id");
    };
  };

  public shared ({ caller }) func deleteMessage(messageId : Nat) : async Result.Result<(), Text> {
    switch(wall.get(messageId)){
        case (?message) {
            if(not (message.creator == caller)) {
                return #err("Only the creator of the message can delete it");
            } else {
                wall.delete(messageId);
                return #ok();
            };
        };  
        case (null) return #err("Invalid message id");
    };
  };

  public func upVote(messageId : Nat) : async Result.Result<(), Text> {
    switch(wall.get(messageId)){
        case (?message) {
            let newMessage : Message = { content = message.content; vote = message.vote + 1; creator = message.creator };
            wall.put(messageId, newMessage);
            return #ok();
        };  
        case (null) return #err("Invalid message id");
    };
  };

    public func downVote(messageId : Nat) : async Result.Result<(), Text> {
        switch(wall.get(messageId)){
            case (?message) {
                let newMessage : Message = { content = message.content; vote = message.vote - 1; creator = message.creator };
                wall.put(messageId, newMessage);
                return #ok();
            };  
            case (null) return #err("Invalid message id");
        };
    };

    public func getAllMessages() : async [Message] {
        Iter.toArray<Message>(wall.vals());
    };

    // public func getAllMessagesRankes() : async [Message] {
    //     
    // };

};