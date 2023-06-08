export const idlFactory = ({ IDL }) => {
  return IDL.Service({ 'isEven' : IDL.Func([IDL.Int], [IDL.Bool], []) });
};
export const init = ({ IDL }) => { return []; };
