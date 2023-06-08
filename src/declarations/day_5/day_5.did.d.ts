import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type HeaderField = [string, string];
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Uint8Array | number[],
  'headers' : Array<HeaderField>,
}
export interface HttpResponse {
  'body' : Uint8Array | number[],
  'headers' : Array<HeaderField>,
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export type Result = { 'ok' : boolean } |
  { 'err' : string };
export type Result_1 = { 'ok' : null } |
  { 'err' : string };
export type Result_2 = { 'ok' : StudentProfile } |
  { 'err' : string };
export type StreamingCallback = ActorMethod<
  [StreamingCallbackToken],
  StreamingCallbackResponse
>;
export interface StreamingCallbackResponse {
  'token' : [] | [StreamingCallbackToken],
  'body' : Uint8Array | number[],
}
export interface StreamingCallbackToken {
  'key' : string,
  'index' : bigint,
  'content_encoding' : string,
}
export type StreamingStrategy = {
    'Callback' : {
      'token' : StreamingCallbackToken,
      'callback' : StreamingCallback,
    }
  };
export interface StudentProfile {
  'graduate' : boolean,
  'Team' : string,
  'name' : string,
}
export type TestError = { 'UnexpectedValue' : string } |
  { 'UnexpectedError' : string };
export type TestResult = { 'ok' : null } |
  { 'err' : TestError };
export interface _SERVICE {
  'activateGraduation' : ActorMethod<[], undefined>,
  'addMyProfile' : ActorMethod<[StudentProfile], Result_1>,
  'deactivateGraduation' : ActorMethod<[], undefined>,
  'deleteMyProfile' : ActorMethod<[], Result_1>,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'seeAProfile' : ActorMethod<[Principal], Result_2>,
  'test' : ActorMethod<[Principal], TestResult>,
  'updateMyProfile' : ActorMethod<[StudentProfile], Result_1>,
  'verifyOwnership' : ActorMethod<[Principal, Principal], Result>,
  'verifyWork' : ActorMethod<[Principal, Principal], Result>,
}
