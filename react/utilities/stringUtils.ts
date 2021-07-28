// Object.assign(String.prototype, {
//     format(): string {
//         let str = this;
//         for (let arg in arguments) {
//             str = str.replace('{' + arg + '}', arguments[arg]);
//         }
//         return str;
//     },
// });

/***
 * @example formatString("my name is %s1 and surname is %s2", "John", "Doe");
 * @return "my name is John and surname is Doe"
 *
 * @firstArgument {String} like "my name is %s1 and surname is %s2"
 * @otherArguments {String | Number}
 * @returns {String}
 */
export const formatString = (...args) => {
    const str = args[0];
    const params = args.filter((arg, index) => index !== 0);
    if (!str) return '';
    return str.replace(/%s[0-9]+/g, (matchedStr) => {
        const variableIndex = matchedStr.replace('%s', '') - 1;
        return params[variableIndex];
    });
};
