import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Activity {
  'activityId' : string,
  'specialAnnouncement' : string,
  'activity' : string,
}
export type CanisterCyclesAggregatedData = BigUint64Array | bigint[];
export type CanisterHeapMemoryAggregatedData = BigUint64Array | bigint[];
export type CanisterLogFeature = { 'filterMessageByContains' : null } |
  { 'filterMessageByRegex' : null };
export interface CanisterLogMessages {
  'data' : Array<LogMessagesData>,
  'lastAnalyzedMessageTimeNanos' : [] | [Nanos],
}
export interface CanisterLogMessagesInfo {
  'features' : Array<[] | [CanisterLogFeature]>,
  'lastTimeNanos' : [] | [Nanos],
  'count' : number,
  'firstTimeNanos' : [] | [Nanos],
}
export type CanisterLogRequest = { 'getMessagesInfo' : null } |
  { 'getMessages' : GetLogMessagesParameters } |
  { 'getLatestMessages' : GetLatestLogMessagesParameters };
export type CanisterLogResponse = { 'messagesInfo' : CanisterLogMessagesInfo } |
  { 'messages' : CanisterLogMessages };
export type CanisterMemoryAggregatedData = BigUint64Array | bigint[];
export interface CanisterMetrics { 'data' : CanisterMetricsData }
export type CanisterMetricsData = { 'hourly' : Array<HourlyMetricsData> } |
  { 'daily' : Array<DailyMetricsData> };
export interface DailyMetricsData {
  'updateCalls' : bigint,
  'canisterHeapMemorySize' : NumericEntity,
  'canisterCycles' : NumericEntity,
  'canisterMemorySize' : NumericEntity,
  'timeMillis' : bigint,
}
export interface DailyProject {
  'day' : bigint,
  'timeStamp' : bigint,
  'canisterId' : Principal,
}
export interface DailyProjectText {
  'day' : string,
  'timeStamp' : string,
  'canisterId' : string,
}
export interface DailyTotalMetrics {
  'day1' : string,
  'day2' : string,
  'day3' : string,
  'day4' : string,
  'day5' : string,
}
export interface Dashboard {
  'acceptCycles' : ActorMethod<[], undefined>,
  'adminAnnounceTimedEvent' : ActorMethod<[string], undefined>,
  'adminCreateTeam' : ActorMethod<[string, boolean], Result_7>,
  'adminGrantBonusPoints' : ActorMethod<[string, string], Result>,
  'adminManuallyVerifyStudentDay' : ActorMethod<[bigint, string], Result>,
  'adminSpecialAnnouncement' : ActorMethod<[string], undefined>,
  'availableCycles' : ActorMethod<[], bigint>,
  'collectCanisterMetrics' : ActorMethod<[], undefined>,
  'getActivity' : ActorMethod<[bigint, bigint], Array<Activity>>,
  'getActivityFeed' : ActorMethod<[], Array<Activity>>,
  'getAdmins' : ActorMethod<[], Result_6>,
  'getAllStudents' : ActorMethod<[], Result_6>,
  'getAllStudentsPrincipal' : ActorMethod<[], Array<Principal>>,
  'getAllTeams' : ActorMethod<[], Array<TeamString>>,
  'getCanisterLog' : ActorMethod<
    [[] | [CanisterLogRequest]],
    [] | [CanisterLogResponse]
  >,
  'getCanisterMetrics' : ActorMethod<
    [GetMetricsParameters],
    [] | [CanisterMetrics]
  >,
  'getStudent' : ActorMethod<[string], Result_1>,
  'getStudentCompletedDays' : ActorMethod<[], Result_5>,
  'getStudentPrincipalByName' : ActorMethod<[string], Result_4>,
  'getStudentsForTeamDashboard' : ActorMethod<[string], Result_3>,
  'getStudentsFromTeam' : ActorMethod<[string], Result_2>,
  'getTeam' : ActorMethod<[string], Team>,
  'getTotalCompletedPerDay' : ActorMethod<[], DailyTotalMetrics>,
  'getTotalProjectsCompleted' : ActorMethod<[], string>,
  'getTotalStudents' : ActorMethod<[], string>,
  'getTotalTeams' : ActorMethod<[], string>,
  'getUser' : ActorMethod<[], Result_1>,
  'isStudent' : ActorMethod<[string], boolean>,
  'registerAdmin' : ActorMethod<[string], Result>,
  'registerStudent' : ActorMethod<[string, string, boolean], Result_1>,
  'setMaxMessagesCount' : ActorMethod<[bigint], undefined>,
  'unregisterAdmin' : ActorMethod<[string], Result>,
  'verifyProject' : ActorMethod<[string, bigint], VerifyProject>,
}
export interface GetLatestLogMessagesParameters {
  'upToTimeNanos' : [] | [Nanos],
  'count' : number,
  'filter' : [] | [GetLogMessagesFilter],
}
export interface GetLogMessagesFilter {
  'analyzeCount' : number,
  'messageRegex' : [] | [string],
  'messageContains' : [] | [string],
}
export interface GetLogMessagesParameters {
  'count' : number,
  'filter' : [] | [GetLogMessagesFilter],
  'fromTimeNanos' : [] | [Nanos],
}
export interface GetMetricsParameters {
  'dateToMillis' : bigint,
  'granularity' : MetricsGranularity,
  'dateFromMillis' : bigint,
}
export interface HourlyMetricsData {
  'updateCalls' : UpdateCallsAggregatedData,
  'canisterHeapMemorySize' : CanisterHeapMemoryAggregatedData,
  'canisterCycles' : CanisterCyclesAggregatedData,
  'canisterMemorySize' : CanisterMemoryAggregatedData,
  'timeMillis' : bigint,
}
export interface LogMessagesData { 'timeNanos' : Nanos, 'message' : string }
export type MetricsGranularity = { 'hourly' : null } |
  { 'daily' : null };
export type Nanos = bigint;
export interface NumericEntity {
  'avg' : bigint,
  'max' : bigint,
  'min' : bigint,
  'first' : bigint,
  'last' : bigint,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : Student } |
  { 'err' : string };
export type Result_2 = { 'ok' : Array<Student> } |
  { 'err' : string };
export type Result_3 = { 'ok' : Array<StudentList> } |
  { 'err' : string };
export type Result_4 = { 'ok' : string } |
  { 'err' : string };
export type Result_5 = { 'ok' : Array<DailyProjectText> } |
  { 'err' : string };
export type Result_6 = { 'ok' : Array<string> } |
  { 'err' : string };
export type Result_7 = { 'ok' : Team } |
  { 'err' : string };
export interface Student {
  'completedDays' : Array<DailyProject>,
  'teamName' : string,
  'name' : string,
  'bonusPoints' : bigint,
  'score' : bigint,
  'cliPrincipalId' : string,
  'principalId' : string,
}
export interface StudentList {
  'name' : string,
  'bonusPoints' : string,
  'score' : string,
}
export interface Team {
  'name' : string,
  'teamMembers' : Array<string>,
  'score' : bigint,
  'spanish' : boolean,
}
export interface TeamString {
  'name' : string,
  'teamMembers' : Array<string>,
  'score' : string,
}
export type UpdateCallsAggregatedData = BigUint64Array | bigint[];
export type VerifyProject = { 'ok' : null } |
  {
    'err' : { 'NotAController' : string } |
      { 'NotAStudent' : string } |
      { 'UnexpectedValue' : string } |
      { 'InvalidDay' : string } |
      { 'UnexpectedError' : string } |
      { 'AlreadyCompleted' : string } |
      { 'NotImplemented' : string }
  };
export interface _SERVICE extends Dashboard {}
