// export function ValidateIdNumber(idNumber: string) {
//     const IdExpression = "(?<Year>[0-9][0-9])(?<Month>([0][1-9])|([1][0-2]))(?<Day>([0-2][0-9])|([3][0-1]))(?<Gender>[0-9])(?<Series>[0-9]{3})(?<Citizenship>[0-9])(?<Uniform>[0-9])(?<Control>[0-9])";
//     var regexp = new RegExp(IdExpression);
//     var cc = regexp.test(idNumber);
//     return regexp.test(idNumber);;
// }
// export function ValidateSouthAfricanPhonenumber(phoneNumber: string) {
//     const phExpression = "^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$";
//     var regexp = new RegExp(phExpression);
//     return regexp.test(phoneNumber);
// }

export function validEmailAddress(email: string): boolean {
    const emailExpression = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
    var regexp = new RegExp(emailExpression);
    return regexp.test(email);
}

export function validStudentNumber(studentNumber: string) {
    const studentNumberexpression = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
    var regexp = new RegExp(studentNumberexpression);
    return regexp.test(studentNumber);
}

export function validateStrongPassowrd(password: string): boolean {
    const passwordExpression = "^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$";
    var regexp = new RegExp(passwordExpression);
    return regexp.test(password);
}