export const idlFactory = ({ IDL }) => {
  const StudentProfile = IDL.Record({
    'graduate' : IDL.Bool,
    'Team' : IDL.Text,
    'name' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const StreamingCallbackToken = IDL.Record({
    'key' : IDL.Text,
    'index' : IDL.Nat,
    'content_encoding' : IDL.Text,
  });
  const StreamingCallbackResponse = IDL.Record({
    'token' : IDL.Opt(StreamingCallbackToken),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const StreamingCallback = IDL.Func(
      [StreamingCallbackToken],
      [StreamingCallbackResponse],
      ['query'],
    );
  const StreamingStrategy = IDL.Variant({
    'Callback' : IDL.Record({
      'token' : StreamingCallbackToken,
      'callback' : StreamingCallback,
    }),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'streaming_strategy' : IDL.Opt(StreamingStrategy),
    'status_code' : IDL.Nat16,
  });
  const Result_2 = IDL.Variant({ 'ok' : StudentProfile, 'err' : IDL.Text });
  const TestError = IDL.Variant({
    'UnexpectedValue' : IDL.Text,
    'UnexpectedError' : IDL.Text,
  });
  const TestResult = IDL.Variant({ 'ok' : IDL.Null, 'err' : TestError });
  const Result = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  return IDL.Service({
    'activateGraduation' : IDL.Func([], [], []),
    'addMyProfile' : IDL.Func([StudentProfile], [Result_1], []),
    'deactivateGraduation' : IDL.Func([], [], []),
    'deleteMyProfile' : IDL.Func([], [Result_1], []),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'seeAProfile' : IDL.Func([IDL.Principal], [Result_2], []),
    'test' : IDL.Func([IDL.Principal], [TestResult], []),
    'updateMyProfile' : IDL.Func([StudentProfile], [Result_1], []),
    'verifyOwnership' : IDL.Func([IDL.Principal, IDL.Principal], [Result], []),
    'verifyWork' : IDL.Func([IDL.Principal, IDL.Principal], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
