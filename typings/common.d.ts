// generic utils
declare type AllOptional<T> = { [Property in keyof T]?: T[Property]; };
declare type CreateGetters<T> = { [Property in keyof T as `get${Capitalize<string & Property>}`]: () => T[Property] };
declare type CreateImmutable<T> = { +readonly [Property in keyof T]: T[Property]; };
declare type CreateMutable<T> = { -readonly [Property in keyof T]: T[Property]; };
declare type KeyValueType<T> = {[k:string]:T};
declare type NonNullable<T> = T extends null | undefined ? never : T;
declare type OneOrMany<T> = T | T[];
declare type OneOrManyOrNull<T> = OrNull<OneOrMany<T>>;
declare type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
declare type OrNull<T> = T | null;
declare type OrUndefined<T> = T | undefined;
declare type StringKeys<T> = keyof T;
declare type StringMap<T> = { [P in keyof T]: string };
declare type ValidateEnum<SourceOfTruth, TypeOfEnum> = Extract<SourceOfTruth, keyof TypeOfEnum>;

// helpers
export type ParamsOfFunctionType<F> = ThisParameterType<F>; // USAGE: const fncParams:ParamsOfFunctionType<typeof myFunction>
export type RealParamsOfFunctionType<F> = NonNullable<ParamsOfFunctionType<F>>;
