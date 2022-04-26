
# json-to-graphql-query Changelog

## 2.2.4

* Handled empty variables and empty directives (thanks @MorganDbs)

## 2.2.3

* Fixing args / directives order according to gql specs (thanks @MorganDbs)

## 2.2.2

* Updated dev dependencies.

## 2.2.0

* Added support for multiple directives per node (thanks @MorganDbs).

## 2.1.0

* Added support for named queries/mutations (thanks @peng-huang-cc). 

## 2.0.2

* Update package dependencies to handle security vulnerabilties

## 2.0.1

* Transfer ownership to @vkolgi - thanks for taking the reins!

## 2.0.0

* Update to TypeScript 3.7
* Support for full inline fragments (thanks @ConnorWhite)
* Remove deprecated `__alias` (use `__aliasFor` instead)

## 1.9.0

* Added support for array values. We now use the first object found in an array for the
  node names. If the array does not contain an object, we just return the corresponding key.
* Added `includeFalsyKeys` option, to disable the default behaviour of excluding keys with falsy values.
  Thanks @bret-hubbard for both of these additions :)

## 1.8.0

* Added support for Inline Fragments. Thanks again @jeniffer9 :)

## 1.7.0

* Added `__aliasFor` option. The old `__alias` syntax did not support more than one alias. Thanks @jeniffer9
* IMPORTANT: `__alias` is now deprecated and will be removed in version 2.0.0

## 1.6.0

* Added support for `@client` directives (and other directives that don't need arguments). Thanks @joeflack4!
* Added nicer JSON.stringify support for VariableType. Thanks @terion-name

## 1.5.0

* Added `ignoreFields` option. Thanks @plmercereau

## 1.4.0

* Added Variables support. Thanks @terion-name

## 1.3.0

* Added Alias support and made it possible to disable fields. Thanks @wellguimaraes

## 1.2.0

* Added Enum support, thanks @douglaseggleton
