import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Nat32 "mo:base/Nat32";
import Char "mo:base/Char";
import Prim "mo:prim";

module {
    // Parses the controllers from the error returned by canister status when the caller is not the controller
    /// Of the canister it is calling
    // From https://forum.dfinity.org/t/getting-a-canisters-controller-on-chain/7531/17
    public func parseControllersFromCanisterStatusErrorIfCallerNotController(errorMessage : Text) : [Principal] {
        let lines = Iter.toArray(Text.split(errorMessage, #text("\n")));
        let words = Iter.toArray(Text.split(lines[1], #text(" ")));
        var i = 2;
        let controllers = Buffer.Buffer<Principal>(0);
        while (i < words.size()) {
            controllers.add(Principal.fromText(words[i]));
            i += 1
        };
        Buffer.toArray<Principal>(controllers)
    };

    public func safeGet<K, V>(hashMap : HashMap.HashMap<K, V>, key : K, defaultValue : V) : V {
        switch (hashMap.get(key)) {
            case null defaultValue;
            case (?value) value
        }
    };

    public func textToNat(txt : Text) : Nat {
        assert (txt.size() > 0);
        let chars = txt.chars();

        var num : Nat = 0;
        for (v in chars) {
            let charToNum = Nat32.toNat(Char.toNat32(v) -48);
            assert (charToNum >= 0 and charToNum <= 9);
            num := num * 10 + charToNum
        };

        num
    };

    private func trimPattern(char : Char) : Bool {
        Char.equal(' ', char) or Char.equal('\r', char) or Char.equal('\n', char)
    };

    public func trim(value : Text) : Text {
        Text.trim(value, #predicate(trimPattern))
    };

    public func lowerCase(value : Text) : Text {
        Text.map(value, Prim.charToLower)
    };

    public func upperCase(value : Text) : Text {
        Text.map(value, Prim.charToUpper)
    };

}
