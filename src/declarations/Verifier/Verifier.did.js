export const idlFactory = ({ IDL }) => {
  const Team = IDL.Record({
    'name' : IDL.Text,
    'teamMembers' : IDL.Vec(IDL.Text),
    'score' : IDL.Nat,
    'spanish' : IDL.Bool,
  });
  const Result_7 = IDL.Variant({ 'ok' : Team, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Activity = IDL.Record({
    'activityId' : IDL.Text,
    'specialAnnouncement' : IDL.Text,
    'activity' : IDL.Text,
  });
  const Result_6 = IDL.Variant({ 'ok' : IDL.Vec(IDL.Text), 'err' : IDL.Text });
  const TeamString = IDL.Record({
    'name' : IDL.Text,
    'teamMembers' : IDL.Vec(IDL.Text),
    'score' : IDL.Text,
  });
  const GetLogMessagesFilter = IDL.Record({
    'analyzeCount' : IDL.Nat32,
    'messageRegex' : IDL.Opt(IDL.Text),
    'messageContains' : IDL.Opt(IDL.Text),
  });
  const Nanos = IDL.Nat64;
  const GetLogMessagesParameters = IDL.Record({
    'count' : IDL.Nat32,
    'filter' : IDL.Opt(GetLogMessagesFilter),
    'fromTimeNanos' : IDL.Opt(Nanos),
  });
  const GetLatestLogMessagesParameters = IDL.Record({
    'upToTimeNanos' : IDL.Opt(Nanos),
    'count' : IDL.Nat32,
    'filter' : IDL.Opt(GetLogMessagesFilter),
  });
  const CanisterLogRequest = IDL.Variant({
    'getMessagesInfo' : IDL.Null,
    'getMessages' : GetLogMessagesParameters,
    'getLatestMessages' : GetLatestLogMessagesParameters,
  });
  const CanisterLogFeature = IDL.Variant({
    'filterMessageByContains' : IDL.Null,
    'filterMessageByRegex' : IDL.Null,
  });
  const CanisterLogMessagesInfo = IDL.Record({
    'features' : IDL.Vec(IDL.Opt(CanisterLogFeature)),
    'lastTimeNanos' : IDL.Opt(Nanos),
    'count' : IDL.Nat32,
    'firstTimeNanos' : IDL.Opt(Nanos),
  });
  const LogMessagesData = IDL.Record({
    'timeNanos' : Nanos,
    'message' : IDL.Text,
  });
  const CanisterLogMessages = IDL.Record({
    'data' : IDL.Vec(LogMessagesData),
    'lastAnalyzedMessageTimeNanos' : IDL.Opt(Nanos),
  });
  const CanisterLogResponse = IDL.Variant({
    'messagesInfo' : CanisterLogMessagesInfo,
    'messages' : CanisterLogMessages,
  });
  const MetricsGranularity = IDL.Variant({
    'hourly' : IDL.Null,
    'daily' : IDL.Null,
  });
  const GetMetricsParameters = IDL.Record({
    'dateToMillis' : IDL.Nat,
    'granularity' : MetricsGranularity,
    'dateFromMillis' : IDL.Nat,
  });
  const UpdateCallsAggregatedData = IDL.Vec(IDL.Nat64);
  const CanisterHeapMemoryAggregatedData = IDL.Vec(IDL.Nat64);
  const CanisterCyclesAggregatedData = IDL.Vec(IDL.Nat64);
  const CanisterMemoryAggregatedData = IDL.Vec(IDL.Nat64);
  const HourlyMetricsData = IDL.Record({
    'updateCalls' : UpdateCallsAggregatedData,
    'canisterHeapMemorySize' : CanisterHeapMemoryAggregatedData,
    'canisterCycles' : CanisterCyclesAggregatedData,
    'canisterMemorySize' : CanisterMemoryAggregatedData,
    'timeMillis' : IDL.Int,
  });
  const NumericEntity = IDL.Record({
    'avg' : IDL.Nat64,
    'max' : IDL.Nat64,
    'min' : IDL.Nat64,
    'first' : IDL.Nat64,
    'last' : IDL.Nat64,
  });
  const DailyMetricsData = IDL.Record({
    'updateCalls' : IDL.Nat64,
    'canisterHeapMemorySize' : NumericEntity,
    'canisterCycles' : NumericEntity,
    'canisterMemorySize' : NumericEntity,
    'timeMillis' : IDL.Int,
  });
  const CanisterMetricsData = IDL.Variant({
    'hourly' : IDL.Vec(HourlyMetricsData),
    'daily' : IDL.Vec(DailyMetricsData),
  });
  const CanisterMetrics = IDL.Record({ 'data' : CanisterMetricsData });
  const DailyProject = IDL.Record({
    'day' : IDL.Nat,
    'timeStamp' : IDL.Nat64,
    'canisterId' : IDL.Principal,
  });
  const Student = IDL.Record({
    'completedDays' : IDL.Vec(DailyProject),
    'teamName' : IDL.Text,
    'name' : IDL.Text,
    'bonusPoints' : IDL.Nat,
    'score' : IDL.Nat,
    'cliPrincipalId' : IDL.Text,
    'principalId' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : Student, 'err' : IDL.Text });
  const DailyProjectText = IDL.Record({
    'day' : IDL.Text,
    'timeStamp' : IDL.Text,
    'canisterId' : IDL.Text,
  });
  const Result_5 = IDL.Variant({
    'ok' : IDL.Vec(DailyProjectText),
    'err' : IDL.Text,
  });
  const Result_4 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const StudentList = IDL.Record({
    'name' : IDL.Text,
    'bonusPoints' : IDL.Text,
    'score' : IDL.Text,
  });
  const Result_3 = IDL.Variant({
    'ok' : IDL.Vec(StudentList),
    'err' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Vec(Student), 'err' : IDL.Text });
  const DailyTotalMetrics = IDL.Record({
    'day1' : IDL.Text,
    'day2' : IDL.Text,
    'day3' : IDL.Text,
    'day4' : IDL.Text,
    'day5' : IDL.Text,
  });
  const VerifyProject = IDL.Variant({
    'ok' : IDL.Null,
    'err' : IDL.Variant({
      'NotAController' : IDL.Text,
      'NotAStudent' : IDL.Text,
      'UnexpectedValue' : IDL.Text,
      'InvalidDay' : IDL.Text,
      'UnexpectedError' : IDL.Text,
      'AlreadyCompleted' : IDL.Text,
      'NotImplemented' : IDL.Text,
    }),
  });
  const Dashboard = IDL.Service({
    'acceptCycles' : IDL.Func([], [], []),
    'adminAnnounceTimedEvent' : IDL.Func([IDL.Text], [], []),
    'adminCreateTeam' : IDL.Func([IDL.Text, IDL.Bool], [Result_7], []),
    'adminGrantBonusPoints' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'adminManuallyVerifyStudentDay' : IDL.Func(
        [IDL.Nat, IDL.Text],
        [Result],
        [],
      ),
    'adminSpecialAnnouncement' : IDL.Func([IDL.Text], [], []),
    'availableCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'collectCanisterMetrics' : IDL.Func([], [], []),
    'getActivity' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(Activity)],
        ['query'],
      ),
    'getActivityFeed' : IDL.Func([], [IDL.Vec(Activity)], ['query']),
    'getAdmins' : IDL.Func([], [Result_6], ['query']),
    'getAllStudents' : IDL.Func([], [Result_6], []),
    'getAllStudentsPrincipal' : IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    'getAllTeams' : IDL.Func([], [IDL.Vec(TeamString)], ['query']),
    'getCanisterLog' : IDL.Func(
        [IDL.Opt(CanisterLogRequest)],
        [IDL.Opt(CanisterLogResponse)],
        ['query'],
      ),
    'getCanisterMetrics' : IDL.Func(
        [GetMetricsParameters],
        [IDL.Opt(CanisterMetrics)],
        ['query'],
      ),
    'getStudent' : IDL.Func([IDL.Text], [Result_1], []),
    'getStudentCompletedDays' : IDL.Func([], [Result_5], []),
    'getStudentPrincipalByName' : IDL.Func([IDL.Text], [Result_4], []),
    'getStudentsForTeamDashboard' : IDL.Func([IDL.Text], [Result_3], ['query']),
    'getStudentsFromTeam' : IDL.Func([IDL.Text], [Result_2], []),
    'getTeam' : IDL.Func([IDL.Text], [Team], []),
    'getTotalCompletedPerDay' : IDL.Func([], [DailyTotalMetrics], ['query']),
    'getTotalProjectsCompleted' : IDL.Func([], [IDL.Text], ['query']),
    'getTotalStudents' : IDL.Func([], [IDL.Text], ['query']),
    'getTotalTeams' : IDL.Func([], [IDL.Text], ['query']),
    'getUser' : IDL.Func([], [Result_1], []),
    'isStudent' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'registerAdmin' : IDL.Func([IDL.Text], [Result], []),
    'registerStudent' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Bool],
        [Result_1],
        [],
      ),
    'setMaxMessagesCount' : IDL.Func([IDL.Nat], [], []),
    'unregisterAdmin' : IDL.Func([IDL.Text], [Result], []),
    'verifyProject' : IDL.Func([IDL.Text, IDL.Nat], [VerifyProject], []),
  });
  return Dashboard;
};
export const init = ({ IDL }) => { return []; };
